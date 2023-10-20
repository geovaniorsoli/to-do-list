document.addEventListener('DOMContentLoaded', function() {
    loadTasksAndTitles();
    attachEventListeners();

    document.getElementById('clearDataButton').addEventListener('click', function() {
        bootstrapConfirm('warning', 'Quer apagar tudo?', function(result) {
            if (result) {
                clearAllData();
            }
        });
    });
});

function attachEventListeners() {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.addEventListener('click', function(event) {
        const button = event.target.closest('button');
        if (button) {
            const container = button.closest('.container-task-hr'); 
            if (button.classList.contains('btn-remove-task')) {
                container.remove();
                saveTasksAndTitles();
            } else if (button.classList.contains('btn-mark-task')) {
                container.querySelector('.taskContent').style.textDecoration = 'line-through';
                button.disabled = true;
                saveTasksAndTitles();
            }
        }
    });
}

function addTitle() {
    const titleInput = document.getElementById('titleInput');
    if (!titleInput.value.trim()) return;

    const normalizedTitleValue = titleInput.value.trim().replace(/\s+/g, '-');
    const titleSelect = document.getElementById('titleSelect');
    const mainContainer = document.getElementById('taskContainer');
    const taskListDiv = createTaskList(normalizedTitleValue);
    const titleDiv = createTitleDiv(titleInput.value, normalizedTitleValue);

    mainContainer.appendChild(titleDiv);
    mainContainer.appendChild(taskListDiv);

    const option = document.createElement('option');
    option.value = titleInput.value;
    option.textContent = titleInput.value;
    titleSelect.appendChild(option);

    titleInput.value = '';
    saveTasksAndTitles();
}

function createTaskList(normalizedTitleValue) {
    const taskListDiv = document.createElement('div');
    taskListDiv.className = 'task-list-container';
    taskListDiv.id = `tasks-for-title-${normalizedTitleValue}`;
    return taskListDiv;

}

function createTitleDiv(titleValue, normalizedTitleValue) {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'gap-3 title-container align-items-end d-flex';
    titleDiv.id = `title-${normalizedTitleValue}`;

    const h3 = document.createElement('h3');
    h3.textContent = titleValue;
    titleDiv.appendChild(h3);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger';
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.addEventListener('click', function() {
        deleteTitle(normalizedTitleValue);
    });
    titleDiv.appendChild(deleteButton);

    return titleDiv;
}

function deleteTitle(normalizedTitleName) {
    const titleSelect = document.getElementById('titleSelect');
    for (let i = 0; i < titleSelect.options.length; i++) {
        if (titleSelect.options[i].value.replace(/\s+/g, '-') === normalizedTitleName) {
            titleSelect.remove(i);
            break;
        }
    }

    const titleDiv = document.getElementById(`title-${normalizedTitleName}`);
    const taskListDiv = document.getElementById(`tasks-for-title-${normalizedTitleName}`);
    if (titleDiv) titleDiv.remove();
    if (taskListDiv) taskListDiv.remove();

    saveTasksAndTitles();
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const titleSelect = document.getElementById('titleSelect');
    const selectedTitle = titleSelect.value;
    const normalizedTitleValue = selectedTitle.replace(/\s+/g, '-');

    
    if (taskInput.value.trim()) {
        const taskListDiv = document.getElementById(`tasks-for-title-${normalizedTitleValue}`);
        if (taskListDiv) {
            const taskDiv = createTaskDiv(taskInput.value);
            taskListDiv.appendChild(taskDiv);
            taskInput.value = '';
            saveTasksAndTitles();
        }
    }
}
function createTaskDiv(taskContentValue) {
    
    const hr = document.createElement('hr');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'd-flex align-items-center justify-content-between taskDiv';

    const taskContent = document.createElement('div');
    taskContent.className = 'taskContent flex-grow-1'; 
    taskContent.textContent = taskContentValue;
    taskDiv.appendChild(taskContent);

    // Criando o botão para marcar a tarefa como concluída
    const markAsDoneButton = document.createElement('button');
    markAsDoneButton.className = 'btn btn-outline-success mr-2 botao btn-mark-task'; 
    markAsDoneButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    taskDiv.appendChild(markAsDoneButton);

    // Criando o botão para remover a tarefa
    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-outline-danger botao btn-remove-task';
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    taskDiv.appendChild(removeButton);

    const container = document.createElement('div');
    container.className = 'container-task-hr'; 
    container.appendChild(taskDiv);
    container.appendChild(hr); 


    return container; 
}


function saveTasksAndTitles() {
    const tasksContainer = document.getElementById('taskContainer');
    localStorage.setItem('tasksAndTitles', tasksContainer.innerHTML);

    const titleSelect = document.getElementById('titleSelect');
    const titles = [];
    for (let i = 0; i < titleSelect.options.length; i++) {
        titles.push(titleSelect.options[i].value);
    }
    localStorage.setItem('titles', JSON.stringify(titles));
}


function loadTasksAndTitles() {
    const tasksAndTitles = localStorage.getItem('tasksAndTitles');
    if (tasksAndTitles) {
        const tasksContainer = document.getElementById('taskContainer');
        tasksContainer.innerHTML = tasksAndTitles;
    }

    const titles = JSON.parse(localStorage.getItem('titles'));
    if (titles) {
        const titleSelect = document.getElementById('titleSelect');
        titleSelect.innerHTML = ''; // Limpar as opções existentes
        titles.forEach(title => {
            const option = document.createElement('option');
            option.value = title;
            option.textContent = title;
            titleSelect.appendChild(option);
        });
    }
}

function clearAllData() {
    localStorage.removeItem('tasksAndTitles');
    localStorage.removeItem('titles');
    document.getElementById('taskContainer').innerHTML = '';
    document.getElementById('titleSelect').innerHTML = '';
}



function bootstrapConfirm(type, message, callback) {
    const modal = document.createElement('div');
    modal.className = 'modal fade'; 
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered"> <!-- 'modal-dialog-centered' para centralizar -->
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirmação</h5>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" aria-label="Close"> <i class="fas fa-times"></i> </button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success ${type}" id="confirmButton"> <i class="fas fa-check"></i> </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);

    modal.querySelector('#confirmButton').addEventListener('click', function() {
        callback(true);
        modalInstance.hide();
    });

    modal.addEventListener('hidden.bs.modal', function (event) {
        callback(false);
        document.body.removeChild(modal);
    });

    modalInstance.show();
}