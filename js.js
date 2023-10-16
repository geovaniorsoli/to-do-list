function addTitle() {
    const titleInput = document.getElementById('titleInput');
    const titleSelect = document.getElementById('titleSelect');

    if (titleInput.value.trim()) {
        // Adicionar opção ao <select>
        const option = document.createElement('option');
        option.value = titleInput.value;
        option.textContent = titleInput.value;
        titleSelect.appendChild(option);

        // Criar div para o título e adicionar ao container
        const titleDiv = document.createElement('div');
        titleDiv.className = 'mt-4';
        titleDiv.id = titleInput.value;

        const h3 = document.createElement('h3');
        h3.textContent = titleInput.value;
        titleDiv.appendChild(h3);

        document.getElementById('taskContainer').appendChild(titleDiv);
        titleInput.value = '';
    }
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const titleSelect = document.getElementById('titleSelect');
    const selectedTitle = titleSelect.options[titleSelect.selectedIndex].value;
    const titleDiv = document.getElementById(selectedTitle);

    if (!taskInput.value.trim()) {
        return; // Se o valor for vazio ou apenas espaços, não faz nada.
    }

    // Div para conter a tabela e botões
    const taskDiv = document.createElement('div');
    taskDiv.className = 'd-flex align-items-start mb-3';

    // Tabela para conter a tarefa
    const taskTable = document.createElement('table');
    taskTable.className = 'table table-bordered mr-3 table-rounded';
    const tbody = document.createElement('tbody');
    const row = tbody.insertRow();
    const cell = row.insertCell();
    cell.textContent = taskInput.value;
    taskTable.appendChild(tbody);
    taskDiv.appendChild(taskTable);

    // Botão "Feito" com ícone
    const markAsDoneButton = document.createElement('button');
    markAsDoneButton.className = 'btn btn-outline-success mr-2 botao';
    markAsDoneButton.onclick = function() {
        cell.style.textDecoration = 'line-through';
        markAsDoneButton.disabled = true;
    };
    const markAsDoneIcon = document.createElement('i');
    markAsDoneIcon.className = 'fas fa-check-circle';
    markAsDoneButton.appendChild(markAsDoneIcon);
    taskDiv.appendChild(markAsDoneButton);

    // Botão "Excluir" com ícone
    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-outline-danger botao';
    removeButton.onclick = function() {
        titleDiv.removeChild(taskDiv);
    };
    const removeIcon = document.createElement('i');
    removeIcon.className = 'fas fa-trash';
    removeButton.appendChild(removeIcon);
    taskDiv.appendChild(removeButton);

    titleDiv.appendChild(taskDiv);
    taskInput.value = ''; // Limpar o campo de entrada

    titleDiv.appendChild(taskDiv);
    taskInput.value = ''; // Limpar o campo de entrada

    $('#taskModal').modal('hide'); // Fecha o modal
}

$('#taskModal').on('hidden.bs.modal', function () {
    document.getElementById('taskInput').value = ''; // Limpa o campo de entrada
})

// Tema
function toggleTheme() {
    const element = document.body;
    element.dataset.bsTheme = element.dataset.bsTheme === 'light' ? 'dark' : 'light';
}

