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
            report.id = 'error_id'
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
                    cell.id = id;
                    cell.addEventListener('click', function(){
                        form_response(cell.id);
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
    var existTable = document.querySelector('table');
    if(existForm){
        document.body.removeChild(existForm);
    }
    if(existTable){
        document.body.removeChild(existTable);
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
    email.setAttribute("required", "True");
    email.setAttribute("id", "email");
    var filial = document.createElement('input');
    filial.setAttribute("type", "text");
    filial.setAttribute("name", "filial");
    filial.setAttribute("placeholder", "Filial");
    filial.setAttribute("required", "True");
    filial.setAttribute("maxLength", "3");
    var setor = document.createElement('input');
    setor.setAttribute("type", "text");
    setor.setAttribute("name", "setor");
    setor.setAttribute("placeholder", "Setor");
    setor.setAttribute("required", "True");
    var senha = document.createElement('input');
    senha.setAttribute("type", "password");
    senha.setAttribute("name", "senha");
    senha.setAttribute("placeholder", "Senha");
    senha.setAttribute("required", "True");
    var changelog = document.createElement('input');
    changelog.setAttribute("type", "text");
    changelog.setAttribute("name", "changelog");
    changelog.setAttribute("value", formatDate(today, 'yy-mm-dd'));
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
        console.log("Sucesso:");
        window.history.go()
    }).catch((error) => {console.error('Erro:', error);})
    })

}

function form_response(cell_id){
    var exist_form = document.querySelector('form');
    var exist_table = document.querySelector('table');
    if (exist_form){
        document.body.removeChild(exist_form);
    }
    if (exist_table){
        document.body.removeChild(exist_table);
    }
    let forms = document.createElement('form');
    let back_btn = document.createElement('button');
    let drop_btn = document.createElement('button');
    let edit_btn = document.createElement('button');
    let confirm_btn = document.createElement('button');
    back_btn.setAttribute('type', 'button');
    back_btn.textContent = 'Voltar';
    back_btn.setAttribute('id', 'back_btn');
    drop_btn.setAttribute('type', 'submit');
    drop_btn.textContent = 'Excluir';
    drop_btn.setAttribute('id', 'drop_btn');
    edit_btn.setAttribute('type', 'button');
    edit_btn.textContent = 'Editar';
    edit_btn.setAttribute('id', 'edit_btn');
    confirm_btn.setAttribute('type', 'submit');
    confirm_btn.setAttribute('value', 'Confirmar');
    confirm_btn.setAttribute('id', 'confirm_btn');
    confirm_btn.textContent = 'Confirmar';
    confirm_btn.setAttribute('hidden', '');
    fetch('/id/' + cell_id)
    .then(response => response.json())
    .then(data => {
        let ids = Object.keys(data);
        for (id of ids){
            for (let property in data[id]){
                edit_btn.dataset.id = id;
                drop_btn.dataset.id = id;
                let value = document.createElement('input');
                let title = document.createElement('div');
                title.setAttribute('id', 'title_id');
                title.textContent = property;
                value.setAttribute('id', id);
                value.setAttribute('className', 'cls_value');
                value.setAttribute('value', data[id][property]);
                value.setAttribute('name', property);
                value.disabled = true;
                forms.appendChild(title);
                forms.appendChild(value);
                title.addEventListener('click', function(){
                    copyToClip(value.value);
                })
            }
        }
    })
    drop_btn.addEventListener('click', function(event){
        event.preventDefault();
        let item = this.dataset.id;
        remove_email(item);
    })
    back_btn.addEventListener('click', function(event){
        event.preventDefault();
        window.history.go();
    })
    edit_btn.addEventListener('click', function(event){
        event.preventDefault();
        var inputs = document.querySelectorAll('input');
        inputs.forEach(function(input){
            input.disabled = false;
        });
        edit_btn.setAttribute('hidden', '');
        confirm_btn.removeAttribute('hidden');
    })
    forms.appendChild(back_btn);
    forms.appendChild(edit_btn);
    forms.appendChild(drop_btn);
    forms.appendChild(confirm_btn);
    document.body.appendChild(forms);
    document.body.querySelector('form').addEventListener('submit', function(event){
        event.preventDefault();
        let values = this.elements
        let obj = {}
        for (let i = 0; i < values.length; i++){
            if (values[i].tagName.toLowerCase() === 'input'){
                let key = values[i].name
                let value = values[i].value
                obj[key] = value
            }
        }
        let json = JSON.stringify(obj)
        fetch('/update/' + cell_id, {method: "PUT", headers:{
            'Content-Type': 'application/json',
        },body: json,})
        .then(response => response.json())
        .then(data => {
            var inputs = document.querySelectorAll('input');
            inputs.forEach(function(input){
            input.disabled = true;
        });
            edit_btn.removeAttribute('hidden');
            confirm_btn.setAttribute('hidden', '');
        })
        .catch((error) => {console.log(error);})
    })
}


function remove_email(item_id){
    var result = confirm('Deseja mesmo remover este e-mail? ');
    if (result){
        fetch('/delete/' + item_id, {method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            console.log('E-mail removido!')
            alert('E-mail removido com sucesso!')
            window.history.go()})
    }
}

function edit_email(item_id){
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
    fetch('/update/' + item_id, {method: 'PUT', headers:{
        'Content-Type': 'application/json',
    },body: json})
    .then(response => response.json()
    .then(data => console.log('E-mail atualizado com sucesso!'))
    .catch((error) => {console.log(error)}))
}

function copyToClip(item_id){
    navigator.clipboard.writeText(item_id);
    console.log("O item " + item_id + " foi copiado com sucesso!");
}

const today = new Date();
function formatDate(date, format){
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        yy: date.getFullYear()
    };
    return format.replace(/yy|mm|dd/gi, matched => map[matched])
}