document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const statusInput = document.getElementById('status');

    // Function to load all tasks from the backend
    function loadTasks() {
        axios.get('/tasks').then(response => {
            taskList.innerHTML = ''; // Clear the current list
            response.data.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${task.title}</strong> - ${task.description} 
                    [${task.status}] - Created: ${task.created_at}
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;
                taskList.appendChild(li);
            });
        });
    }

    // Event listener for the form submission to add a new task
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const taskData = {
            title: titleInput.value,
            description: descriptionInput.value,
            status: statusInput.value
        };

        // Send the new task data to the backend
        axios.post('/tasks', taskData).then(() => {
            loadTasks();  // Reload the task list
            taskForm.reset();  // Clear the form inputs
        }).catch(error => {
            console.error('There was an error creating the task!', error);
        });
    });

    // Function to edit a task
    window.editTask = function (id) {
        axios.get(/tasks/$,{id}).then(response => {
            const task = response.data;
            titleInput.value = task.title;
            descriptionInput.value = task.description;
            statusInput.value = task.status;

            // Update the form submission handler for editing
            taskForm.onsubmit = function (e) {
                e.preventDefault();
                const updatedTask = {
                    title: titleInput.value,
                    description: descriptionInput.value,
                    status: statusInput.value
                };
                axios.put(/tasks/$,{id}, updatedTask).then(() => {
                    loadTasks();
                    taskForm.reset();  // Reset the form after editing
                    taskForm.onsubmit = submitNewTask;  // Reset form action to new task
                }).catch(error => {
                    console.error('There was an error updating the task!', error);
                });
            };
        }).catch(error => {
            console.error('Task not found!', error);
        });
    };

    // Function to delete a task
    window.deleteTask = function (id) {
        axios.delete(/tasks/$,{id}).then(() => {
            loadTasks();  // Reload the task list after deletion
        }).catch(error => {
            console.error('There was an error deleting the task!', error);
        });
    };

    // Initial load of tasks
    loadTasks();
});