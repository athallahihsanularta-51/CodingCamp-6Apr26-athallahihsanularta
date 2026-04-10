# Implementation Plan: Dashboard Enhancements

## Overview

Incrementally extend the existing Personal Dashboard with three features: light/dark theming, a personalised greeting name, and task sort order. All changes are confined to `index.html`, `css/style.css`, and `js/app.js`. Tasks are ordered: HTML structure → CSS theming → JS feature by feature → integration wiring.

## Tasks

- [x] 1. Update HTML structure
  - [x] 1.1 Add `<header>` with theme toggle button above `<main>` in `index.html`
    - Insert `<header class="dashboard-header">` containing `<button class="theme-toggle" aria-label="Toggle light/dark mode">🌙</button>`
    - _Requirements: 1.1_

  - [x] 1.2 Add name input form to the Greeting widget in `index.html`
    - Append `<form class="name-form">` with a text input (`.name-input`) and Save button inside `#greeting`
    - _Requirements: 2.1_

  - [x] 1.3 Add sort control to the Todo widget in `index.html`
    - Insert `<select class="todo-sort">` with options `creation`, `alphabetical`, `status` between the todo form and the task list
    - _Requirements: 3.1_

- [x] 2. Add CSS custom properties and dark theme
  - [x] 2.1 Define CSS custom properties on `:root` and `[data-theme="dark"]` in `style.css`
    - Add `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border`, `--color-accent`, `--color-accent-hover`, `--color-disabled` to `:root` with current light values
    - Add `[data-theme="dark"]` block overriding all variables with dark values
    - _Requirements: 1.3, 1.4_

  - [x] 2.2 Replace hard-coded color values with CSS variable references in `style.css`
    - Update `body`, `.widget`, `button`, `button:hover`, `button:disabled`, `.todo-input`, `.links-label`, `.links-url`, `.link-btn`, `.completed` to use `var(--color-*)` references
    - _Requirements: 1.3, 1.4_

  - [x] 2.3 Add header and theme toggle styles, and sort control styles to `style.css`
    - Add `.dashboard-header` (flex, justify-content: flex-end, border-bottom using variables)
    - Add `.theme-toggle` (transparent background, border, uses `--color-text`)
    - Add `.todo-sort` (full-width select using `--color-surface`, `--color-text`, `--color-border`)
    - _Requirements: 1.1, 3.1_

- [ ] 3. Implement ThemeManager in `js/app.js`
  - [x] 3.1 Implement `ThemeManager` object with `load()`, `save()`, `apply()`, `toggle()`, and `init()`
    - `load()`: read `localStorage['dashboard_theme']`, return value if `'light'` or `'dark'`, else `'light'`
    - `save(theme)`: write to `localStorage['dashboard_theme']` in try/catch
    - `apply(theme)`: set `document.body.dataset.theme = theme`
    - `toggle()`: flip current theme, call `save()` and `apply()`; update button emoji (☀️ / 🌙)
    - `init()`: call `load()`, `apply()`, attach click listener to `.theme-toggle`
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 3.2 Write property test for theme toggle involution (Property 1)
    - **Property 1: Theme toggle is an involution**
    - **Validates: Requirements 1.2**

  - [ ]* 3.3 Write property test for invalid theme fallback (Property 2)
    - **Property 2: Invalid theme falls back to light**
    - **Validates: Requirements 1.8**

  - [ ]* 3.4 Write property test for theme persistence round-trip (Property 3)
    - **Property 3: Theme persistence round-trip**
    - **Validates: Requirements 1.5, 1.6**

- [ ] 4. Checkpoint — verify theme toggle
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Extend GreetingWidget in `js/app.js`
  - [x] 5.1 Add `loadName()`, `saveName()`, and `buildMessage()` to `GreetingWidget`
    - `loadName()`: read `localStorage['dashboard_name']`, return trimmed string or `''`
    - `saveName(name)`: write trimmed name to `localStorage['dashboard_name']` in try/catch
    - `buildMessage(hour, name)`: pure function — return `"Good morning, Alex"` if name non-empty, else `"Good morning"`
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 5.2 Write property test for non-empty name in greeting (Property 4)
    - **Property 4: Non-empty name appears in greeting**
    - **Validates: Requirements 2.2**

  - [ ]* 5.3 Write property test for whitespace-only name produces nameless greeting (Property 5)
    - **Property 5: Whitespace-only name produces nameless greeting**
    - **Validates: Requirements 2.3**

  - [ ]* 5.4 Write property test for name persistence round-trip (Property 6)
    - **Property 6: Name persistence round-trip**
    - **Validates: Requirements 2.4, 2.5**

  - [x] 5.5 Update `GreetingWidget.render()` and `init()` to use name
    - Add `this.name = ''` field; update `render()` to call `buildMessage(hour, this.name)` instead of `getGreeting(hour)`
    - Update `init()` to call `loadName()`, set `this.name`, attach `.name-form` submit handler (trim, save, re-render), then call existing render/interval setup
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.7_

- [ ] 6. Checkpoint — verify greeting name
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Extend TodoWidget in `js/app.js`
  - [x] 7.1 Add `loadSort()`, `saveSort()`, and `sortTasks()` to `TodoWidget`
    - `loadSort()`: read `localStorage['dashboard_sort']`, return value if one of `'creation'`, `'alphabetical'`, `'status'`, else `'creation'`
    - `saveSort(order)`: write to `localStorage['dashboard_sort']` in try/catch
    - `sortTasks(tasks, order)`: pure function returning a new sorted array — creation by `createdAt` asc (missing = 0), alphabetical by `text.toLowerCase()`, status by incomplete-first
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 7.2 Write property test for sort does not mutate tasks array (Property 7)
    - **Property 7: Sort does not mutate the tasks array**
    - **Validates: Requirements 3.2**

  - [ ]* 7.3 Write property test for creation sort preserves insertion order (Property 8)
    - **Property 8: Creation sort preserves insertion order**
    - **Validates: Requirements 3.3, 3.10**

  - [ ]* 7.4 Write property test for alphabetical sort is case-insensitive ascending (Property 9)
    - **Property 9: Alphabetical sort is case-insensitive ascending**
    - **Validates: Requirements 3.4**

  - [ ]* 7.5 Write property test for status sort places incomplete tasks first (Property 10)
    - **Property 10: Status sort places incomplete tasks first**
    - **Validates: Requirements 3.5**

  - [ ]* 7.6 Write property test for sort persistence round-trip (Property 11)
    - **Property 11: Sort persistence round-trip**
    - **Validates: Requirements 3.6, 3.7**

  - [x] 7.7 Update `TodoWidget.addTask()` to stamp `createdAt` on new tasks
    - Add `createdAt: Date.now()` to the task object pushed in `addTask()`
    - _Requirements: 3.10_

  - [ ]* 7.8 Write property test for new tasks have a numeric createdAt timestamp (Property 12)
    - **Property 12: New tasks have a numeric createdAt timestamp**
    - **Validates: Requirements 3.10**

  - [x] 7.9 Update `TodoWidget.render()` and `init()` to apply sort
    - Add `this.sortOrder = 'creation'` field; update `render()` to call `sortTasks(this.tasks, this.sortOrder)` and iterate the sorted copy
    - Update `init()` to call `loadSort()`, set `this.sortOrder`, attach `.todo-sort` change handler (save, re-render), then call existing init logic
    - _Requirements: 3.1, 3.2, 3.7, 3.8, 3.9_

- [ ] 8. Checkpoint — verify sort tasks
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Wire ThemeManager into DOMContentLoaded
  - Add `ThemeManager.init()` as the first call inside the existing `DOMContentLoaded` listener in `js/app.js`
  - _Requirements: 1.1, 1.6_

- [x] 10. Final checkpoint — full integration review
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster build
- Property tests can be run directly in the browser console — no test framework needed
- `sortTasks` must never mutate `this.tasks`; always sort a shallow copy (`[...tasks]`)
- Existing tasks in localStorage without `createdAt` fall back to `0` in creation sort
