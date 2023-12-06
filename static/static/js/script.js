function search() {
    var item_id = document.getElementById('item_id').value;
    fetch('/search/' + item_id)
        .then(response => response.json())
        .then(data => {
            // Remove a tabela existente, se houver
            var existingTable = document.querySelector('table');
            if (existingTable) {
                document.body.removeChild(existingTable);
            }

            var table = document.createElement('table');
            table.className = 'minimalistTable'
            var thead = document.createElement('thead');
            var tbody = document.createElement('tbody');

            // Cria o cabeçalho da tabela
            var headerRow = document.createElement('tr');
            Object.keys(data[Object.keys(data)[0]]).forEach(function(key) {
                var th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Cria o corpo da tabela
            Object.keys(data).forEach(function(key) {
                var tr = document.createElement('tr');
                Object.keys(data[key]).forEach(function(subKey) {
                    var td = document.createElement('td');
                    td.textContent = data[key][subKey];
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            // Adiciona a tabela ao corpo do documento
            document.body.appendChild(table);
        })
        .catch(error => console.error('Error:', error))
}

function search() {
    var item_id = document.getElementById('item_id').value;
    fetch('/search/' + item_id)
        .then(response => response.json())
        .then(data => {
            // Remove a tabela existente, se houver
            var existingTable = document.querySelector('table');
            if (existingTable) {
                document.body.removeChild(existingTable);
            }

            var table = document.createElement('table');
            table.className = 'minimalistTable'; // Adiciona uma classe à tabela para estilização

            var thead = document.createElement('thead');
            var tbody = document.createElement('tbody');

            // Cria o cabeçalho da tabela
            var headerRow = document.createElement('tr');
            Object.keys(data[Object.keys(data)[0]]).forEach(function(key) {
                var th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Cria o corpo da tabela
            Object.keys(data).forEach(function(key) {
                var tr = document.createElement('tr');
                tr.setAttribute('data-id', key);
                Object.keys(data[key]).forEach(function(subKey) {
                    var td = document.createElement('td');
                    td.textContent = data[key][subKey];
                    td.onclick = function() {
                        editCell(this);
                    };
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            // Adiciona a tabela ao corpo do documento
            document.body.appendChild(table);
        })
        .catch(error => console.error('Error:', error))
}
// Função para entrar no modo de edição
function editCell(td) {
    var text = td.textContent;
    td.textContent = '';
    var input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    td.appendChild(input);
    var saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.onclick = function() {
        saveCell(input, td);
    };
    td.appendChild(saveButton);
    input.focus();
    button.style.display = 'none';

}

// Função para salvar uma célula
function saveCell(input, td) {
    var newValue = input.value;
    var email = td.parentNode.getAttribute('data-id'); // Supondo que o e-mail esteja armazenado como um atributo data no elemento da linha
    td.textContent = newValue;

    // Faça uma solicitação PUT para a rota de atualização com o novo valor
    fetch('/update/' + email, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senha: newValue }), // Substitua 'senha' pela chave apropriada
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
