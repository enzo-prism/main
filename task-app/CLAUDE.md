# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## How to Run the Application

Open `index.html` in a web browser - no build process or dependencies required. The app uses vanilla JavaScript with ES6 modules.

## Architecture Overview

This is a **modular, object-oriented task management app** built with vanilla JavaScript. The architecture follows a clear separation of concerns:

### Core Components

- **TaskApp** (`js/app.js`): Main controller that orchestrates UI events, DOM manipulation, and coordination between managers
- **TaskManager** (`js/modules/taskManager.js`): Handles all task CRUD operations and business logic
- **EmojiManager** (`js/modules/emojiManager.js`): Manages the gamification system with random emoji rewards
- **Storage** (`js/utils/storage.js`): Abstracts localStorage operations with error handling

### Data Flow Pattern

```
User Action → TaskApp (UI Controller) → TaskManager/EmojiManager → Storage → localStorage
                                    ↓
                              UI Re-render ← State Update
```

### Key Design Patterns

- **ES6 Modules**: Each component is a separate module with clear imports/exports
- **Facade Pattern**: TaskApp provides simplified interface to complex subsystems
- **Event-Driven UI**: All user interactions trigger state changes followed by UI re-renders
- **Automatic Persistence**: Every state change immediately syncs to localStorage

## Data Models

### Task Object
```javascript
{
  id: number,              // Auto-incrementing unique identifier
  title: string,           // Required task description
  description: string,     // Optional details (currently unused in UI)
  completed: boolean,      // Completion status
  createdAt: ISO string,   // Creation timestamp
  completedAt: ISO string | null // Completion timestamp
}
```

### Emoji Collection Object
```javascript
{
  emoji: string,           // Unicode emoji from predefined pool
  unlockedAt: ISO string,  // Unlock timestamp
  id: number              // Unique identifier (timestamp-based)
}
```

## State Management

- Each manager (TaskManager, EmojiManager) maintains its own state array
- State is automatically persisted to localStorage on every modification
- UI re-renders completely on state changes (simple but effective for small app)
- No external state management library - uses class properties and localStorage

## Gamification System

- **Emoji Pool**: 80+ predefined emojis covering various categories
- **Reward Trigger**: Random emoji unlocked when any task is completed
- **Duplicate Handling**: Allows duplicate emojis if all unique ones are collected
- **Celebration UX**: Modal popup with animations for task completion

## Security & Validation

- **XSS Prevention**: All user input is HTML-escaped before rendering
- **Input Validation**: Task titles cannot be empty (validated at both UI and business logic levels)
- **Error Boundaries**: Try-catch blocks with user-friendly error messages
- **Data Integrity**: Auto-incrementing IDs and timestamp management

## Browser Compatibility

Requires modern browser support for:
- ES6 modules (type="module" scripts)
- CSS Grid and Flexbox
- localStorage API
- Arrow functions and modern JavaScript syntax