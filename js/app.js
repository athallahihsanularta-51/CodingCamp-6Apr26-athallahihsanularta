// Personal Dashboard app logic

const GreetingWidget = {
  formatTime(date) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  },

  formatDate(date) {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month   = date.toLocaleDateString('en-US', { month: 'long' });
    const day     = date.getDate();
    return `${weekday}, ${month} ${day}`;
  },

  getGreeting(hour) {
    if (hour >= 5  && hour <= 11) return 'Good morning';
    if (hour >= 12 && hour <= 17) return 'Good afternoon';
    if (hour >= 18 && hour <= 21) return 'Good evening';
    return 'Good night'; // 22-23 and 0-4
  },

  render() {
    const now = new Date();
    document.querySelector('#greeting .greeting-time').textContent    = this.formatTime(now);
    document.querySelector('#greeting .greeting-date').textContent    = this.formatDate(now);
    document.querySelector('#greeting .greeting-message').textContent = this.getGreeting(now.getHours());
  },

  init() {
    this.render();
    setInterval(() => this.render(), 60000);
  },
};

const TimerWidget = {
  state: { remaining: 1500, status: 'idle' },
  _interval: null,

  formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  },

  render() {
    document.querySelector('#timer .timer-display').textContent = this.formatTime(this.state.remaining);
    document.querySelector('#timer .timer-start').disabled = this.state.status === 'running';
    document.querySelector('#timer .timer-stop').disabled  = this.state.status !== 'running';
  },

  start() {
    if (this.state.status === 'running') return;
    this.state.status = 'running';
    this._interval = setInterval(() => this.tick(), 1000);
    this.render();
  },

  stop() {
    if (this.state.status !== 'running') return;
    clearInterval(this._interval);
    this._interval = null;
    this.state.status = 'paused';
    this.render();
  },

  reset() {
    clearInterval(this._interval);
    this._interval = null;
    this.state.remaining = 1500;
    this.state.status = 'idle';
    this.render();
  },

  tick() {
    this.state.remaining -= 1;
    this.render();
    if (this.state.remaining <= 0) {
      clearInterval(this._interval);
      this._interval = null;
      this.state.status = 'idle';
      this.render();
    }
  },

  init() {
    document.querySelector('#timer .timer-start').addEventListener('click', () => this.start());
    document.querySelector('#timer .timer-stop').addEventListener('click',  () => this.stop());
    document.querySelector('#timer .timer-reset').addEventListener('click', () => this.reset());
    this.render();
  },
};

const TodoWidget = {
  tasks: [],

  load() {
    try {
      const raw = localStorage.getItem('dashboard_tasks');
      if (raw === null) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  save() {
    try {
      localStorage.setItem('dashboard_tasks', JSON.stringify(this.tasks));
    } catch (e) {
      // silently degrade if localStorage is unavailable or quota exceeded
    }
  },

  addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.tasks.push({ id: crypto.randomUUID(), text: trimmed, completed: false });
    this.save();
    this.render();
  },

  editTask(id, text) {
    const trimmed = text.trim();
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    if (!trimmed) {
      // discard edit — render restores original text
      this.render();
      return;
    }
    task.text = trimmed;
    this.save();
    this.render();
  },

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    this.save();
    this.render();
  },

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
    this.render();
  },

  render() {
    const list = document.querySelector('#todo .todo-list');
    list.innerHTML = '';
    this.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id;

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = task.text;

      const editBtn = document.createElement('button');
      editBtn.className = 'todo-edit';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'todo-inline-edit';
        input.value = task.text;

        const confirm = () => {
          this.editTask(task.id, input.value);
        };

        input.addEventListener('blur', confirm);
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
          if (e.key === 'Escape') { input.removeEventListener('blur', confirm); this.render(); }
        });

        span.replaceWith(input);
        input.focus();
        input.select();
      });

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'todo-toggle';
      toggleBtn.textContent = task.completed ? 'Undo' : 'Done';
      toggleBtn.addEventListener('click', () => this.toggleTask(task.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'todo-delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

      li.append(span, editBtn, toggleBtn, deleteBtn);
      list.appendChild(li);
    });
  },

  init() {
    this.tasks = this.load();
    const form = document.querySelector('#todo .todo-form');
    const input = document.querySelector('#todo .todo-input');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!input.value.trim()) {
        input.focus();
        return;
      }
      this.addTask(input.value);
      input.value = '';
      input.focus();
    });
    this.render();
  },
};

const LinksWidget = {
  links: [],

  load() {
    try {
      const raw = localStorage.getItem('dashboard_links');
      if (raw === null) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },

  save() {
    try {
      localStorage.setItem('dashboard_links', JSON.stringify(this.links));
    } catch (e) {
      // silently degrade if localStorage is unavailable or quota exceeded
    }
  },

  addLink(label, url) {
    if (!label.trim() || !url.trim()) return;
    this.links.push({ id: crypto.randomUUID(), label: label.trim(), url: url.trim() });
    this.save();
    this.render();
  },

  deleteLink(id) {
    this.links = this.links.filter(l => l.id !== id);
    this.save();
    this.render();
  },

  render() {
    const container = document.querySelector('#links .links-list');
    container.innerHTML = '';
    this.links.forEach(link => {
      const item = document.createElement('div');
      item.className = 'link-item';

      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'link-btn';
      a.textContent = link.label;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'link-delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => this.deleteLink(link.id));

      item.append(a, deleteBtn);
      container.appendChild(item);
    });
  },

  init() {
    this.links = this.load();
    const form = document.querySelector('#links .links-form');
    const labelInput = document.querySelector('#links .links-label');
    const urlInput = document.querySelector('#links .links-url');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!labelInput.value.trim() || !urlInput.value.trim()) return;
      this.addLink(labelInput.value, urlInput.value);
      labelInput.value = '';
      urlInput.value = '';
      labelInput.focus();
    });
    this.render();
  },
};

document.addEventListener('DOMContentLoaded', () => {
  GreetingWidget.init();
  TimerWidget.init();
  TodoWidget.init();
  LinksWidget.init();
});
