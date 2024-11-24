document.addEventListener('DOMContentLoaded', () => {
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');
    const tasksList = document.getElementById('tasksList');

    // Check authentication
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/pages/signin.html';
        }
        return token;
    };

    // Load user info
    const loadUserInfo = async () => {
        const token = checkAuth();
        try {
            const response = await fetch('/api/user/info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            userEmail.textContent = data.email;
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    };

    // Load tasks
    const loadTasks = async () => {
        const token = checkAuth();
        try {
            const response = await fetch('/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            showToast('Error loading tasks', 'error');
        }
    };

    // Render tasks
    const renderTasks = (tasks) => {
        tasksList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksList.appendChild(taskElement);
        });
    };

    // Create task element
    const createTaskElement = (task) => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''} slide-in`;
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-1">${task.title}</h5>
                    <p class="mb-1">${task.description}</p>
                    <small class="text-muted">Due: ${new Date(task.dueDate).toLocaleString()}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-orange me-2" onclick="toggleTaskStatus('${task._id}')">
                        ${task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTask('${task._id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
        return div;
    };

    // Show toast notification
    const showToast = (message, type = 'success') => {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: type === 'success' ? "var(--orange)" : "#ff3333"
        }).showToast();
    };

    // Event Listeners
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/pages/signin.html';
    });

    // Initialize
    loadUserInfo();
    loadTasks();
});