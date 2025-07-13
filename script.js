// 计数器功能
let count = 0;
const countDisplay = document.getElementById('count');
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const resetBtn = document.getElementById('reset');

function updateCount() {
    countDisplay.textContent = count;
}

decreaseBtn.addEventListener('click', () => {
    count--;
    updateCount();
});

increaseBtn.addEventListener('click', () => {
    count++;
    updateCount();
});

resetBtn.addEventListener('click', () => {
    count = 0;
    updateCount();
});

// 待办事项功能
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

let todos = [];

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === '') return;

    const todo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };

    todos.push(todo);
    renderTodos();
    todoInput.value = '';
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="btn todo-delete">删除</button>
        `;

        const checkbox = li.querySelector('.todo-checkbox');
        const deleteBtn = li.querySelector('.todo-delete');

        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        todoList.appendChild(li);
    });
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// 主题切换功能
const themeToggle = document.getElementById('themeToggle');
let isDarkTheme = false;

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    themeToggle.textContent = isDarkTheme ? '切换到亮色主题' : '切换到暗色主题';
    
    // 保存主题偏好
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// 加载保存的主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    isDarkTheme = true;
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '切换到亮色主题';
}

themeToggle.addEventListener('click', toggleTheme);

// 颜色选择器功能
const colorPicker = document.getElementById('colorPicker');
const colorPreview = document.getElementById('colorPreview');

function updateColor() {
    const selectedColor = colorPicker.value;
    colorPreview.style.backgroundColor = selectedColor;
    document.documentElement.style.setProperty('--primary-color', selectedColor);
    
    // 保存颜色偏好
    localStorage.setItem('primaryColor', selectedColor);
}

// 加载保存的颜色
const savedColor = localStorage.getItem('primaryColor');
if (savedColor) {
    colorPicker.value = savedColor;
    colorPreview.style.backgroundColor = savedColor;
    document.documentElement.style.setProperty('--primary-color', savedColor);
}

colorPicker.addEventListener('input', updateColor);

// 页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// 添加一些交互效果
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 聚焦到搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        todoInput.focus();
    }
    
    // Ctrl/Cmd + T 切换主题
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
});

// 添加通知功能
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 为按钮添加通知
addTodoBtn.addEventListener('click', () => {
    if (todoInput.value.trim()) {
        showNotification('任务已添加！', 'success');
    }
});

resetBtn.addEventListener('click', () => {
    showNotification('计数器已重置！', 'info');
});

// 添加统计功能
function updateStats() {
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    
    // 创建统计元素
    let statsDiv = document.getElementById('stats');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.id = 'stats';
        statsDiv.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background-color: var(--background-color);
            border-radius: 5px;
            text-align: center;
        `;
        todoList.parentElement.appendChild(statsDiv);
    }
    
    statsDiv.innerHTML = `
        <p>总计: ${totalTodos} | 已完成: ${completedTodos} | 待完成: ${totalTodos - completedTodos}</p>
    `;
}

// 在每次待办事项更新时更新统计
const originalRenderTodos = renderTodos;
renderTodos = function() {
    originalRenderTodos();
    updateStats();
};

// 初始化统计
updateStats();