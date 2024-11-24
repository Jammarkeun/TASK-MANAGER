// Task management functions
const addTask = async (taskData) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Failed to add task');
        
        showToast('Task added successfully');
        loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
};

const toggleTaskStatus = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/tasks/${taskId}/toggle`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        showToast('Task status updated');
        loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
};

const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        
        showToast('Task deleted successfully');
        loadTasks();
    } catch (error) {
        showToast(error.message, 'error');
    }
};

// Form submission handler
document.getElementById('addTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        dueDate: document.getElementById('taskDueDate').value
    };
    
    addTask(taskData);
    e.target.reset();
});

// Filter tasks
document.querySelector('.task-filters').addEventListener('click', (e) => {
    if (e.target.matches('[data-filter]')) {
        const filter = e.target.dataset.filter;
        filterTasks(filter);
    }
});

const filterTasks = async (filter) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/tasks?filter=${filter}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        showToast('Error filtering tasks', 'error');
    }
};
