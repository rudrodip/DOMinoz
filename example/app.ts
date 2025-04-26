import { createElement, render, useSignal, useAfter, useAnchor } from '../src/index';

function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      
      /* Base */
      --background: #ffffff;
      --foreground: #09090b;
      
      /* Card */
      --card: #ffffff;
      --card-foreground: #09090b;
      
      /* Primary */
      --primary: #000000;
      --primary-foreground: #ffffff;
      
      /* Secondary */
      --secondary: #f4f4f5;
      --secondary-foreground: #09090b;
      
      /* Accent */
      --accent: #f4f4f5;
      --accent-foreground: #09090b;
      
      /* Destructive */
      --destructive: #ef4444;
      --destructive-foreground: #ffffff;
      
      /* Success */
      --success: #10b981;
      --success-foreground: #ffffff;
      
      /* Warning */
      --warning: #f59e0b;
      --warning-foreground: #ffffff;

      /* Muted */
      --muted: #f4f4f5;
      --muted-foreground: #71717a;
      
      /* Border */
      --border: #e4e4e7;
      
      /* Input */
      --input: #e4e4e7;
      
      /* Ring */
      --ring: #18181b;
      
      /* Radius */
      --radius: 0.5rem;
      
      /* Shadow */
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    [data-theme="dark"] {
      --background: #09090b;
      --foreground: #ffffff;
      
      --card: #1c1c1f;
      --card-foreground: #ffffff;
      
      --primary: #ffffff;
      --primary-foreground: #09090b;
      
      --secondary: #18181b;
      --secondary-foreground: #ffffff;
      
      --accent: #18181b;
      --accent-foreground: #ffffff;
      
      --destructive: #ef4444;
      --destructive-foreground: #ffffff;
      
      --success: #10b981;
      --success-foreground: #ffffff;
      
      --warning: #f59e0b;
      --warning-foreground: #ffffff;
      
      --muted: #18181b;
      --muted-foreground: #a1a1aa;
      
      --border: #27272a;
      
      --input: #27272a;
      
      --ring: #d4d4d8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      background: var(--background);
      color: var(--foreground);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      transition: background-color 200ms ease, color 200ms ease;
    }

    .app {
      max-width: 1600px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1, h2, h3, h4 {
      color: var(--foreground);
      font-weight: 600;
      line-height: 1.25;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }

    .board {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 1rem;
      min-height: 70vh;
    }

    .column {
      display: flex;
      flex-direction: column;
      min-width: 320px;
      max-width: 320px;
      background: var(--card);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      transition: box-shadow 200ms ease, background 200ms ease;
    }

    .column-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .column-title {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .column-count {
      background: var(--secondary);
      color: var(--secondary-foreground);
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
    }

    .column-content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      min-height: 200px;
    }

    .column-drop-area {
      height: 100%;
      min-height: 100px;
      width: 100%;
      transition: background-color 150ms ease, border-color 150ms ease;
      border: 2px solid transparent;
      border-radius: var(--radius);
    }

    .column-drop-area.drop-active {
      background-color: var(--muted);
      border-color: var(--primary);
      transition: background-color 150ms ease, border-color 150ms ease;
    }
    
    /* Drag & Drop visual helpers */
    .draggable-ghost {
      opacity: 0.4;
      background: var(--muted);
      border: 1px dashed var(--muted-foreground);
    }
    
    /* Visual indicator for where the card will be dropped */
    .drop-indicator {
      height: 2px;
      margin: 8px 0;
      background-color: var(--primary);
      border-radius: 1px;
      display: none;
    }
    
    .drop-indicator.active {
      display: block;
    }

    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem;
      margin-bottom: 0.75rem;
      box-shadow: var(--shadow-sm);
      cursor: grab;
      transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      border-color: var(--muted-foreground);
    }

    .card.dragging {
      opacity: 0.5;
      cursor: grabbing;
      box-shadow: var(--shadow-lg);
      border: 1px dashed var(--muted-foreground);
      background-color: var(--muted);
    }

    .card-title {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .card-description {
      font-size: 0.875rem;
      color: var(--muted-foreground);
      margin-bottom: 1rem;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: var(--muted-foreground);
    }

    .card-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.75rem;
    }

    .tag {
      background: var(--secondary);
      color: var(--secondary-foreground);
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
    }

    .priority {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      display: inline-block;
      margin-right: 0.5rem;
    }

    .priority-high { background: var(--destructive); }
    .priority-medium { background: var(--warning); }
    .priority-low { background: var(--success); }

    button, .button {
      background: var(--primary);
      color: var(--primary-foreground);
      padding: 0.5rem 1rem;
      border-radius: var(--radius);
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 200ms ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      height: 40px;
    }

    button:hover, .button:hover {
      opacity: 0.9;
    }

    button.secondary, .button.secondary {
      background: var(--secondary);
      color: var(--secondary-foreground);
    }

    button.secondary:hover, .button.secondary:hover {
      opacity: 0.9;
    }

    button.ghost, .button.ghost {
      background: transparent;
      color: var(--foreground);
    }

    button.ghost:hover, .button.ghost:hover {
      background: var(--muted);
    }

    button.danger, .button.danger {
      background: var(--destructive);
      color: var(--destructive-foreground);
    }

    .icon-button {
      background: transparent;
      color: var(--muted-foreground);
      width: 2rem;
      height: 2rem;
      padding: 0;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 200ms ease, color 200ms ease;
    }

    .icon-button:hover {
      background: var(--muted);
      color: var(--foreground);
    }

    input, textarea, select {
      background: var(--background);
      color: var(--foreground);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 0.5rem;
      font-family: inherit;
      font-size: 0.875rem;
      width: 100%;
      transition: border-color 200ms ease, box-shadow 200ms ease;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--ring);
      box-shadow: 0 0 0 2px rgba(24, 24, 27, 0.1);
    }

    [data-theme="dark"] input:focus,
    [data-theme="dark"] textarea:focus,
    [data-theme="dark"] select:focus {
      box-shadow: 0 0 0 2px rgba(244, 244, 245, 0.1);
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .modal {
      background: var(--card);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      padding: 1.5rem;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid var(--border);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--foreground);
    }

    .flex {
      display: flex;
    }

    .flex-col {
      flex-direction: column;
    }

    .gap-2 {
      gap: 0.5rem;
    }

    .gap-4 {
      gap: 1rem;
    }

    .justify-between {
      justify-content: space-between;
    }

    .items-center {
      align-items: center;
    }

    .mb-4 {
      margin-bottom: 1rem;
    }

    .spacer {
      height: 1rem;
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .chart-container {
      height: 300px;
      margin-bottom: 2rem;
      position: relative;
    }

    .theme-switch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dropdown {
      position: relative;
    }

    .dropdown-content {
      position: absolute;
      right: 0;
      top: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      min-width: 200px;
      box-shadow: var(--shadow-md);
      z-index: 10;
      margin-top: 0.25rem;
    }

    .dropdown-item {
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background-color 200ms ease;
    }

    .dropdown-item:hover {
      background: var(--muted);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      background: var(--secondary);
      color: var(--secondary-foreground);
    }

    @media (max-width: 768px) {
      .board {
        flex-direction: column;
      }
      
      .column {
        min-width: 100%;
        max-width: 100%;
      }
    }
    
    /* Make sure elements can be dragged */
    [draggable=true] {
      cursor: grab;
    }
    
    [draggable=true]:active {
      cursor: grabbing;
    }
    
    .drag-active {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    [data-theme="dark"] .drag-active {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    /* Fixed position feedback during drag operations */
    .drag-feedback {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 8px 16px;
      background-color: var(--primary);
      color: var(--primary-foreground);
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      z-index: 9999;
      transform: translateY(-100%);
      transition: transform 150ms ease-out;
    }
    
    .drag-feedback.active {
      transform: translateY(0);
    }

    .search-bar {
      display: flex;
      align-items: center;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 0 0.75rem;
      background: var(--background);
      width: 250px;
    }

    .search-bar input {
      border: none;
      padding: 0.5rem 0.25rem;
      width: 100%;
      background: transparent;
    }

    .search-bar input:focus {
      outline: none;
      box-shadow: none;
      border-color: transparent;
    }

    .search-icon {
      color: var(--muted-foreground);
      display: flex;
      align-items: center;
    }
  `;
  document.head.appendChild(style);
}

// Data models
interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  assignedTo: string | null;
  dueDate: number | null;
  tags: string[];
  subtasks: Subtask[];
  comments: Comment[];
  attachments: string[];
  createdAt: number;
  updatedAt: number;
  isArchived: boolean;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Column {
  id: string;
  title: string;
  tasks: string[];
  wip: number;
}

interface AppState {
  columns: Column[];
  tasks: Record<string, Task>;
  users: Record<string, User>;
  tags: Record<string, Tag>;
  filters: {
    search: string;
    assignee: string | null;
    tags: string[];
    priority: ('low' | 'medium' | 'high')[];
  };
  theme: 'light' | 'dark';
}

// Stats Component with Animated Counter
function AnimatedCounter({ value, label }: { value: number; label: string }) {
  const [displayValue, setDisplayValue] = useSignal(0);
  const prevValue = useAnchor(0);
  
  useAfter(() => {
    if (prevValue.current !== value) {
      const start = prevValue.current;
      const end = value;
      const duration = 500;
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setDisplayValue(Math.round(start + (end - start) * progress));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
      prevValue.current = value;
    }
  }, [value]);

  return createElement(
    'div',
    { class: 'card' },
    createElement('div', { class: 'counter' }, displayValue.toString()),
    createElement('div', { class: 'label' }, label)
  );
}

// Search Component
function SearchBox({ onSearch }: { onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useSignal('');
  const searchTimeout = useAnchor<number | null>(null);
  
  useAfter(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      onSearch(searchTerm);
    }, 300) as unknown as number;
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  return createElement(
    'div',
    { class: 'search-box' },
    createElement('span', { class: 'search-icon' }, '🔍'),
    createElement('input', {
      type: 'text',
      placeholder: 'Search tasks...',
      value: searchTerm,
      oninput: (e: any) => setSearchTerm(e.target.value)
    })
  );
}

function Filters({ 
  filters,
  users,
  tags,
  onFilterChange
}: {
  filters: AppState['filters'];
  users: Record<string, User>;
  tags: Record<string, Tag>;
  onFilterChange: (filters: AppState['filters']) => void;
}) {
  const [isOpen, setIsOpen] = useSignal(false);
  
  function updateFilter<K extends keyof AppState['filters']>(
    key: K,
    value: AppState['filters'][K]
  ) {
    onFilterChange({
      ...filters,
      [key]: value
    });
  }
  
  function togglePriority(priority: 'low' | 'medium' | 'high') {
    const newPriorities = [...filters.priority];
    const index = newPriorities.indexOf(priority);
    
    if (index !== -1) {
      newPriorities.splice(index, 1);
    } else {
      newPriorities.push(priority);
    }
    
    updateFilter('priority', newPriorities);
  }
  
  function toggleTag(tagId: string) {
    const newTags = [...filters.tags];
    const index = newTags.indexOf(tagId);
    
    if (index !== -1) {
      newTags.splice(index, 1);
    } else {
      newTags.push(tagId);
    }
    
    updateFilter('tags', newTags);
  }
  
  return createElement(
    'div',
    { class: 'dropdown' },
    createElement(
      'button',
      {
        class: 'secondary',
        onclick: () => setIsOpen(!isOpen)
      },
      'Filters ',
      Object.values(filters).some(f => 
        Array.isArray(f) ? f.length > 0 : Boolean(f)
      ) ? '(Active)' : ''
    ),
    isOpen && createElement(
      'div',
      { class: 'dropdown-content' },
      createElement(
        'div',
        { class: 'form-group', style: { padding: '0.75rem' } },
        createElement('label', { class: 'form-label' }, 'Assigned To'),
        createElement(
          'select',
          {
            value: filters.assignee || '',
            onchange: (e: any) => updateFilter('assignee', e.target.value || null)
          },
          createElement('option', { value: '' }, 'All Users'),
          ...Object.values(users).map(user =>
            createElement('option', { value: user.id }, user.name)
          )
        )
      ),
      createElement(
        'div',
        { style: { padding: '0 0.75rem 0.75rem' } },
        createElement('label', { class: 'form-label' }, 'Priority'),
        createElement(
          'div',
          { class: 'flex gap-2' },
          createElement(
            'button',
            {
              class: filters.priority.includes('low') ? '' : 'secondary',
              style: { flex: 1 },
              onclick: () => togglePriority('low')
            },
            'Low'
          ),
          createElement(
            'button',
            {
              class: filters.priority.includes('medium') ? '' : 'secondary',
              style: { flex: 1 },
              onclick: () => togglePriority('medium')
            },
            'Medium'
          ),
          createElement(
            'button',
            {
              class: filters.priority.includes('high') ? '' : 'secondary',
              style: { flex: 1 },
              onclick: () => togglePriority('high')
            },
            'High'
          )
        )
      ),
      createElement(
        'div',
        { style: { padding: '0 0.75rem 0.75rem' } },
        createElement('label', { class: 'form-label' }, 'Tags'),
        createElement(
          'div',
          { class: 'flex gap-2 flex-col' },
          ...Object.values(tags).map(tag =>
            createElement(
              'label',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.375rem 0'
                }
              },
              createElement('input', {
                type: 'checkbox',
                checked: filters.tags.includes(tag.id),
                onchange: () => toggleTag(tag.id),
                style: {
                  margin: 0,
                  width: '16px',
                  height: '16px'
                }
              }),
              createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: 1
                  }
                },
                createElement('span', {
                  style: {
                    width: '0.75rem',
                    height: '0.75rem',
                    background: tag.color,
                    borderRadius: '50%',
                    display: 'inline-block'
                  }
                }),
                createElement('span', {}, tag.name)
              )
            )
          )
        )
      ),
      createElement(
        'div',
        { class: 'flex gap-2', style: { padding: '0.75rem', borderTop: '1px solid var(--border)' } },
        createElement(
          'button',
          {
            class: 'secondary',
            style: { flex: 1 },
            onclick: () => {
              onFilterChange({
                search: '',
                assignee: null,
                tags: [],
                priority: []
              });
              setIsOpen(false);
            }
          },
          'Reset'
        ),
        createElement(
          'button',
          {
            style: { flex: 1 },
            onclick: () => setIsOpen(false)
          },
          'Apply'
        )
      )
    )
  );
}

function CreateTaskModal({ 
  users, 
  tags, 
  statuses, 
  onClose, 
  onSubmit,
  initialStatus
}: {
  users: Record<string, User>;
  tags: Record<string, Tag>;
  statuses: string[];
  onClose: () => void;
  onSubmit: (task: Task) => void;
  initialStatus?: string;
}) {
  console.log("initialStatus", initialStatus)
  const [title, setTitle] = useSignal('');
  const [description, setDescription] = useSignal('');
  const [status, setStatus] = useSignal(initialStatus || statuses[0] || '');
  const [priority, setPriority] = useSignal<Task['priority']>('medium');
  const [assignedTo, setAssignedTo] = useSignal<string | null>(null);
  const [dueDate, setDueDate] = useSignal<string>('');
  const [selectedTags, setSelectedTags] = useSignal<string[]>([]);

  function toggleTag(tagId: string) {
    const index = selectedTags.indexOf(tagId);
    if (index !== -1) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  }
  
  function handleSubmit() {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignedTo,
      dueDate: dueDate ? new Date(dueDate).getTime() : null,
      tags: selectedTags,
      subtasks: [],
      comments: [],
      attachments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isArchived: false
    };
    
    onSubmit(newTask);
    onClose();
  }
  
  return createElement(
    'div',
    { class: 'modal-backdrop' },
    createElement(
      'div',
      { class: 'modal', onclick: (e: MouseEvent) => e.stopPropagation() },
      createElement(
        'div',
        { class: 'modal-header' },
        createElement('h2', {}, 'Create New Task'),
        createElement('button', { class: 'icon-button', onclick: onClose }, '×')
      ),
      createElement(
        'div',
        { class: 'form-group' },
        createElement('label', { class: 'form-label' }, 'Title'),
        createElement('input', {
          type: 'text',
          value: title,
          oninput: (e: any) => setTitle(e.target.value),
          placeholder: 'Task title',
          required: true
        })
      ),
      createElement(
        'div',
        { class: 'form-group' },
        createElement('label', { class: 'form-label' }, 'Description'),
        createElement('textarea', {
          rows: 4,
          value: description,
          oninput: (e: any) => setDescription(e.target.value),
          placeholder: 'Task description'
        })
      ),
      createElement(
        'div',
        { class: 'flex gap-4' },
        createElement(
          'div',
          { class: 'form-group', style: { flex: 1 } },
          createElement('label', { class: 'form-label' }, 'Status'),
          createElement(
            'select',
            {
              value: status,
              onchange: (e: any) => {
                setStatus(e.target.value);
              }
            },
            ...statuses.map(s => 
              createElement('option', { value: s }, s)
            )
          )
        ),
        createElement(
          'div',
          { class: 'form-group', style: { flex: 1 } },
          createElement('label', { class: 'form-label' }, 'Priority'),
          createElement(
            'select',
            {
              value: priority,
              onchange: (e: any) => setPriority(e.target.value)
            },
            createElement('option', { value: 'low' }, 'Low'),
            createElement('option', { value: 'medium' }, 'Medium'),
            createElement('option', { value: 'high' }, 'High')
          )
        )
      ),
      createElement(
        'div',
        { class: 'flex gap-4' },
        createElement(
          'div',
          { class: 'form-group', style: { flex: 1 } },
          createElement('label', { class: 'form-label' }, 'Assigned To'),
          createElement(
            'select',
            {
              value: assignedTo || '',
              onchange: (e: any) => setAssignedTo(e.target.value || null)
            },
            createElement('option', { value: '' }, 'Unassigned'),
            ...Object.values(users).map(user =>
              createElement('option', { value: user.id }, user.name)
            )
          )
        ),
        createElement(
          'div',
          { class: 'form-group', style: { flex: 1 } },
          createElement('label', { class: 'form-label' }, 'Due Date'),
          createElement('input', {
            type: 'date',
            value: dueDate,
            onchange: (e: any) => setDueDate(e.target.value)
          })
        )
      ),
      createElement(
        'div',
        { class: 'form-group' },
        createElement('label', { class: 'form-label' }, 'Tags'),
        createElement(
          'div',
          { class: 'flex gap-2 flex-wrap' },
          ...Object.values(tags).map(tag =>
            createElement(
              'button',
              {
                type: 'button',
                class: selectedTags.includes(tag.id) ? '' : 'secondary',
                style: {
                  background: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                  borderColor: tag.color
                },
                onclick: () => toggleTag(tag.id)
              },
              tag.name
            )
          )
        )
      ),
      createElement(
        'div',
        { class: 'flex justify-between', style: { marginTop: '1.5rem' } },
        createElement('button', { class: 'secondary', onclick: onClose }, 'Cancel'),
        createElement('button', { onclick: handleSubmit }, 'Create Task')
      )
    )
  );
}

// Main App Component
function Board() {
  // State
  const [state, setState] = useSignal<AppState>({
    columns: [],
    tasks: {},
    users: {},
    tags: {},
    filters: {
      search: '',
      assignee: null,
      tags: [],
      priority: []
    },
    theme: 'light'
  });
  const [activeTaskId, setActiveTaskId] = useSignal<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useSignal<boolean>(false);
  const [createModalStatus, setCreateModalStatus] = useSignal<string | undefined>(undefined);
  const draggedTaskId = useAnchor<string | null>(null);
  const isInitialized = useAnchor<boolean>(false);
  const [isDragging, setIsDragging] = useSignal(false);
  const [dragFeedback, setDragFeedback] = useSignal('');
  
  useAfter(() => {
    const savedState = localStorage.getItem('dominoKanbanState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
        isInitialized.current = true;
        return;
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
    
    // Otherwise generate mock data
    const mockUsers: Record<string, User> = {
      'u1': { id: 'u1', name: 'Alex Johnson', avatar: '' },
      'u2': { id: 'u2', name: 'Maria Garcia', avatar: '' },
      'u3': { id: 'u3', name: 'David Chen', avatar: '' },
      'u4': { id: 'u4', name: 'Sarah Park', avatar: '' }
    };
    
    const mockTags: Record<string, Tag> = {
      't1': { id: 't1', name: 'Frontend', color: '#3b82f6' },
      't2': { id: 't2', name: 'Backend', color: '#8b5cf6' },
      't3': { id: 't3', name: 'Bug', color: '#ef4444' },
      't4': { id: 't4', name: 'Feature', color: '#10b981' },
      't5': { id: 't5', name: 'Documentation', color: '#f59e0b' }
    };
    
    const mockColumns: Column[] = [
      { id: 'c1', title: 'To Do', tasks: [], wip: 0 },
      { id: 'c2', title: 'In Progress', tasks: [], wip: 5 },
      { id: 'c3', title: 'Review', tasks: [], wip: 3 },
      { id: 'c4', title: 'Done', tasks: [], wip: 0 }
    ];
    
    const mockTasks: Record<string, Task> = {};
    
    // Generate some example tasks
    const taskData = [
      {
        title: 'Implement authentication flow',
        description: 'Create login, registration and password reset functionality',
        status: 'To Do',
        priority: 'high' as const,
        tags: ['t1', 't2'],
        assignedTo: 'u1'
      },
      {
        title: 'Fix navigation responsiveness',
        description: 'Mobile navigation doesn\'t collapse properly on small screens',
        status: 'In Progress',
        priority: 'medium' as const,
        tags: ['t1', 't3'],
        assignedTo: 'u2'
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: 'Review',
        priority: 'medium' as const,
        tags: ['t2'],
        assignedTo: 'u3'
      },
      {
        title: 'Add dark mode support',
        description: 'Implement theme toggle and adjust styles for dark mode',
        status: 'To Do',
        priority: 'low' as const,
        tags: ['t1', 't4'],
        assignedTo: 'u2'
      },
      {
        title: 'Write API documentation',
        description: 'Create comprehensive docs for all backend endpoints',
        status: 'Done',
        priority: 'medium' as const,
        tags: ['t5'],
        assignedTo: 'u4'
      },
      {
        title: 'Optimize database queries',
        description: 'Improve performance of slow queries on the users table',
        status: 'In Progress',
        priority: 'high' as const,
        tags: ['t2', 't3'],
        assignedTo: 'u3'
      },
      {
        title: 'Create user dashboard',
        description: 'Design and implement the main user dashboard with activity charts',
        status: 'To Do',
        priority: 'medium' as const,
        tags: ['t1', 't4'],
        assignedTo: 'u1'
      },
      {
        title: 'Fix image upload bug',
        description: 'Users are unable to upload profile pictures larger than 1MB',
        status: 'Review',
        priority: 'high' as const,
        tags: ['t1', 't2', 't3'],
        assignedTo: 'u4'
      }
    ];
    
    // Create tasks and assign to columns
    taskData.forEach((task, index) => {
      const id = `task${index + 1}`;
      mockTasks[id] = {
        id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo,
        dueDate: Date.now() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000, // Random due date in next 2 weeks
        tags: task.tags,
        subtasks: Array(Math.floor(Math.random() * 4))
          .fill(0)
          .map((_, i) => ({
            id: `${id}-subtask-${i}`,
            title: `Subtask ${i + 1} for ${task.title}`,
            completed: Math.random() > 0.5
          })),
        comments: Array(Math.floor(Math.random() * 3))
          .fill(0)
          .map((_, i) => ({
            id: `${id}-comment-${i}`,
            userId: Object.keys(mockUsers)[Math.floor(Math.random() * Object.keys(mockUsers).length)],
            content: `This is comment ${i + 1} on task ${task.title}`,
            createdAt: Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000 // Random timestamp in past 5 days
          })),
        attachments: [],
        createdAt: Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000, // Random creation date in past 10 days
        updatedAt: Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000, // Random update in past 5 days
        isArchived: false
      };
      
      // Find the column for this task
      const column = mockColumns.find(c => c.title === task.status);
      if (column) {
        column.tasks.push(id);
      }
    });
    
    setState({
      columns: mockColumns,
      tasks: mockTasks,
      users: mockUsers,
      tags: mockTags,
      filters: {
        search: '',
        assignee: null,
        tags: [],
        priority: []
      },
      theme: 'light'
    });
    
    isInitialized.current = true;
  }, []);
  
  // Save state to localStorage when it changes
  useAfter(() => {
    if (!isInitialized.current) return;
    
    try {
      localStorage.setItem('dominoKanbanState', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state]);
  
  // Update theme on body when it changes
  useAfter(() => {
    document.body.setAttribute('data-theme', state.theme);
  }, [state.theme]);
  
  const activeTask = activeTaskId ? state.tasks[activeTaskId] : null;
  
  function toggleTheme() {
    setState({
      ...state,
      theme: state.theme === 'light' ? 'dark' : 'light'
    });
  }
  
  function updateFilters(filters: AppState['filters']) {
    setState({
      ...state,
      filters
    });
  }
  
  function handleSearch(term: string) {
    setState({
      ...state,
      filters: {
        ...state.filters,
        search: term
      }
    });
  }
  
  function handleDragStart(taskId: string, e: DragEvent) {
    e.stopPropagation();
    
    const task = state.tasks[taskId];
    if (!task) return;
    
    setIsDragging(true);
    setDragFeedback(`Moving "${task.title}"...`);
    
    if (e.dataTransfer) {
      try {
        e.dataTransfer.setData('application/json', JSON.stringify({
          taskId: taskId
        }));
        e.dataTransfer.effectAllowed = 'move';
        draggedTaskId.current = taskId;
      } catch (err) {
        console.error('Error in handleDragStart:', err);
        // Fallback for browsers that don't support complex data
        e.dataTransfer.setData('text/plain', taskId);
        draggedTaskId.current = taskId;
      }
    }
  }
  
  function handleDragEnd(e: DragEvent) {
    setIsDragging(false);
    setDragFeedback('');
    draggedTaskId.current = null;
  }
  
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  }
  
  function handleDrop(columnId: string, e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    // Get data from dataTransfer
    try {
      let taskId = '';
      let sourceColumnId = '';
      
      // First try to get JSON data
      const jsonData = e.dataTransfer?.getData('application/json');
      
      if (jsonData) {
        const parsedData = JSON.parse(jsonData);
        taskId = parsedData.taskId;
        sourceColumnId = parsedData.columnId || '';
      } else {
        // Fallback to plain text
        taskId = e.dataTransfer?.getData('text/plain') || '';
      }
      
      // Last resort: use the stored draggedTaskId
      if (!taskId && draggedTaskId.current) {
        taskId = draggedTaskId.current;
      }
      
      if (!taskId) {
        console.warn('No task ID found in drop data');
        return;
      }
      
      const task = state.tasks[taskId];
      if (!task) {
        console.warn('Task not found:', taskId);
        return;
      }
      
      if (!sourceColumnId) {
        for (const column of state.columns) {
          if (column.tasks.includes(taskId)) {
            sourceColumnId = column.id;
            break;
          }
        }
      }
      
      if (sourceColumnId === columnId) {
        return;
      }
      
      const targetColumn = state.columns.find(c => c.id === columnId);
      if (!targetColumn) {
        console.warn('Target column not found:', columnId);
        return;
      }
    
      const newStatus = targetColumn.title;
      
      const updatedTasks = {
        ...state.tasks,
        [taskId]: {
          ...task,
          status: newStatus,
          updatedAt: Date.now()
        }
      };
      
      const updatedColumns = state.columns.map(column => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter(id => id !== taskId)
          };
        }
        
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, taskId]
          };
        }
        
        return column;
      });
      
      setState({
        ...state,
        tasks: updatedTasks,
        columns: updatedColumns
      });
      
      draggedTaskId.current = null;
    } catch (error) {
      console.error('Error processing drop:', error);
    }
  }
  
  function createTask(task: Task) {
    const targetColumn = state.columns.find(column => 
      column.title.toLowerCase() === task.status.toLowerCase()
    );
    
    if (!targetColumn) {
      console.error('No matching column found for status:', task.status);
      return;
    }
    
    setState({
      ...state,
      tasks: {
        ...state.tasks,
        [task.id]: task
      },
      columns: state.columns.map(column => 
        column.id === targetColumn.id
          ? { ...column, tasks: [...column.tasks, task.id] }
          : column
      )
    });
  }
  
  function updateTask(updatedTask: Task) {
    setState({
      ...state,
      tasks: {
        ...state.tasks,
        [updatedTask.id]: updatedTask
      }
    });
  }
  
  function deleteTask(taskId: string) {
    const updatedColumns = state.columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(id => id !== taskId)
    }));
    
    const updatedTasks = { ...state.tasks };
    delete updatedTasks[taskId];
    
    setState({
      ...state,
      columns: updatedColumns,
      tasks: updatedTasks
    });
  }
  
  function getFilteredTasks(tasks: Record<string, Task>) {
    return Object.values(tasks).filter(task => {
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        const inTitle = task.title.toLowerCase().includes(searchLower);
        const inDesc = task.description.toLowerCase().includes(searchLower);
        
        if (!inTitle && !inDesc) return false;
      }
      
      if (state.filters.assignee && task.assignedTo !== state.filters.assignee) {
        return false;
      }
      
      if (state.filters.tags.length > 0) {
        const hasTag = task.tags.some(tagId => state.filters.tags.includes(tagId));
        if (!hasTag) return false;
      }
      
      // Filter by priority
      if (state.filters.priority.length > 0) {
        if (!state.filters.priority.includes(task.priority)) {
          return false;
        }
      }
      
      return !task.isArchived;
    });
  }
  
  const filteredTasks = getFilteredTasks(state.tasks);
  const filteredTaskIds = new Set(filteredTasks.map(task => task.id));
  
  const filteredColumns = state.columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(taskId => filteredTaskIds.has(taskId))
  }));
  
  useAfter(() => {
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'drag-feedback';
    feedbackEl.textContent = 'Dragging task...';
    document.body.appendChild(feedbackEl);
    
    return () => {
      if (document.body.contains(feedbackEl)) {
        document.body.removeChild(feedbackEl);
      }
    };
  }, []);
  
  useAfter(() => {
    const feedbackEl = document.querySelector('.drag-feedback');
    if (!feedbackEl) return;
    
    if (isDragging && dragFeedback) {
      feedbackEl.textContent = dragFeedback;
      feedbackEl.classList.add('active');
    } else {
      feedbackEl.classList.remove('active');
    }
  }, [isDragging, dragFeedback]);
  
  function openCreateModalWithStatus(status: string) {
    setCreateModalStatus(status);
    setShowCreateModal(true);
  }
  
  return createElement(
    'div',
    { class: 'app' },
    createElement(
      'header',
      {},
      createElement('h1', {}, 'DOMino Kanban Board'),
      createElement(
        'div',
        { class: 'toolbar' },
        createElement(SearchBar, {
          value: state.filters.search,
          onChange: handleSearch
        }),
        createElement(Filters, {
          filters: state.filters,
          users: state.users,
          tags: state.tags,
          onFilterChange: updateFilters
        }),
        createElement(
          'button',
          {
            onclick: () => setShowCreateModal(true)
          },
          'New Task'
        ),
        createElement(ThemeToggle, {
          theme: state.theme,
          onToggle: toggleTheme
        })
      )
    ),
    createElement(
      'div',
      { class: 'board' },
      ...filteredColumns.map(column =>
        createElement(BoardColumn, {
          column,
          tasks: state.tasks,
          users: state.users,
          tags: state.tags,
          onDrop: (e: DragEvent) => handleDrop(column.id, e),
          onDragOver: handleDragOver,
          onTaskClick: setActiveTaskId,
          onAddTask: () => openCreateModalWithStatus(column.title)
        })
      )
    ),
    
    activeTask && createElement(TaskDetailsModal, {
      task: activeTask,
      users: state.users,
      tags: state.tags,
      onClose: () => setActiveTaskId(null),
      onUpdate: updateTask,
      onDelete: () => deleteTask(activeTaskId as string)
    }),
    
    showCreateModal && createElement(CreateTaskModal, {
      users: state.users,
      tags: state.tags,
      statuses: state.columns.map(c => c.title),
      onClose: () => {
        setShowCreateModal(false);
        setCreateModalStatus(undefined);
      },
      onSubmit: createTask,
      initialStatus: createModalStatus
    })
  );
}

function App() {
  return createElement(Board, {});
}

document.addEventListener('DOMContentLoaded', () => {
  addStyles();
  
  const root = document.getElementById('root');
  if (root) {
    render(createElement(App, {}), root);
  }
});

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return createElement(
    'button',
    {
      class: 'icon-button',
      title: `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`,
      onclick: onToggle,
    },
    theme === 'light' ? '🌙' : '☀️'
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return createElement(
    'div',
    { class: 'search-bar' },
    createElement('span', { 
      class: 'search-icon'
    }, '🔍'),
    createElement('input', {
      type: 'text',
      placeholder: 'Search tasks...',
      value,
      oninput: (e: any) => onChange(e.target.value)
    })
  );
}

function UserAvatar({ user }: { user: User }) {
  const initials = user.name.split(' ').map(name => name[0]).join('');
  
  if (user.avatar) {
    return createElement('img', {
      src: user.avatar,
      alt: user.name,
      title: user.name,
      width: 32,
      height: 32,
      style: {
        borderRadius: '50%',
        objectFit: 'cover'
      }
    });
  }
  
  return createElement(
    'div',
    {
      style: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'var(--primary-foreground)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '0.75rem'
      }
    },
    initials
  );
}

function TagBadge({ tag }: { tag: Tag }) {
  return createElement(
    'span',
    {
      class: 'tag',
      style: {
        backgroundColor: tag.color
      }
    },
    tag.name
  );
}

function TaskCard({ task, users, tags, onDragStart, onDragEnd, onClick }: {
  task: Task;
  users: Record<string, User>;
  tags: Record<string, Tag>;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: (e: DragEvent) => void;
  onClick: () => void;
}) {
  const [isDragging, setIsDragging] = useSignal(false);
  const cardRef = useAnchor<HTMLDivElement | null>(null);
  
  useAfter(() => {
    if (!cardRef.current) return;
    
    const element = cardRef.current;
    
    const dragStartHandler = (e: DragEvent) => handleDragStart(e);
    const dragEndHandler = (e: DragEvent) => handleDragEnd(e);
    const clickHandler = (e: MouseEvent) => handleClick(e);
    
    element.addEventListener('dragstart', dragStartHandler);
    element.addEventListener('dragend', dragEndHandler);
    element.addEventListener('click', clickHandler);
    
    return () => {
      element.removeEventListener('dragstart', dragStartHandler);
      element.removeEventListener('dragend', dragEndHandler);
      element.removeEventListener('click', clickHandler);
    };
  }, []);
  
  function handleDragStart(e: DragEvent) {
    e.stopPropagation();
    
    if (e.dataTransfer) {
      try {
        e.dataTransfer.setData('application/json', JSON.stringify({
          taskId: task.id
        }));
        
        e.dataTransfer.effectAllowed = 'move';
        
        if (cardRef.current) {
          const element = cardRef.current;
          const rect = element.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const offsetY = e.clientY - rect.top;
          
          e.dataTransfer.setDragImage(element, offsetX, offsetY);
        }
        
        if (cardRef.current) {
          cardRef.current.classList.add('dragging');
        }
        
        setIsDragging(true);
        
        onDragStart(e);
        
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.classList.add('dragging');
          }
        }, 0);
      } catch (err) {
        console.error('Error setting drag data:', err);
      }
    }
  }
  
  function handleDragEnd(e: DragEvent) {
    e.stopPropagation();
    
    if (cardRef.current) {
      cardRef.current.classList.remove('dragging');
    }
    
    setIsDragging(false);
    
    onDragEnd(e);
  }
  
  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    if (!isDragging) {
      onClick();
    }
  }

  const dueDateEl = task.dueDate ? createElement(
    'span',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }
    },
    '📅 ' + formatDate(task.dueDate)
  ) : null;
  
  const tagsEl = task.tags.length ? createElement(
    'div',
    { class: 'card-tags' },
    ...task.tags
      .filter(id => tags[id])
      .map(id => createElement(TagBadge, { tag: tags[id] }))
  ) : null;
  
  const assigneeEl = task.assignedTo && users[task.assignedTo] ? createElement(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    },
    createElement(UserAvatar, { user: users[task.assignedTo] as User })
  ) : null;
  
  const subtasks = task.subtasks.length ? createElement(
    'div',
    { class: 'subtasks' },
    createElement(
      'span',
      {
        style: {
          fontSize: '0.75rem',
          color: 'var(--muted-foreground)'
        }
      },
      `${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length}`
    )
  ) : null;
  
  return createElement(
    'div',
    {
      ref: cardRef,
      class: `card ${isDragging ? 'dragging' : ''}`,
      draggable: true,
      onclick: handleClick
    },
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }
      },
      createElement('span', { class: `priority priority-${task.priority}` }),
      createElement('h3', { class: 'card-title' }, task.title)
    ),
    createElement('p', { class: 'card-description' }, task.description),
    tagsEl,
    createElement(
      'div',
      { class: 'card-meta' },
      dueDateEl,
      assigneeEl,
      subtasks
    )
  );
}

function BoardColumn({ column, tasks, users, tags, onDrop, onDragOver, onTaskClick, onAddTask }: {
  column: Column;
  tasks: Record<string, Task>;
  users: Record<string, User>;
  tags: Record<string, Tag>;
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onTaskClick: (taskId: string) => void;
  onAddTask: () => void;
}) {
  const [isDropActive, setIsDropActive] = useSignal(false);
  const columnRef = useAnchor<HTMLDivElement | null>(null);
  const dropAreaRef = useAnchor<HTMLDivElement | null>(null);
  
  useAfter(() => {
    if (!columnRef.current || !dropAreaRef.current) return;
    
    const columnEl = columnRef.current;
    const dropAreaEl = dropAreaRef.current;
    
    dropAreaEl.addEventListener('dragover', handleDragOver);
    dropAreaEl.addEventListener('dragenter', handleDragEnter);
    dropAreaEl.addEventListener('dragleave', handleDragLeave);
    dropAreaEl.addEventListener('drop', handleDrop);
    
    return () => {
      dropAreaEl.removeEventListener('dragover', handleDragOver);
      dropAreaEl.removeEventListener('dragenter', handleDragEnter);
      dropAreaEl.removeEventListener('dragleave', handleDragLeave);
      dropAreaEl.removeEventListener('drop', handleDrop);
    };
  }, []);
  
  const columnTasks = column.tasks
    .filter(id => tasks[id] && !tasks[id].isArchived)
    .map(id => tasks[id]);
  
  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDropActive(true);
  }
  
  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    const relatedTarget = e.relatedTarget as Node;
    if (!relatedTarget || !(dropAreaRef.current?.contains(relatedTarget))) {
      setIsDropActive(false);
    }
  }
  
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    
    if (!isDropActive) {
      setIsDropActive(true);
    }
  }
  
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDropActive(false);
    
    onDrop(e);
  }
  
  return createElement(
    'div',
    { 
      class: 'column',
      ref: columnRef
    },
    createElement(
      'div',
      { class: 'column-header' },
      createElement(
        'div',
        { class: 'column-title' },
        column.title,
        createElement('span', { class: 'column-count' }, columnTasks.length.toString())
      ),
      createElement(
        'button',
        {
          class: 'icon-button',
          title: 'Add task',
          onclick: onAddTask
        },
        '+'
      )
    ),
    createElement(
      'div',
      {
        class: `column-content`,
        'data-column-id': column.id
      },
      createElement(
        'div',
        { 
          ref: dropAreaRef,
          class: `column-drop-area ${isDropActive ? 'drop-active' : ''}`,
        },
        ...columnTasks.map(task => 
          createElement(TaskCard, {
            task,
            users,
            tags,
            onDragStart: (e: DragEvent) => {
              if (e.dataTransfer) {
                try {
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    taskId: task.id,
                    columnId: column.id
                  }));
                  e.dataTransfer.effectAllowed = 'move';
                } catch (err) {
                  console.error('Error setting drag data:', err);
                  // Fallback
                  e.dataTransfer.setData('text/plain', task.id);
                }
              }
            },
            onDragEnd: (e: DragEvent) => {
              // Nothing special needed here
            },
            onClick: () => onTaskClick(task.id)
          })
        )
      )
    )
  );
}

function TaskDetailsModal({ task, users, tags, onClose, onUpdate, onDelete }: {
  task: Task;
  users: Record<string, User>;
  tags: Record<string, Tag>;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: () => void;
}) {
  const [editedTask, setEditedTask] = useSignal<Task>({ ...task });
  const [activeTab, setActiveTab] = useSignal<'details' | 'subtasks' | 'comments'>('details');
  
  useAfter(() => {
    setEditedTask({ ...task });
  }, [task.id]);
  
  function updateField(field: keyof Task, value: any) {
    setEditedTask({
      ...editedTask,
      [field]: value,
      updatedAt: Date.now()
    });
  }
  
  function addSubtask(title: string) {
    if (!title.trim()) return;
    
    const newSubtask: Subtask = {
      id: generateId(),
      title: title.trim(),
      completed: false
    };
    
    updateField('subtasks', [...editedTask.subtasks, newSubtask]);
  }
  
  function toggleSubtask(subtaskId: string) {
    const updatedSubtasks = editedTask.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    
    updateField('subtasks', updatedSubtasks);
  }
  
  function addComment(content: string, userId: string) {
    if (!content.trim()) return;
    
    const newComment: Comment = {
      id: generateId(),
      userId,
      content: content.trim(),
      createdAt: Date.now()
    };
    
    updateField('comments', [...editedTask.comments, newComment]);
  }
  
  function handleSave() {
    onUpdate(editedTask);
    onClose();
  }
  
  let tabContent;
  
  if (activeTab === 'details') {
    tabContent = createElement(
      'div',
      { class: 'tab-content' },
      createElement(
        'div',
        { class: 'form-group' },
        createElement('label', { class: 'form-label' }, 'Title'),
        createElement('input', {
          type: 'text',
          value: editedTask.title,
          oninput: (e: any) => updateField('title', e.target.value)
        })
      ),
      createElement(
        'div',
        { class: 'form-group' },
        createElement('label', { class: 'form-label' }, 'Description'),
        createElement('textarea', {
          rows: 4,
          value: editedTask.description,
          oninput: (e: any) => updateField('description', e.target.value)
        })
      ),
      createElement(
        'div',
        { class: 'flex gap-4' },
        createElement(
          'div',
          { class: 'form-group', style: { flex: 1 } },
          createElement('label', { class: 'form-label' }, 'Priority'),
          createElement(
            'select',
            {
              value: editedTask.priority,
              onchange: (e: any) => updateField('priority', e.target.value)
            },
            createElement('option', { value: 'low' }, 'Low'),
            createElement('option', { value: 'medium' }, 'Medium'),
            createElement('option', { value: 'high' }, 'High')
          )
        ),
        createElement(
          'div',
          { class: 'form-group', style: { flex: 1 } },
          createElement('label', { class: 'form-label' }, 'Assigned To'),
          createElement(
            'select',
            {
              value: editedTask.assignedTo || '',
              onchange: (e: any) => updateField('assignedTo', e.target.value || null)
            },
            createElement('option', { value: '' }, 'Unassigned'),
            ...Object.values(users).map(user =>
              createElement('option', { value: user.id }, user.name)
            )
          )
        )
      ),
      createElement(
        'div',
        { class: 'form-group' },
        createElement('label', { class: 'form-label' }, 'Due Date'),
        createElement('input', {
          type: 'date',
          value: editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().slice(0, 10) : '',
          onchange: (e: any) => updateField('dueDate', e.target.value ? new Date(e.target.value).getTime() : null)
        })
      )
    );
  } else if (activeTab === 'subtasks') {
    tabContent = createElement(
      'div',
      { class: 'tab-content' },
      createElement(
        'div',
        { class: 'form-group' },
        createElement('label', { class: 'form-label' }, 'New Subtask'),
        createElement(
          'div',
          { class: 'flex gap-2' },
          createElement('input', {
            type: 'text',
            id: 'new-subtask',
            placeholder: 'Enter subtask title...'
          }),
          createElement(
            'button',
            {
              onclick: () => {
                const input = document.getElementById('new-subtask') as HTMLInputElement;
                addSubtask(input.value);
                input.value = '';
                input.focus();
              }
            },
            'Add'
          )
        )
      ),
      createElement(
        'div',
        { class: 'subtasks-list' },
        ...editedTask.subtasks.map(subtask =>
          createElement(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border)'
              }
            },
            createElement('input', {
              type: 'checkbox',
              checked: subtask.completed,
              onchange: () => toggleSubtask(subtask.id)
            }),
            createElement(
              'span',
              {
                style: {
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                  flex: 1
                }
              },
              subtask.title
            ),
            createElement(
              'button',
              {
                class: 'icon-button',
                onclick: () => {
                  const updatedSubtasks = editedTask.subtasks.filter(st => st.id !== subtask.id);
                  updateField('subtasks', updatedSubtasks);
                }
              },
              '×'
            )
          )
        )
      )
    );
  } else if (activeTab === 'comments') {
    tabContent = createElement(
      'div',
      { class: 'tab-content' },
      createElement(
        'div',
        { class: 'form-group' },
        createElement('label', { class: 'form-label' }, 'Add Comment'),
        createElement(
          'div',
          { class: 'flex gap-2' },
          createElement('textarea', {
            id: 'new-comment',
            rows: 2,
            placeholder: 'Write a comment...'
          }),
          createElement(
            'button',
            {
              onclick: () => {
                const textarea = document.getElementById('new-comment') as HTMLTextAreaElement;
                // Using the first user for simplicity - in a real app, this would be the current user
                const firstUserId = Object.keys(users)[0];
                addComment(textarea.value, firstUserId);
                textarea.value = '';
                textarea.focus();
              }
            },
            'Post'
          )
        )
      ),
      createElement(
        'div',
        { class: 'comments-list' },
        ...editedTask.comments.map(comment => {
          const user = users[comment.userId];
          return createElement(
            'div',
            {
              style: {
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '1rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius)',
                background: 'var(--background)'
              }
            },
            createElement(UserAvatar, { user }),
            createElement(
              'div',
              { style: { flex: 1 } },
              createElement(
                'div',
                { style: { marginBottom: '0.25rem' } },
                createElement('strong', {}, user.name),
                createElement(
                  'span',
                  { style: { fontSize: '0.75rem', color: 'var(--muted-foreground)', marginLeft: '0.5rem' } },
                  formatDate(comment.createdAt)
                )
              ),
              createElement('p', {}, comment.content)
            )
          );
        })
      )
    );
  }
  
  return createElement(
    'div',
    { class: 'modal-backdrop' },
    createElement(
      'div',
      { class: 'modal', onclick: (e: MouseEvent) => e.stopPropagation() },
      createElement(
        'div',
        { class: 'modal-header' },
        createElement('h2', {}, 'Task Details'),
        createElement('button', { class: 'icon-button', onclick: onClose }, '×')
      ),
      createElement(
        'div',
        { class: 'tabs' },
        createElement(
          'div',
          { class: 'flex gap-2 mb-4' },
          createElement(
            'button',
            {
              class: activeTab === 'details' ? '' : 'secondary',
              onclick: () => setActiveTab('details')
            },
            'Details'
          ),
          createElement(
            'button',
            {
              class: activeTab === 'subtasks' ? '' : 'secondary',
              onclick: () => setActiveTab('subtasks')
            },
            'Subtasks'
          ),
          createElement(
            'button',
            {
              class: activeTab === 'comments' ? '' : 'secondary',
              onclick: () => setActiveTab('comments')
            },
            'Comments'
          )
        ),
        tabContent
      ),
      createElement(
        'div',
        { class: 'flex justify-between', style: { marginTop: '1.5rem' } },
        createElement(
          'button',
          {
            class: 'danger',
            onclick: () => {
              if (confirm('Are you sure you want to delete this task?')) {
                onDelete();
                onClose();
              }
            }
          },
          'Delete'
        ),
        createElement(
          'div',
          { class: 'flex gap-2' },
          createElement('button', { class: 'secondary', onclick: onClose }, 'Cancel'),
          createElement('button', { onclick: handleSave }, 'Save Changes')
        )
      )
    )
  );
}
