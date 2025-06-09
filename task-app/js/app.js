import TaskManager from './modules/taskManager.js';
import EmojiManager from './modules/emojiManager.js';
import LevelManager from './modules/levelManager.js';

class TaskApp {
    constructor() {
        this.taskManager = new TaskManager();
        this.emojiManager = new EmojiManager();
        this.levelManager = new LevelManager();
        this.currentEditingTaskId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        this.taskInput = document.getElementById('task-input');
        this.difficultySelect = document.getElementById('difficulty-select');
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.taskList = document.getElementById('task-list');
        this.emptyState = document.getElementById('empty-state');
        this.emojiCollection = document.getElementById('emoji-collection');
        this.emojiEmptyState = document.getElementById('emoji-empty-state');
        this.emojiCount = document.querySelector('.emoji-count');
        
        // Level UI elements
        this.levelNumber = document.querySelector('.level-number');
        this.currentXP = document.querySelector('.current-xp');
        this.xpToNext = document.querySelector('.xp-to-next');
        this.xpProgressFill = document.querySelector('.xp-progress-fill');
        
        this.editModal = document.getElementById('edit-modal');
        this.editTaskInput = document.getElementById('edit-task-input');
        this.saveEditBtn = document.getElementById('save-edit-btn');
        this.cancelEditBtn = document.getElementById('cancel-edit-btn');
        
        this.celebrationModal = document.getElementById('celebration-modal');
        this.celebrationTitle = document.getElementById('celebration-title');
        this.celebrationMessage = document.getElementById('celebration-message');
        this.xpGainedDisplay = document.getElementById('xp-gained-display');
        this.xpAmount = document.getElementById('xp-amount');
        this.levelUpDisplay = document.getElementById('level-up-display');
        this.newLevelSpan = document.getElementById('new-level');
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
        const difficulty = this.difficultySelect.value;
        if (!title) return;

        try {
            this.taskManager.createTask(title, '', difficulty);
            this.taskInput.value = '';
            this.difficultySelect.value = 'simple';
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
            const task = this.taskManager.getTaskById(id);
            if (!task) return;
            
            const wasCompleted = task.completed;
            
            if (!wasCompleted) {
                // Task is being completed
                const levelResult = this.levelManager.addXP(task.difficulty);
                const updatedTask = this.taskManager.toggleTask(id, levelResult.xpGained, 1);
                const newEmoji = this.emojiManager.unlockRandomEmoji();
                
                this.showCelebration(newEmoji.emoji, levelResult);
            } else {
                // Task is being uncompleted
                this.taskManager.toggleTask(id);
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

    showCelebration(emoji, levelResult) {
        this.newEmojiDisplay.textContent = emoji;
        this.xpAmount.textContent = levelResult.xpGained;
        
        if (levelResult.leveledUp) {
            this.celebrationTitle.textContent = 'Level Up! 🎊';
            this.celebrationMessage.textContent = `You reached Level ${levelResult.newLevel} and unlocked a new emoji!`;
            this.levelUpDisplay.style.display = 'block';
            this.newLevelSpan.textContent = levelResult.newLevel;
        } else {
            this.celebrationTitle.textContent = 'Task Completed! 🎉';
            this.celebrationMessage.textContent = 'You unlocked a new emoji!';
            this.levelUpDisplay.style.display = 'none';
        }
        
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
                <div class="task-content">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-difficulty difficulty-${task.difficulty || 'simple'}">
                        ${this.getDifficultyText(task.difficulty || 'simple')}
                    </div>
                </div>
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

    renderLevelInfo() {
        const stats = this.levelManager.getStats();
        
        this.levelNumber.textContent = stats.level;
        this.currentXP.textContent = stats.currentXP;
        this.xpToNext.textContent = stats.xpToNextLevel;
        this.xpProgressFill.style.width = `${stats.progress.percentage}%`;
    }

    render() {
        this.renderTasks();
        this.renderEmojis();
        this.renderLevelInfo();
    }

    getDifficultyText(difficulty) {
        const difficultyMap = {
            simple: 'Simple',
            medium: 'Medium', 
            hard: 'Hard'
        };
        return difficultyMap[difficulty] || 'Simple';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.app = new TaskApp();