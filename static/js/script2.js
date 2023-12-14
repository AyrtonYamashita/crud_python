function response(){
    var item_id = document.getElementById('item_id').value;
    if (item_id === ''){
        alert("Você precisa digitar uma filial ou e-mail para buscar.");
    }else{
        fetch('/search/' + item_id)
    .then(response => response.json())
    .then(data => {
        var exist_table = document.querySelector('table');
        if (exist_table){
            document.body.removeChild(exist_table);
        }
        if (data.erro){
            var report = document.createElement('table');
            report.textContent = data.erro;
            document.body.appendChild(report)
        }else{
            let newTable = document.createElement('table');
            let head = document.createElement('thead');
            let headRow = document.createElement('tr');
            newTable.className = 'minimalistTable'
            let ids = Object.keys(data);
            let props = Object.keys(data[ids[0]]);
            for(let prop of props){
                let th = document.createElement('th');
                th.textContent = prop;
                headRow.appendChild(th);
            }
            head.appendChild(headRow);
            newTable.appendChild(head);
            for (id of ids){
                let row = document.createElement('tr');
                for (let prop in data[id]){
                    let cell = document.createElement('td');
                    cell.textContent = data[id][prop];
                    cell.id = id + '-' + prop;
                    cell.addEventListener('click', function(){
                        copyToClip(cell.textContent);
                    });
                    row.appendChild(cell);
                }
                newTable.appendChild(row);
            }
            document.body.appendChild(newTable);
        }

    });
    }
    
}

function add_email(){
    var existForm = document.querySelector('form');
    if(existForm){
        document.body.removeChild(existForm);
    }
    var p = document.createElement('p');
    p.textContent = 'Adicione um e-mail preenchendo os seguintes dados:'
    var form = document.createElement('form');
    form.setAttribute("method", "post");
    form.setAttribute("action", "/search");
    var email = document.createElement('input');
    email.setAttribute("type", "text");
    email.setAttribute("name", "email");
    email.setAttribute("placeholder", "Email");
    var filial = document.createElement('input');
    filial.setAttribute("type", "text");
    filial.setAttribute("name", "filial");
    filial.setAttribute("placeholder", "Filial");
    var setor = document.createElement('input');
    setor.setAttribute("type", "text");
    setor.setAttribute("name", "setor");
    setor.setAttribute("placeholder", "Setor");
    var senha = document.createElement('input');
    senha.setAttribute("type", "password");
    senha.setAttribute("name", "senha");
    senha.setAttribute("placeholder", "Senha");
    var changelog = document.createElement('input');
    changelog.setAttribute("type", "text");
    changelog.setAttribute("name", "changelog");
    changelog.setAttribute("placeholder", "Changelog");
    var submit = document.createElement('input');
    submit.setAttribute("type", "submit");
    submit.setAttribute("id", "send");
    submit.setAttribute("value", "Adicionar");
    form.appendChild(p);
    form.appendChild(filial);
    form.appendChild(email);
    form.appendChild(senha);
    form.appendChild(setor);
    form.appendChild(changelog);
    form.appendChild(submit);
    document.body.appendChild(form);
    document.body.querySelector('form').addEventListener('submit', function(event){
        event.preventDefault()
        let inputs = this.elements
        let obj = {}
        for(let i = 0; i < inputs.length ; i++){
            if (inputs[i].tagName.toLowerCase() === 'input'){
                let key = inputs[i].name
                let value = inputs[i].value
                obj[key] = value
            }
        }
        let json = JSON.stringify(obj)
        fetch('/search', {method: "POST", headers: {
            'Content-Type': 'application/json',
        },
    body: json,}).then(response => response.json()).then(data => {
        console.log("Sucesso:", data);
        var form_open = document.body.querySelector('form')
        document.body.removeChild(form_open)
    }).catch((error) => {console.error('Erro:', error);})
    })

}

function copyToClip(item_id){
    navigator.clipboard.writeText(item_id);
}