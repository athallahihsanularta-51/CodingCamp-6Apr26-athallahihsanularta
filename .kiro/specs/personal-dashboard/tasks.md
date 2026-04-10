# Implementation Plan: Personal Dashboard

## Overview

Implement a single-page personal dashboard using HTML, CSS, and Vanilla JavaScript. The app has no build tools or backend — all logic lives in `js/app.js`, all styles in `css/style.css`, and the entry point is `index.html`. Four widgets are implemented as self-contained JS modules: Greeting, Focus Timer, To-Do List, and Quick Links.

## Tasks

- [x] 1. Scaffold project structure and HTML skeleton
  - Create `index.html` with semantic sections for each widget: `#greeting`, `#timer`, `#todo`, `#links`
  - Add `<link>` to `css/style.css` and `<script defer>` to `js/app.js`
  - Create empty `css/style.css` and `js/app.js` files
  - _Requirements: 6.2, 6.3_

- [x] 2. Implement base layout and visual styles
  - In `css/style.css`, define a CSS Grid layout that arranges the four widget sections and adapts to viewport width
  - Set minimum body font size to 14px and apply base typography
  - Add widget card styles (background, padding, border-radius)
  - _Requirements: 6.1, 6.4_

- [ ] 3. Implement GreetingWidget
  - [x] 3.1 Implement `GreetingWidget` in `js/app.js`
    - Implement `formatTime(date)` returning `"HH:MM"` string
    - Implement `formatDate(date)` returning `"Weekday, Month Day"` string
    - Implement `getGreeting(hour)` mapping hour ranges to greeting strings (morning 5–11, afternoon 12–17, evening 18–21, night 22–23 and 0–4)
    - Implement `render()` to update the `#greeting` DOM elements
    - Implement `init()` to call `render()` immediately and start a `setInterval` every 60 seconds
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 3.2 Write property test for `getGreeting` (Property 1)
    - **Property 1: Greeting message covers all hours**
    - In browser console or a test script, iterate all integers 0–23 and assert `getGreeting(hour)` returns one of the four valid strings with no gaps
    - **Validates: Requirements 1.4, 1.5, 1.6, 1.7**

  - [ ]* 3.3 Write property test for `formatTime` (Property 2)
    - **Property 2: Timer format is always MM:SS**
    - Iterate all integers 0–1500 and assert `TimerWidget.formatTime(s)` matches `/^\d{2}:\d{2}$/`
    - **Validates: Requirements 2.3**

- [ ] 4. Implement TimerWidget
  - [x] 4.1 Implement `TimerWidget` in `js/app.js`
    - Define in-memory state `{ remaining: 1500, status: 'idle' }`
    - Implement `formatTime(seconds)` returning zero-padded `"MM:SS"`
    - Implement `render()` to update the timer display and toggle disabled state on start/stop buttons
    - Implement `start()`, `stop()`, `reset()` transitioning the state machine between `idle`, `running`, `paused`
    - Implement `tick()` to decrement `remaining` by 1, call `render()`, and auto-stop at 0
    - Implement `init()` to wire button click handlers and call `render()`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 4.2 Write property test for timer never going below zero (Property 3)
    - **Property 3: Timer never goes below zero**
    - Set `remaining` to a small value (e.g. 3), call `tick()` repeatedly, and assert `remaining` never becomes negative
    - **Validates: Requirements 2.6**

- [ ] 5. Checkpoint — verify Greeting and Timer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement TodoWidget
  - [x] 6.1 Implement `TodoWidget.load()` and `TodoWidget.save()` in `js/app.js`
    - `load()`: read `"dashboard_tasks"` from `localStorage`, `JSON.parse` with try/catch fallback to `[]`
    - `save()`: `JSON.stringify` the tasks array and write to `localStorage` with try/catch for quota/unavailable errors
    - _Requirements: 3.8, 3.9, 5.1, 5.3, 5.5_

  - [ ]* 6.2 Write property test for task persistence round-trip (Property 6)
    - **Property 6: Task persistence round-trip**
    - For a sample array of Task objects, call `save()` then `load()` and assert deep equality
    - **Validates: Requirements 3.8, 3.9, 5.1**

  - [ ]* 6.3 Write property test for corrupt storage fallback (Property 8)
    - **Property 8: Corrupt storage falls back to empty list**
    - Write a non-JSON string to `"dashboard_tasks"` in localStorage, call `load()`, and assert it returns `[]` without throwing
    - **Validates: Requirements 5.5, 5.6**

  - [x] 6.4 Implement `TodoWidget.addTask`, `editTask`, `toggleTask`, `deleteTask`
    - `addTask(text)`: trim input, reject empty/whitespace, generate id via `crypto.randomUUID()`, push `{ id, text, completed: false }`, call `save()` and `render()`
    - `editTask(id, text)`: trim input, if empty discard and restore original text, else update and call `save()` and `render()`
    - `toggleTask(id)`: flip `completed` boolean, call `save()` and `render()`
    - `deleteTask(id)`: filter task out of array, call `save()` and `render()`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 6.5 Write property test for addTask with valid input (Property 4)
    - **Property 4: Adding a valid task grows the list by one**
    - For a non-empty string, assert list length increases by 1 and new task contains trimmed text
    - **Validates: Requirements 3.1**

  - [ ]* 6.6 Write property test for addTask with whitespace input (Property 5)
    - **Property 5: Whitespace-only input is rejected**
    - For strings of only whitespace, assert list length is unchanged after `addTask`
    - **Validates: Requirements 3.2**

  - [ ]* 6.7 Write property test for editTask with empty text (Property 9)
    - **Property 9: Edit with empty text discards change**
    - For a task with text T, call `editTask` with whitespace-only string, assert task text is still T
    - **Validates: Requirements 3.5**

  - [ ]* 6.8 Write property test for toggleTask involution (Property 10)
    - **Property 10: Toggle is an involution**
    - For any task, call `toggleTask` twice and assert `completed` equals original value
    - **Validates: Requirements 3.6**

  - [x] 6.9 Implement `TodoWidget.render()` and `TodoWidget.init()`
    - `render()`: rebuild the `#todo` task list DOM; completed tasks get a visual distinction (e.g. `text-decoration: line-through` via a CSS class)
    - Each task item renders edit, complete-toggle, and delete controls
    - Edit control activates inline editing; confirm on blur or Enter key
    - `init()`: call `load()`, wire the add-task form submit handler (retain focus on empty submit), call `render()`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.9, 6.5_

- [ ] 7. Implement LinksWidget
  - [x] 7.1 Implement `LinksWidget.load()` and `LinksWidget.save()` in `js/app.js`
    - `load()`: read `"dashboard_links"` from `localStorage`, `JSON.parse` with try/catch fallback to `[]`
    - `save()`: `JSON.stringify` the links array and write to `localStorage` with try/catch
    - _Requirements: 4.5, 4.6, 5.2, 5.4, 5.6_

  - [ ]* 7.2 Write property test for link persistence round-trip (Property 7)
    - **Property 7: Link persistence round-trip**
    - For a sample array of Link objects, call `save()` then `load()` and assert deep equality
    - **Validates: Requirements 4.5, 4.6, 5.2**

  - [x] 7.3 Implement `LinksWidget.addLink`, `deleteLink`, `render()`, and `init()`
    - `addLink(label, url)`: reject if label or url is empty; generate id, push `{ id, label, url }`, call `save()` and `render()`
    - `deleteLink(id)`: filter link out, call `save()` and `render()`
    - `render()`: rebuild the `#links` panel; each link renders as a `<a target="_blank">` button and a delete control
    - `init()`: call `load()`, wire the add-link form submit handler, call `render()`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 8. Checkpoint — verify Todo and Links widgets
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Wire all widgets and finalize styles
  - [x] 9.1 Wire all widget `init()` calls inside a `DOMContentLoaded` listener in `js/app.js`
    - Call `GreetingWidget.init()`, `TimerWidget.init()`, `TodoWidget.init()`, `LinksWidget.init()`
    - _Requirements: 6.3_

  - [x] 9.2 Complete responsive and visual polish in `css/style.css`
    - Ensure grid layout collapses gracefully on narrow viewports (e.g. single-column below 600px)
    - Apply completed-task strikethrough style via a `.completed` CSS class
    - Ensure all interactive controls are visually distinguishable and meet 14px minimum font size
    - _Requirements: 6.1, 6.4, 6.5_

- [x] 10. Final checkpoint — full integration review
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster build
- Property tests can be run directly in the browser console since there is no test framework
- Each task references specific requirements for traceability
- All four widgets are self-contained modules within `js/app.js` — no module bundler needed
