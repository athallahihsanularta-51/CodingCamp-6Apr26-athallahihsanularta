# Requirements Document

## Introduction

This document specifies three enhancements to the existing Personal Dashboard:

1. **Light / Dark mode** — a toggle that switches the Dashboard between a light and a dark color theme, with the chosen theme persisted across sessions.
2. **Custom name in greeting** — the user can enter their name so the Greeting widget displays a personalised message such as "Good morning, Alex".
3. **Sort tasks** — the user can sort the To-Do list by completion status, alphabetically, or by creation order.

All enhancements follow the existing architecture: no build tools, no frameworks, no backend. Changes are confined to `index.html`, `css/style.css`, and `js/app.js`, with Local_Storage used for persistence.

---

## Glossary

- **Dashboard**: The main single-page web application containing all widgets (unchanged from the base spec).
- **Greeting**: The widget that displays the current time, date, and a time-based greeting message (unchanged from the base spec).
- **Todo_List**: The widget that manages a list of user tasks (unchanged from the base spec).
- **Task**: A single to-do item with a text label, a completion state, and a creation timestamp.
- **Theme**: The active color scheme applied to the Dashboard — either `light` or `dark`.
- **Theme_Toggle**: The UI control that switches the active Theme between `light` and `dark`.
- **User_Name**: The optional display name entered by the user, shown in the Greeting message.
- **Name_Input**: The UI control inside the Greeting widget that accepts the User_Name.
- **Sort_Order**: The active ordering rule applied to the Todo_List — one of `creation`, `alphabetical`, or `status`.
- **Sort_Control**: The UI control inside the Todo_List widget that selects the Sort_Order.
- **Local_Storage**: The browser's Local Storage API used to persist all user data client-side (unchanged from the base spec).

---

## Requirements

### Requirement 1: Light / Dark Mode

**User Story:** As a user, I want to toggle between a light and a dark color theme, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a Theme_Toggle control that is visible at all times.
2. WHEN the user activates the Theme_Toggle, THE Dashboard SHALL switch the active Theme from `light` to `dark`, or from `dark` to `light`.
3. WHILE the active Theme is `dark`, THE Dashboard SHALL apply a dark color scheme to all widgets and the page background.
4. WHILE the active Theme is `light`, THE Dashboard SHALL apply a light color scheme to all widgets and the page background.
5. WHEN the user activates the Theme_Toggle, THE Dashboard SHALL save the selected Theme to Local_Storage.
6. WHEN the Dashboard loads, THE Dashboard SHALL read the Theme from Local_Storage and apply it before rendering any content.
7. WHEN the Dashboard loads and Local_Storage contains no Theme value, THE Dashboard SHALL apply the `light` Theme by default.
8. IF Local_Storage data for the Theme cannot be parsed as a valid Theme value, THEN THE Dashboard SHALL apply the `light` Theme by default.

---

### Requirement 2: Custom Name in Greeting

**User Story:** As a user, I want to enter my name so that the greeting message is personalised, so that the dashboard feels more welcoming.

#### Acceptance Criteria

1. THE Greeting SHALL provide a Name_Input control that allows the user to enter a User_Name.
2. WHEN the user submits a non-empty User_Name via the Name_Input, THE Greeting SHALL append the trimmed User_Name to the greeting message (e.g. "Good morning, Alex").
3. IF the user submits an empty or whitespace-only value via the Name_Input, THEN THE Greeting SHALL display the greeting message without a name (e.g. "Good morning").
4. WHEN the user submits a User_Name, THE Greeting SHALL save the trimmed User_Name to Local_Storage.
5. WHEN the Dashboard loads, THE Greeting SHALL read the User_Name from Local_Storage and display the personalised greeting message immediately.
6. WHEN the Dashboard loads and Local_Storage contains no User_Name value, THE Greeting SHALL display the greeting message without a name.
7. WHILE the Dashboard is open, THE Greeting SHALL include the User_Name in every subsequent time-based greeting update.

---

### Requirement 3: Sort Tasks

**User Story:** As a user, I want to sort my to-do list by different criteria, so that I can find and prioritise tasks more easily.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a Sort_Control that offers the following Sort_Order options: `creation` (default), `alphabetical`, and `status`.
2. WHEN the user selects a Sort_Order via the Sort_Control, THE Todo_List SHALL re-render the task list in the chosen order without modifying the underlying task data.
3. WHILE the Sort_Order is `creation`, THE Todo_List SHALL display tasks in the order they were added, from oldest to newest.
4. WHILE the Sort_Order is `alphabetical`, THE Todo_List SHALL display tasks sorted by their text label in ascending alphabetical order, case-insensitively.
5. WHILE the Sort_Order is `status`, THE Todo_List SHALL display incomplete tasks before completed tasks.
6. WHEN the user selects a Sort_Order, THE Todo_List SHALL save the selected Sort_Order to Local_Storage.
7. WHEN the Dashboard loads, THE Todo_List SHALL read the Sort_Order from Local_Storage and apply it when rendering the initial task list.
8. WHEN the Dashboard loads and Local_Storage contains no Sort_Order value, THE Todo_List SHALL apply the `creation` Sort_Order by default.
9. WHEN a Task is added, edited, completed, or deleted, THE Todo_List SHALL re-render the task list using the currently active Sort_Order.
10. THE Todo_List SHALL assign a creation timestamp to each new Task at the moment it is added, so that `creation` sort order is deterministic.
