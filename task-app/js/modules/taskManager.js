import Storage from '../utils/storage.js';

class TaskManager {
    constructor() {
        this.tasks = Storage.getTasks();
        this.nextId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
    }

    createTask(title, description = '') {
        if (!title.trim()) {
            throw new Error('Task title cannot be empty');
        }

        const task = {
            id: this.nextId++,
            title: title.trim(),
            description: description.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    editTask(id, title, description = '') {
        const task = this.getTaskById(id);
        if (!task) {
            throw new Error('Task not found');
        }

        if (!title.trim()) {
            throw new Error('Task title cannot be empty');
        }

        task.title = title.trim();
        task.description = description.trim();
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

    toggleTask(id) {
        const task = this.getTaskById(id);
        if (!task) {
            throw new Error('Task not found');
        }

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
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