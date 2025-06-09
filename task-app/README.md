# Task Emoji Rewards App 🎯

A simple, gamified task management application that rewards users with emojis for completing tasks.

## Features

- ✅ Create, edit, and delete tasks
- 🎉 Unlock random emojis when completing tasks
- 💾 Persistent storage using localStorage
- 📱 Responsive design for mobile and desktop
- ✨ Beautiful animations and celebrations

## Architecture

```
task-app/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styling and animations
├── js/
│   ├── app.js              # Main application logic
│   ├── modules/
│   │   ├── taskManager.js  # Task CRUD operations
│   │   └── emojiManager.js # Emoji collection system
│   └── utils/
│       └── storage.js      # localStorage utilities
└── README.md               # This file
```

## How It Works

1. **Task Management**: Users can create tasks with titles, edit existing tasks, and delete unwanted tasks
2. **Completion Rewards**: When a task is marked complete, a random emoji is unlocked from a pool of 80+ emojis
3. **Persistent Data**: All tasks and collected emojis are saved to localStorage
4. **Visual Feedback**: Celebrations and animations provide satisfying user feedback

## Getting Started

1. Open `index.html` in a web browser
2. Start adding tasks
3. Complete tasks to unlock emojis!

## Technical Details

- **Vanilla JavaScript**: No external dependencies
- **ES6 Modules**: Clean, modular code structure
- **CSS Grid/Flexbox**: Modern layout techniques
- **localStorage**: Client-side data persistence
- **Responsive Design**: Works on all screen sizes

## Browser Support

Modern browsers that support:
- ES6 modules
- CSS Grid
- Flexbox
- localStorage

## License

MIT License - feel free to use and modify!