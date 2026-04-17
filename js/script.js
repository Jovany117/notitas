// ==========================================
// LÓGICA DEL RELOJ DIGITAL (Hora de la Ciudad de México)
// ==========================================

function updateClock() {
    const now = new Date();
    const options = {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true, timeZone: 'America/Mexico_City'
    };
    const timeString = now.toLocaleTimeString('es-MX', options);
    const clockElement = document.getElementById('clock');
    if (clockElement) { clockElement.textContent = timeString; }
}
updateClock();
setInterval(updateClock, 1000);

// ==========================================
// LÓGICA DE LA APLICACIÓN DE TAREAS (Post-its con Fecha y Colores)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    
    const postItColors = [
        'postit-color-1', 'postit-color-2', 'postit-color-3', 'postit-color-4', 
        'postit-color-5', 'postit-color-6', 'postit-color-7', 'postit-color-8', 
        'postit-color-9', 'postit-color-10', 'postit-color-11', 'postit-color-12', 
        'postit-color-13', 'postit-color-14', 'postit-color-15', 'postit-color-16', 
        'postit-color-17', 'postit-color-18', 'postit-color-19', 'postit-color-20',
        'postit-color-21'
    ];

    const getRandomPostItClass = () => postItColors[Math.floor(Math.random() * postItColors.length)];
    const getRandomRotation = () => Math.floor(Math.random() * 5);

    /**
     * Guarda el array de tareas en localStorage.
     */
    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    /**
     * Carga las tareas y las muestra.
     */
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => displayTask(task.text, task.completed, task.color, task.rotation, task.timestamp));
        updateNoTasksMessage();
    };

    /**
     * Muestra/oculta el mensaje de "No hay tareas".
     */
    const updateNoTasksMessage = () => {
        const currentTasks = taskList.querySelectorAll('.list-group-item:not(.no-tasks-message)').length;
        let noTasksMessage = document.querySelector('.no-tasks-message');
        if (currentTasks === 0) {
            if (!noTasksMessage) {
                const li = document.createElement('li');
                li.className = 'list-group-item flex-space-between align-middle no-tasks-message';
                li.textContent = '¡No hay tareas añadidas aún!';
                taskList.appendChild(li);
            }
        } else if (noTasksMessage) { noTasksMessage.remove(); }
    };

    /**
     * Función principal para crear y añadir una tarea al DOM.
     */
    const displayTask = (taskText, isCompleted = false, colorClass = getRandomPostItClass(), rotationValue = getRandomRotation(), timestamp = null) => {
        const li = document.createElement('li');
        li.className = `list-group-item flex-space-between align-middle ${colorClass} ${isCompleted ? 'completed' : ''}`;
        li.style.setProperty('--random-rotation', rotationValue);

        // Generar fecha si es nueva nota
        const finalTimestamp = timestamp || new Date().toLocaleString('es-MX', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Contenedor de texto y fecha
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';

        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        dateSpan.textContent = `Creado: ${finalTimestamp}`;

        taskContent.appendChild(taskSpan);
        taskContent.appendChild(dateSpan);

        taskSpan.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveCurrentTasks();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Eliminar';
        
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveCurrentTasks();
            updateNoTasksMessage();
        });

        li.appendChild(taskContent);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    };

    /**
     * Recorre el DOM y guarda en localStorage.
     */
    const saveCurrentTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('.list-group-item:not(.no-tasks-message)').forEach(li => {
            const color = postItColors.find(c => li.classList.contains(c));
            const rotation = li.style.getPropertyValue('--random-rotation');
            const dateText = li.querySelector('.task-date').textContent.replace('Creado: ', '');

            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed'),
                color: color,
                rotation: rotation,
                timestamp: dateText
            });
        });
        saveTasks(tasks);
    };

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            displayTask(taskText);
            taskInput.value = '';
            saveCurrentTasks();
            updateNoTasksMessage();
        }
    });

    taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTaskBtn.click(); });

    loadTasks();
});