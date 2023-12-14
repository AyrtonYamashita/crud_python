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
                    td.id = 'data_key'
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

function copy(){
    var tl_sel = document.getElementById('data_key').innerHTML;
    navigator.clipboard.writeText(tl_sel);
    console.log(tl_sel)
}