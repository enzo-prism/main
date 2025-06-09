import Storage from '../utils/storage.js';

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

export default EmojiManager;