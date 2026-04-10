# Requirements Document

## Introduction

A personal dashboard web app built with HTML, CSS, and Vanilla JavaScript. The app runs entirely in the browser with no backend, using Local Storage for persistence. It provides four core widgets: a time/date greeting, a focus timer, a to-do list, and a quick links panel. The app can be used as a standalone web page or browser extension.

## Glossary

- **Dashboard**: The main single-page web application containing all widgets.
- **Widget**: A self-contained UI component on the Dashboard (Greeting, Focus_Timer, Todo_List, Quick_Links).
- **Greeting**: The widget that displays the current time, date, and a time-based greeting message.
- **Focus_Timer**: The widget that implements a 25-minute countdown timer with start, stop, and reset controls.
- **Todo_List**: The widget that manages a list of user tasks with add, edit, complete, and delete operations.
- **Quick_Links**: The widget that displays user-defined shortcut buttons that open URLs in the browser.
- **Local_Storage**: The browser's Local Storage API used to persist all user data client-side.
- **Task**: A single to-do item stored in the Todo_List, with a text label and a completion state.
- **Link**: A single entry in Quick_Links, consisting of a display label and a URL.

---

## Requirements

### Requirement 1: Time and Date Greeting

**User Story:** As a user, I want to see the current time, date, and a contextual greeting when I open the dashboard, so that I am immediately oriented to the current moment.

#### Acceptance Criteria

1. THE Greeting SHALL display the current time in hours and minutes format.
2. THE Greeting SHALL display the current date including the day of the week, month, and day number.
3. WHILE the Dashboard is open, THE Greeting SHALL update the displayed time every 60 seconds.
4. WHEN the current hour is between 5 and 11 inclusive, THE Greeting SHALL display the message "Good morning".
5. WHEN the current hour is between 12 and 17 inclusive, THE Greeting SHALL display the message "Good afternoon".
6. WHEN the current hour is between 18 and 21 inclusive, THE Greeting SHALL display the message "Good evening".
7. WHEN the current hour is between 22 and 23 or between 0 and 4 inclusive, THE Greeting SHALL display the message "Good night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can time focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown duration of 25 minutes and 0 seconds.
2. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down in one-second intervals.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format.
4. WHEN the user activates the stop control, THE Focus_Timer SHALL pause the countdown and retain the remaining time.
5. WHEN the user activates the reset control, THE Focus_Timer SHALL stop the countdown and restore the duration to 25 minutes and 0 seconds.
6. WHEN the countdown reaches 0 minutes and 0 seconds, THE Focus_Timer SHALL stop automatically.
7. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the start control.
8. WHILE the Focus_Timer is not counting down, THE Focus_Timer SHALL disable the stop control.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to manage a list of tasks with add, edit, complete, and delete operations, so that I can track what I need to do.

#### Acceptance Criteria

1. WHEN the user submits a non-empty text input, THE Todo_List SHALL add a new Task with the provided text and an incomplete state.
2. IF the user submits an empty or whitespace-only text input, THEN THE Todo_List SHALL not add a Task and SHALL retain focus on the input field.
3. WHEN the user activates the edit control for a Task, THE Todo_List SHALL allow the user to modify the Task's text.
4. WHEN the user confirms an edit with non-empty text, THE Todo_List SHALL update the Task's text to the new value.
5. IF the user confirms an edit with empty or whitespace-only text, THEN THE Todo_List SHALL discard the edit and restore the original Task text.
6. WHEN the user activates the complete control for a Task, THE Todo_List SHALL toggle the Task's completion state.
7. WHEN the user activates the delete control for a Task, THE Todo_List SHALL remove the Task from the list.
8. WHEN any Task is added, edited, completed, or deleted, THE Todo_List SHALL save the updated task list to Local_Storage.
9. WHEN the Dashboard loads, THE Todo_List SHALL read the task list from Local_Storage and render all previously saved Tasks.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and access shortcut buttons for my favorite websites, so that I can open them quickly from the dashboard.

#### Acceptance Criteria

1. WHEN the user submits a label and a valid URL, THE Quick_Links SHALL add a new Link and display it as a clickable button.
2. IF the user submits a missing label or a missing URL, THEN THE Quick_Links SHALL not add the Link.
3. WHEN the user activates a Link button, THE Quick_Links SHALL open the associated URL in a new browser tab.
4. WHEN the user activates the delete control for a Link, THE Quick_Links SHALL remove the Link from the panel.
5. WHEN any Link is added or deleted, THE Quick_Links SHALL save the updated link list to Local_Storage.
6. WHEN the Dashboard loads, THE Quick_Links SHALL read the link list from Local_Storage and render all previously saved Links.

---

### Requirement 5: Data Persistence

**User Story:** As a user, I want my tasks and links to survive page reloads, so that I do not lose my data between sessions.

#### Acceptance Criteria

1. THE Todo_List SHALL serialize the task list as JSON before writing to Local_Storage.
2. THE Quick_Links SHALL serialize the link list as JSON before writing to Local_Storage.
3. WHEN the Dashboard loads and Local_Storage contains no task data, THE Todo_List SHALL initialize with an empty task list.
4. WHEN the Dashboard loads and Local_Storage contains no link data, THE Quick_Links SHALL initialize with an empty link list.
5. IF Local_Storage data for tasks cannot be parsed as valid JSON, THEN THE Todo_List SHALL initialize with an empty task list.
6. IF Local_Storage data for links cannot be parsed as valid JSON, THEN THE Quick_Links SHALL initialize with an empty link list.

---

### Requirement 6: Layout and Visual Design

**User Story:** As a user, I want a clean, readable, and responsive layout, so that the dashboard is easy to use across different screen sizes.

#### Acceptance Criteria

1. THE Dashboard SHALL arrange all widgets in a grid layout that adapts to the available viewport width.
2. THE Dashboard SHALL apply a single CSS file located at `css/style.css` for all visual styling.
3. THE Dashboard SHALL use a single JavaScript file located at `js/app.js` for all application logic.
4. THE Dashboard SHALL use typography with a minimum font size of 14px for all body text.
5. WHILE a Task has a completion state of complete, THE Todo_List SHALL apply a visual distinction to that Task (such as strikethrough text).
