class Storage {
    static TASKS_KEY = 'task-app-tasks';
    static EMOJIS_KEY = 'task-app-emojis';
    static LEVEL_KEY = 'task-app-level';

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

    static getLevelData() {
        try {
            const levelData = localStorage.getItem(this.LEVEL_KEY);
            return levelData ? JSON.parse(levelData) : {};
        } catch (error) {
            console.error('Error loading level data:', error);
            return {};
        }
    }

    static saveLevelData(levelData) {
        try {
            localStorage.setItem(this.LEVEL_KEY, JSON.stringify(levelData));
        } catch (error) {
            console.error('Error saving level data:', error);
        }
    }

    static clearAll() {
        try {
            localStorage.removeItem(this.TASKS_KEY);
            localStorage.removeItem(this.EMOJIS_KEY);
            localStorage.removeItem(this.LEVEL_KEY);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}

export default Storage;