// Storage utility
class Storage {
    static TASKS_KEY = 'task-app-tasks';
    static EMOJIS_KEY = 'task-app-emojis';

    static getTasks() {
        try {
            const tasks = localStorage.getItem(this.TASKS_KEY);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    static saveTasks(tasks) {
        try {
            localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

    static getEmojis() {
        try {
            const emojis = localStorage.getItem(this.EMOJIS_KEY);
            return emojis ? JSON.parse(emojis) : [];
        } catch (error) {
            console.error('Error loading emojis:', error);
            return [];
        }
    }

    static saveEmojis(emojis) {
        try {
            localStorage.setItem(this.EMOJIS_KEY, JSON.stringify(emojis));
        } catch (error) {
            console.error('Error saving emojis:', error);
        }
    }

    static clearAll() {
        try {
            localStorage.removeItem(this.TASKS_KEY);
            localStorage.removeItem(this.EMOJIS_KEY);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}

// Task Manager
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

// Emoji Manager
class EmojiManager {
    constructor() {
        this.collectedEmojis = Storage.getEmojis();
        this.emojiPool = [
            '🎉', '🎊', '🏆', '🌟', '⭐', '✨', '💫', '🎯', '🚀', '💪',
            '👏', '🙌', '💯', '🔥', '⚡', '💎', '🎪', '🎨', '🎭', '🎪',
            '🌈', '🦄', '🐙', '🦋', '🌺', '🌸', '🌻', '🌷', '🌹', '🏔️',
            '🗻', '🏝️', '🏖️', '🌊', '🐬', '🐢', '🦀', '🐙', '🌙', '☀️',
            '🌞', '⭐', '🌟', '💫', '✨', '🎇', '🎆', '🎈', '🎁', '🎀',
            '🍰', '🧁', '🍪', '🍯', '🍓', '🍉', '🍊', '🍋', '🥝', '🥭',
            '🍇', '🍑', '🍒', '🥥', '🍍', '🥨', '🥯', '🥞', '🧇', '🍕',
            '🌮', '🌯', '🥙', '🥗', '🍜', '🍲', '🥘', '🍳', '🥚', '🧀'
        ];
    }

    unlockRandomEmoji() {
        const availableEmojis = this.emojiPool.filter(
            emoji => !this.collectedEmojis.some(collected => collected.emoji === emoji)
        );

        if (availableEmojis.length === 0) {
            const randomEmoji = this.emojiPool[Math.floor(Math.random() * this.emojiPool.length)];
            return this.addEmojiToCollection(randomEmoji);
        }

        const randomEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
        return this.addEmojiToCollection(randomEmoji);
    }

    addEmojiToCollection(emoji) {
        const emojiEntry = {
            emoji,
            unlockedAt: new Date().toISOString(),
            id: Date.now()
        };

        this.collectedEmojis.push(emojiEntry);
        this.saveEmojis();
        return emojiEntry;
    }

    getCollectedEmojis() {
        return [...this.collectedEmojis];
    }

    getEmojiCount() {
        return this.collectedEmojis.length;
    }

    getUniqueEmojiCount() {
        const uniqueEmojis = new Set(this.collectedEmojis.map(item => item.emoji));
        return uniqueEmojis.size;
    }

    hasEmoji(emoji) {
        return this.collectedEmojis.some(item => item.emoji === emoji);
    }

    getEmojiStats() {
        return {
            total: this.getEmojiCount(),
            unique: this.getUniqueEmojiCount(),
            available: this.emojiPool.length,
            completionPercentage: Math.round((this.getUniqueEmojiCount() / this.emojiPool.length) * 100)
        };
    }

    saveEmojis() {
        Storage.saveEmojis(this.collectedEmojis);
    }

    clearAllEmojis() {
        this.collectedEmojis = [];
        this.saveEmojis();
    }

    getRecentEmojis(count = 5) {
        return this.collectedEmojis
            .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
            .slice(0, count);
    }
}

// Main Application
class TaskApp {
    constructor() {
        this.taskManager = new TaskManager();
        this.emojiManager = new EmojiManager();
        this.currentEditingTaskId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        this.taskInput = document.getElementById('task-input');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.taskList = document.getElementById('task-list');
        this.emptyState = document.getElementById('empty-state');
        this.emojiCollection = document.getElementById('emoji-collection');
        this.emojiEmptyState = document.getElementById('emoji-empty-state');
        this.emojiCount = document.querySelector('.emoji-count');
        
        this.editModal = document.getElementById('edit-modal');
        this.editTaskInput = document.getElementById('edit-task-input');
        this.saveEditBtn = document.getElementById('save-edit-btn');
        this.cancelEditBtn = document.getElementById('cancel-edit-btn');
        
        this.celebrationModal = document.getElementById('celebration-modal');
        this.newEmojiDisplay = document.getElementById('new-emoji');
        this.closeCelebrationBtn = document.getElementById('close-celebration-btn');
    }

    attachEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.saveEditBtn.addEventListener('click', () => this.saveEdit());
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        this.editTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveEdit();
            if (e.key === 'Escape') this.closeEditModal();
        });

        this.closeCelebrationBtn.addEventListener('click', () => this.closeCelebrationModal());

        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });

        this.celebrationModal.addEventListener('click', (e) => {
            if (e.target === this.celebrationModal) this.closeCelebrationModal();
        });
    }

    addTask() {
        const title = this.taskInput.value.trim();
        if (!title) return;

        try {
            this.taskManager.createTask(title);
            this.taskInput.value = '';
            this.render();
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Error adding task. Please try again.');
        }
    }

    editTask(id) {
        const task = this.taskManager.getTaskById(id);
        if (!task) return;

        this.currentEditingTaskId = id;
        this.editTaskInput.value = task.title;
        this.showEditModal();
    }

    saveEdit() {
        if (!this.currentEditingTaskId) return;

        const title = this.editTaskInput.value.trim();
        if (!title) {
            alert('Task title cannot be empty');
            return;
        }

        try {
            this.taskManager.editTask(this.currentEditingTaskId, title);
            this.closeEditModal();
            this.render();
        } catch (error) {
            console.error('Error editing task:', error);
            alert('Error editing task. Please try again.');
        }
    }

    deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            this.taskManager.deleteTask(id);
            this.render();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error deleting task. Please try again.');
        }
    }

    toggleTask(id) {
        try {
            const task = this.taskManager.toggleTask(id);
            
            if (task.completed) {
                const newEmoji = this.emojiManager.unlockRandomEmoji();
                this.showCelebration(newEmoji.emoji);
            }
            
            this.render();
        } catch (error) {
            console.error('Error toggling task:', error);
            alert('Error updating task. Please try again.');
        }
    }

    showEditModal() {
        this.editModal.classList.add('show');
        this.editTaskInput.focus();
        this.editTaskInput.select();
    }

    closeEditModal() {
        this.editModal.classList.remove('show');
        this.currentEditingTaskId = null;
        this.editTaskInput.value = '';
    }

    showCelebration(emoji) {
        this.newEmojiDisplay.textContent = emoji;
        this.celebrationModal.classList.add('show');
    }

    closeCelebrationModal() {
        this.celebrationModal.classList.remove('show');
    }

    renderTasks() {
        const tasks = this.taskManager.getAllTasks();
        
        if (tasks.length === 0) {
            this.taskList.style.display = 'none';
            this.emptyState.style.display = 'block';
            return;
        }

        this.taskList.style.display = 'block';
        this.emptyState.style.display = 'none';

        this.taskList.innerHTML = tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="app.toggleTask(${task.id})"
                >
                <div class="task-content">${this.escapeHtml(task.title)}</div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="app.editTask(${task.id})">Edit</button>
                    <button class="delete-btn" onclick="app.deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    renderEmojis() {
        const emojis = this.emojiManager.getCollectedEmojis();
        const emojiCount = this.emojiManager.getEmojiCount();
        
        this.emojiCount.textContent = emojiCount;

        if (emojis.length === 0) {
            this.emojiCollection.style.display = 'none';
            this.emojiEmptyState.style.display = 'block';
            return;
        }

        this.emojiCollection.style.display = 'grid';
        this.emojiEmptyState.style.display = 'none';

        this.emojiCollection.innerHTML = emojis
            .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
            .map(item => `
                <div class="emoji-item" title="Unlocked: ${new Date(item.unlockedAt).toLocaleDateString()}">
                    ${item.emoji}
                </div>
            `).join('');
    }

    render() {
        this.renderTasks();
        this.renderEmojis();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TaskApp();
});