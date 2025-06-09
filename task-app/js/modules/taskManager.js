import Storage from '../utils/storage.js';

class TaskManager {
    constructor() {
        this.tasks = Storage.getTasks();
        this.nextId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
    }

    createTask(title, description = '', difficulty = 'simple') {
        if (!title.trim()) {
            throw new Error('Task title cannot be empty');
        }

        const task = {
            id: this.nextId++,
            title: title.trim(),
            description: description.trim(),
            difficulty: difficulty,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
            xpAwarded: 0,
            streakMultiplier: 1
        };

        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    editTask(id, title, description = '', difficulty = null) {
        const task = this.getTaskById(id);
        if (!task) {
            throw new Error('Task not found');
        }

        if (!title.trim()) {
            throw new Error('Task title cannot be empty');
        }

        task.title = title.trim();
        task.description = description.trim();
        if (difficulty !== null) {
            task.difficulty = difficulty;
        }
        this.saveTasks();
        return task;
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1) {
            throw new Error('Task not found');
        }

        const deletedTask = this.tasks.splice(index, 1)[0];
        this.saveTasks();
        return deletedTask;
    }

    toggleTask(id, xpAwarded = 0, streakMultiplier = 1) {
        const task = this.getTaskById(id);
        if (!task) {
            throw new Error('Task not found');
        }

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        
        if (task.completed) {
            task.xpAwarded = xpAwarded;
            task.streakMultiplier = streakMultiplier;
        } else {
            task.xpAwarded = 0;
            task.streakMultiplier = 1;
        }
        
        this.saveTasks();
        return task;
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    getAllTasks() {
        return [...this.tasks];
    }

    getCompletedTasks() {
        return this.tasks.filter(task => task.completed);
    }

    getPendingTasks() {
        return this.tasks.filter(task => !task.completed);
    }

    getTaskCount() {
        return {
            total: this.tasks.length,
            completed: this.getCompletedTasks().length,
            pending: this.getPendingTasks().length
        };
    }

    saveTasks() {
        Storage.saveTasks(this.tasks);
    }

    clearAllTasks() {
        this.tasks = [];
        this.nextId = 1;
        this.saveTasks();
    }
}

export default TaskManager;