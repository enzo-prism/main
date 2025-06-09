import Storage from '../utils/storage.js';

class LevelManager {
    constructor() {
        this.levelData = Storage.getLevelData();
        this.baseXP = 10;
        this.difficultyMultipliers = {
            simple: 1,
            medium: 1.5,
            hard: 2
        };
        this.streakBonusXP = 5;
        this.initializeLevelData();
    }

    initializeLevelData() {
        if (!this.levelData.level) {
            this.levelData = {
                level: 1,
                currentXP: 0,
                xpToNextLevel: 50,
                totalTasksCompleted: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastCompletionDate: null,
                levelUpAt: null
            };
            this.saveLevelData();
        }
    }

    calculateXPForTask(difficulty = 'simple') {
        const multiplier = this.difficultyMultipliers[difficulty] || 1;
        const streakBonus = this.levelData.currentStreak > 0 ? this.streakBonusXP : 0;
        return Math.floor(this.baseXP * multiplier) + streakBonus;
    }

    calculateXPRequiredForLevel(level) {
        if (level <= 1) return 0;
        if (level === 2) return 50;
        
        let totalXP = 50;
        for (let i = 3; i <= level; i++) {
            const previousRequirement = this.calculateXPRequiredForLevel(i - 1);
            const currentRequirement = Math.floor(previousRequirement * 1.5);
            totalXP = currentRequirement;
        }
        return totalXP;
    }

    addXP(difficulty = 'simple') {
        const xpGained = this.calculateXPForTask(difficulty);
        const oldLevel = this.levelData.level;
        
        this.levelData.currentXP += xpGained;
        this.levelData.totalTasksCompleted++;
        this.updateStreak();
        
        let leveledUp = false;
        while (this.levelData.currentXP >= this.levelData.xpToNextLevel) {
            this.levelData.level++;
            this.levelData.levelUpAt = new Date().toISOString();
            this.levelData.xpToNextLevel = this.calculateXPRequiredForLevel(this.levelData.level + 1);
            leveledUp = true;
        }
        
        this.saveLevelData();
        
        return {
            xpGained,
            leveledUp,
            oldLevel,
            newLevel: this.levelData.level,
            currentXP: this.levelData.currentXP,
            xpToNextLevel: this.levelData.xpToNextLevel
        };
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastCompletion = this.levelData.lastCompletionDate 
            ? new Date(this.levelData.lastCompletionDate).toDateString() 
            : null;
        
        if (lastCompletion === today) {
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (lastCompletion === yesterdayString) {
            this.levelData.currentStreak++;
        } else if (lastCompletion === null) {
            this.levelData.currentStreak = 1;
        } else {
            this.levelData.currentStreak = 1;
        }
        
        if (this.levelData.currentStreak > this.levelData.longestStreak) {
            this.levelData.longestStreak = this.levelData.currentStreak;
        }
        
        this.levelData.lastCompletionDate = new Date().toISOString();
    }

    getLevelData() {
        return { ...this.levelData };
    }

    getCurrentLevel() {
        return this.levelData.level;
    }

    getCurrentXP() {
        return this.levelData.currentXP;
    }

    getXPToNextLevel() {
        return this.levelData.xpToNextLevel;
    }

    getXPProgress() {
        const currentLevelXP = this.calculateXPRequiredForLevel(this.levelData.level);
        const nextLevelXP = this.levelData.xpToNextLevel;
        const progressXP = this.levelData.currentXP - currentLevelXP;
        const totalXPForNextLevel = nextLevelXP - currentLevelXP;
        
        return {
            current: Math.max(0, progressXP),
            total: totalXPForNextLevel,
            percentage: Math.min(100, Math.max(0, (progressXP / totalXPForNextLevel) * 100))
        };
    }

    getCurrentStreak() {
        return this.levelData.currentStreak;
    }

    getLongestStreak() {
        return this.levelData.longestStreak;
    }

    getTotalTasksCompleted() {
        return this.levelData.totalTasksCompleted;
    }

    getStats() {
        const progress = this.getXPProgress();
        return {
            level: this.levelData.level,
            currentXP: this.levelData.currentXP,
            xpToNextLevel: this.levelData.xpToNextLevel,
            progress,
            currentStreak: this.levelData.currentStreak,
            longestStreak: this.levelData.longestStreak,
            totalTasksCompleted: this.levelData.totalTasksCompleted
        };
    }

    resetProgress() {
        this.levelData = {
            level: 1,
            currentXP: 0,
            xpToNextLevel: 50,
            totalTasksCompleted: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastCompletionDate: null,
            levelUpAt: null
        };
        this.saveLevelData();
    }

    saveLevelData() {
        Storage.saveLevelData(this.levelData);
    }
}

export default LevelManager;