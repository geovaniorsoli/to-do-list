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


//salvar local
function attachEventListeners() {
    document.getElementById('taskContainer').addEventListener('click', function(event) {
        if (event.target.classList.contains('fas') || event.target.classList.contains('botao')) {
            const button = event.target.closest('button');
            const taskDiv = button.closest('.d-flex');
            if (button.classList.contains('btn-outline-danger')) {
                taskDiv.remove(); 
            } else if (button.classList.contains('btn-outline-success')) {
                taskDiv.querySelector('table').style.textDecoration = 'line-through'; // Marca como concluído.
                button.disabled = true;
            }
            saveTasksAndTitles(); 
        }
    });
}
function reattachEvents() {
    document.querySelectorAll('.taskContainer').forEach(container => {
        container.addEventListener('click', function(event) {
            if (event.target.classList.contains('btn-remove-task')) {
                event.target.closest('.taskDiv').remove();
                saveTasksAndTitles(); 
            } else if (event.target.classList.contains('btn-mark-task')) {
                const taskDiv = event.target.closest('.taskDiv');
                taskDiv.querySelector('.taskContent').style.textDecoration = 'line-through';
                event.target.disabled = true;
                saveTasksAndTitles(); 
            }
        });
    });
}

//criar titulo
function addTitle() {
    const titleInput = document.getElementById('titleInput');
    const titleSelect = document.getElementById('titleSelect');

    const option = document.createElement('option');
    option.value = titleInput.value;
    option.textContent = titleInput.value;
    titleSelect.appendChild(option);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'row align-items-center d-flex';

    
    const normalizedTitleValue = titleInput.value.replace(/\s+/g, '-');
    titleDiv.id = `title-${normalizedTitleValue}`;

    const h3 = document.createElement('h3');
    h3.textContent = titleInput.value;
    titleDiv.appendChild(h3);

    // Criar o botão de deletar com ícone
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm ';
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
    deleteButton.onclick = function() {
        deleteTitle(normalizedTitleValue); 
    };
    titleDiv.appendChild(deleteButton);

    document.getElementById('taskContainer').appendChild(titleDiv);

    titleInput.value = '';
    saveTasksAndTitles();
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
    if (titleDiv) {
        titleDiv.remove();
    }

    saveTasksAndTitles();
}

//validacao 
function validateAndAddTitle() {
    const titleInput = document.getElementById('titleInput');
    const titleInputError = document.getElementById('titleInputError');

    // Limpando erros anteriores
    titleInputError.style.display = 'none';

    // Verificando se o input está vazio
    if (titleInput.value.trim() === '') {
        titleInputError.style.display = 'block';
        return;
    }

    // Se passar na validação, adicione o título e feche o modal
    addTitle(); // esta é a sua função que adiciona o título
    $('#titleModal').modal('hide');

    $('#titleModal').on('hidden.bs.modal', function () {
        // Limpar o campo de entrada e a mensagem de erro quando o modal for fechado
        document.getElementById('titleInput').value = '';
        document.getElementById('titleInputError').style.display = 'none';
    })
    
    document.getElementById('taskContainer').addEventListener('click', function(event) {
        if (event.target.matches('.btn-danger')) { // Se o botão de deletar foi clicado.
            const titleContainer = event.target.closest('.title-container');
            if (titleContainer) {
                const titleName = titleContainer.querySelector('h3').textContent;
                deleteTitle(titleName);
            }
        }
    });
    
}

// Função para deletar um título
function deleteTitle(titleName) {
    // Remover do select
    
    const titleSelect = document.getElementById('titleSelect');
    for (let i = 0; i < titleSelect.options.length; i++) {
        if (titleSelect.options[i].value === titleName) {
            titleSelect.remove(i);
            break;
        }
    }

    const titleDiv = document.getElementById(`title-${titleName.replace(/\s+/g, '-')}`);
    if (titleDiv) {
        titleDiv.remove();
    }

    saveTasksAndTitles();
}

//add tarefas
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const titleSelect = document.getElementById('titleSelect');
    const selectedTitle = titleSelect.options[titleSelect.selectedIndex].value;

    const normalizedTitleValue = selectedTitle.replace(/\s+/g, '-');

    const titleDiv = document.getElementById(`title-${normalizedTitleValue}`);

    if (taskInput.value.trim() && titleDiv) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'd-flex align-items-start mb-3 taskDiv';

        const taskContent = document.createElement('div');
        taskContent.className = 'taskContent';
        taskContent.textContent = taskInput.value;

        const markAsDoneButton = document.createElement('button');
        markAsDoneButton.className = 'btn btn-outline-success mr-2 botao btn-mark-task';
        markAsDoneButton.innerHTML = '<i class="fas fa-check-circle"></i>';

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-outline-danger botao btn-remove-task';
        removeButton.innerHTML = '<i class="fas fa-trash"></i>';

        taskDiv.appendChild(taskContent);
        taskDiv.appendChild(markAsDoneButton);
        taskDiv.appendChild(removeButton);

        titleDiv.appendChild(taskDiv);

        taskInput.value = '';
        $('#taskModal').modal('hide');

        saveTasksAndTitles();
    } else if (!titleDiv) {
        // Caso não encontre o título, você pode querer alertar o usuário aqui.
        console.error("Título não encontrado: ", selectedTitle);
    }
}

// Salvar dados
function saveTasksAndTitles() {
    const tasksContainer = document.getElementById('taskContainer');
    localStorage.setItem('tasksAndTitles', tasksContainer.innerHTML);
}

function loadTasksAndTitles() {
    const tasksAndTitles = localStorage.getItem('tasksAndTitles');
    if(tasksAndTitles) {
        document.getElementById('taskContainer').innerHTML = tasksAndTitles;
    }
}

// Evento para o modal
$('#taskModal').on('hidden.bs.modal', function () {
    document.getElementById('taskInput').value = '';
});


//apagartudo 
function clearAllData() {
    localStorage.clear();
    document.getElementById('taskContainer').innerHTML = '';
    
}

document.getElementById('clearDataButton').addEventListener('click', function() {
    bootstrapConfirm('Quer apagar tudo?', function(result) {
        if (result) {
            clearAllData();
        }
    });
});
function bootstrapConfirm(message, callback) {
    const confirmModal = `
    <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmModalLabel">Confirmação</h5>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"><i class="fas fa-times"></i></button>
                    
                </div>
                <div class="modal-body">
                    ${message}
                </div>
                <div class="modal-footer">
                    
                    <button type="button" class="btn btn-success" id="confirmYes">Sim</button>
                </div>
            </div>
        </div>
    </div>`;

   
    document.body.insertAdjacentHTML('beforeend', confirmModal);

    // Mostra o modal
    const modalElement = new bootstrap.Modal(document.getElementById('confirmModal'));
    modalElement.show();

    document.getElementById('confirmYes').addEventListener('click', function() {
        callback(true);
        modalElement.hide(); 
    });

    document.getElementById('confirmModal').addEventListener('hidden.bs.modal', function () {
        this.remove(); 
        document.body.classList.remove('modal-open'); 
        document.querySelector('.modal-backdrop').remove(); 
        callback(false);
    });
}

// Tema
function toggleTheme() {
    const element = document.body;
    element.dataset.bsTheme = element.dataset.bsTheme === 'light' ? 'dark' : 'light';
}
