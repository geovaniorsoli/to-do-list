function createTaskElement(taskValue) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'd-flex align-items-start mb-3';

    const taskTable = document.createElement('table');
    taskTable.className = 'table table-bordered mr-3 table-rounded';
    const tbody = document.createElement('tbody');
    const row = tbody.insertRow();
    const cell = row.insertCell();
    cell.textContent = taskValue;
    taskTable.appendChild(tbody);
    taskDiv.appendChild(taskTable);

    const markAsDoneButton = createButton('btn btn-outline-success mr-2 botao', 'fas fa-check-circle', function() {
        cell.style.textDecoration = 'line-through';
        markAsDoneButton.disabled = true;
    });
    taskDiv.appendChild(markAsDoneButton);

    const removeButton = createButton('btn btn-outline-danger botao', 'fas fa-trash', function() {
        taskDiv.remove();
    });
    taskDiv.appendChild(removeButton);

    return taskDiv;
}

function openModal() {
    $('#addTaskModal').modal('show');
}

function createButton(buttonClass, iconClass, onClickFunction) {
    const button = document.createElement('button');
    button.className = buttonClass;
    button.onclick = onClickFunction;

    const icon = document.createElement('i');
    icon.className = iconClass;
    button.appendChild(icon);

    return button;
}

function toggleTitleInput() {
    const titleSelect = document.getElementById('titleSelect');
    const newTitleInput = document.getElementById('newTitleInput');

    if (newTitleInput.style.display === 'none') {
        newTitleInput.style.display = 'block';
        titleSelect.style.display = 'none';
    } else {
        newTitleInput.style.display = 'none';
        titleSelect.style.display = 'block';
    }
}

function addTaskToContainer() {
    const titleSelect = document.getElementById('titleSelect');
    const newTitleInput = document.getElementById('newTitleInput');
    const taskInput = document.getElementById('taskInput');
    const taskContainer = document.getElementById('taskContainer');
    
    let selectedTitle;

    if (newTitleInput) {
        if (newTitleInput.style.display !== 'none' && newTitleInput.value.trim()) {
            selectedTitle = newTitleInput.value;
        } else if (titleSelect && titleSelect.options[titleSelect.selectedIndex]) {
            selectedTitle = titleSelect.options[titleSelect.selectedIndex].value;
        }
    }

    let titleDiv = document.getElementById(selectedTitle);
    if (!titleDiv && taskContainer) {
        titleDiv = createTitleElement(selectedTitle);
        taskContainer.appendChild(titleDiv);
        addTitleOptionToSelect(selectedTitle);
    }


    const taskElement = createTaskElement(taskInput.value.trim());
    titleDiv.appendChild(taskElement);

    saveDataToLocalStorage();
    console.log("addTaskToContainer chamada");
}

function createTitleElement(titleValue) {
    const titleDiv = document.createElement('div');
    titleDiv.className = 'mt-4';
    titleDiv.id = titleValue;

    const h3 = document.createElement('h3');
    h3.textContent = titleValue;
    titleDiv.appendChild(h3);

    return titleDiv;
}

function addTitleOptionToSelect(title) {
    const titleSelect = document.getElementById('titleSelect');
    const option = document.createElement('option');
    option.value = title;
    option.textContent = title;
    titleSelect.appendChild(option);
}

function saveDataToLocalStorage() {
    const taskContainer = document.getElementById('taskContainer');
    localStorage.setItem('tasksData', taskContainer.innerHTML);
}

function loadDataFromLocalStorage() {
    const tasksData = localStorage.getItem('tasksData');
    if (tasksData) {
        document.getElementById('taskContainer').innerHTML = tasksData;
    }
}


loadDataFromLocalStorage();

function toggleTheme() {
    const element = document.body;
    element.dataset.bsTheme = element.dataset.bsTheme === 'light' ? 'dark' : 'light';
}
