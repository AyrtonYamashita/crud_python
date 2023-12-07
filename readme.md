<h1>CRUD com Python</h1>
<p>Este é um projeto particular de estudos utilizado para apresentação de TCC</p>
<p>O princípio do projeto é realizar a migração de um banco de dados feito em Excel
para um banco de dados estruturado utilizando <a href="https://www.postgresql.org/">PostgreSQL</a> e <a href="https://www.postgresql.org/">Python</a>.
Para iniciar a migração começamos instalando o pgAdmin4 responsável por criar e gerenciar o banco inicialmente.

<h2>Criando um banco de dados com pgAdmin4</h2>
<p>Toda configuração de usuário é feita já pelo próprio pgAdmin4.</p>
Após a criação de usuário é necessário criar o banco de dados utilizando o seguinte comando: 

```
CREATE DATABASE emails
```
</p>

<p>Com isso agora é necessário criar a tabela que será alimentada pelos recursos do Excel, para isso utilizamos: <br>

```
CREATE TABLE emails_xyz.emails (
    id SERIAL NOT NULL PRIMARY KEY,
    filial CHAR(3),
    setor VARCHAR(30),
    email VARCHAR(50),
    senha VARCHAR(50),
    changelog DATE)
```

</p>

<h2>Configurando ambiente Python</h2>
<p>Agora que o banco de dados estruturado já está criado com a tabela, iremos começar a preparar o ambiente Python para realizar a integração. Para isso vamos utilizar a biblioteca <code><a href="https://pypi.org/project/psycopg2/">psycopg2</a></code> biblioteca essa que irá garantir a conexão do nosso banco com Python.</p>
<p>Instalamos a biblioteca utilizando o comando <code><i>pip install psycopg2</i></code>, com a biblioteca de comunicação com o banco instalada, agora é necessário instalar a nossa aplicação web responsável por toda interação com o usuário, neste caso será utilizado a biblioteca <code><a href="https://pypi.org/project/Flask/">flask</a></code> biblioteca essa que será responsável por todas nossas rotas de gerenciamento do nosso banco. Para instalar a biblioteca, utilizando o seguinte comando <code><i>pip install Flask</i></code>. Com as bibliotecas devidamente instaladas, é necessário importá-las ao projeto utilizando os seguintes comandos: 

```
import psycopg2
from flask import Flask
```

</p>
<hr>
<h2>Realizando a conexão com o banco de dados no Python</h2>
<p>Agora temos nosso ambiente pronto para o desenvolvimento. Primeiro iremos configurar a nossa conexão com o banco, para assim começar o gerenciamento.</p>

<p>Para realizar a conexão com o banco vamos definir uma função <b><i>get_db()</i></b>, dentro dessa função teremos uma variável com a função de conexão com o nosso banco que possui os seguintes parâmetros:

```
host, database, user, password
```
</p>
<li><code>host</code><br>
Aqui você deve colocar o host do seu banco de dados, no nosso caso para teste colocamos <i>'localhost'</i>.
<li><code>database</code><br>
Aqui você deve colocar o nome do banco de dados criado lá no inicio, no nosso caso criamos um banco com o nome <i>'empresaxyz'</i>
<li><code>user</code><br>
Aqui você deve colocar o nome do usuário cadastrado para acesso no seu banco, também configurado lá no inicio, neste caso usaremos o usuário default <i>'postgres'</i>
<li><code>password</code><br>
Por ultimo colocamos a senha cadastrada para o nosso usuario, neste caso utilizamos <i>'admin'</i>

<p>O resultado dessa função deve nos retornar uma conexão, como resultado final deveremos ter a seguinte configuração:
    
```
def get_db():
    con = psycopg2.connect(
        host='localhost',
        database='empresaxyz',
        user='postgres',
        password='admin'
    )
    return con
```
<h2>Configurando o Flask</h2>
<p>
Para configuração do Flask devemos instanciar a classe Flask passando como argumento um atalho para que o flask entenda aonde deve rodar sua aplicação, para isso utilizamos 
<i>__name__</i>

```
app =  Flask(__name__)
```
Agora definimos a rota inicial da nossa aplicação, essa rota deve nos retornar uma pagina .html configurada no arquivo index.html, este arquivo deve estar na seguinte estrutura <i>seu_projeto/template/index.html</i> para que o flask consiga ler o arquivo.html precisamos importar um recurso de sua biblioteca chamado <b>render_template</b>.

```
from flask import Flask, render_template
```
Para criar uma rota utilizando flask é necessário utilizar o decorador <i>@app.route()</i> dentro deste, devemos colocar a rota que queremos para acessar e seu método respectivo. Nesse caso inicial não iremos utilizar métodos.
A configuração da nossa rota inicial deve ficar da seguinte maneira:

```
@app.route('/')
def default()
    return render_template('index.html')
```
No fim devemos instanciar onde o flask deve iniciar a aplicação web, para isso utilizamos o seguinte comando:

```
if __name__ = '__main__':
    app.run()
```
Caso tenha um dominio ou servidor, deve se colocar a chave 'host=' dentro de app.run() e definir o host da aplicação.
<h2>Alimentando a tabela do banco de dados</h2>
<p>
Agora que temos a função que nos retorna a conexão com o banco de dados, vamos realizar a configuração da rota que permite alimentar nossa tabela utilizando o método <i>POST</i>.<br>

```
@app.route('/add', methods=['POST'])
```
Agora ao acessar essa rota, ele deve executar a função definida para inserir dados na tabela, função essa que iremos colocar como <b><i>post_data()</i></b>. Assim que definida, vamos criar uma variável que receba os dados do json que iremos inserir no corpo do navegador.<br>
Para que isso seja possível, precisamos importar o <i>request</i> da nossa biblioteca Flask:

```
from flask import Flask, render_template, request
```

Agora importado podemos criar a variável que neste projeto iremos chamar de data, para receber os dados json utilizando o método get_json().
Com as informações armazenadas, precisamos inserir no nosso banco, para isso agora vamos chamar a função de conexão criada anteriormente, neste caso vamos chamar de con.<br>
Com a conexão realizada, vamos abrir o cursor para executar scripts no nosso banco utilizando o método cursor() da nossa biblioteca psycopg2.<br>
Agora vamos realizar uma tratativa de erros para evitar que nossa aplicação caia por motivos inesperados. Dentro dessa tratativa iremos executar o script de inserção na tabela, lembrando que para cada dado do nosso json, precisamos utilizar o get('dado').<br>
Por fim após a inserção realizamos um commit e retornamos um json com um status 200 confirmando a inserção, para isso vamos importar agora a função jsonify da biblioteca Flask.

```
from flask import Flask, render_template, request, jsonify
```
Para finalizar a tratativa de erro utilizamos finnaly em Python, neste caso, se houver erros, a conexão com o banco deve ser encerrada com close().<br>
Para finalizar, a função de inserção de dados na tabela ficará da seguinte maneira:
```
@app.route('/add', methods=['POST'])
def post_data():
    data = request.get_json()
    con = get_db()
 dentro do banco.
    cur = con.cursor()
    try:
        cur.execute(f"""INSERT INTO email_xyz.emails (filial, setor, email, senha, changelog) VALUES (
        '{data.get('filial')}',
        '{data.get('setor')}',
        '{data.get('email')}',
        '{data.get('senha')}',
        '{data.get('changelog)}')""")
        con.commit()
        return jsonify({'Status': 'E-mail adicionado com sucesso!'}), 200
    finnaly:
        con.close()
```

Nota-se que no script de inserção, não foi colocado o campo 'id', campo este configurado como SERIAL que significa o auto-incremento, sem necessidade de inclusão.

<h2>Buscando informações no banco</h2>
Agora que nossa tabela está alimentada podemos realizar consultas no banco, para isso vamos configurar uma rota /search seguida de um parâmetro de identificação, parametro este que pode ser qualquer célula da tabela criada, neste caso vamos utilizar como parâmetro de busca o email e filial. Vamos definir este parametro como uma string, ficando assim: <i>/search/<'string:item_id></i>, lembrando que essa rota por sua vez irá utilizar o método <b>GET</b>.<br>
Com a rota criada, agora é hora de desenvolver a função que realiza as consultas, função essa que será chamada de <b><i>get_data(item_id)</i></b> que receberá nosso parâmetro como argumento.<br>
Dentro dessa função realizamos a conexão com o banco chamando a função de conexão igual a anterior, porém agora precisamos realizar algumas operações lógicas para identificar se o que estamos colocando como parâmetro de busca é uma filial ou um e-mail, para isso vamos utilizar um operador de condições <i>if</i>, caso o meu parametro for maior que 3, significa que é um e-mail, mas se for igual a 3 é uma filial.<br>
Após a execução das condicionais é criado uma variável que recebe a captura de todos os dados relacionados a pesquisa no banco <i>fetchall</i>.<br>
Após termos os resultados, precisamos tratar os dados e verificar se não nos retornou uma pesquisa vazia, para isso usamos uma condição onde se o resultado for = 0 significa que não há nada relacionado com meu parâmetro de busca no banco e isso deve me retornar uma mensagem em json informando sobre o erro, caso contrário, esses dados devem ser tratados em json tendo em vista que a função <i>fetchall</i> nos retorna uma tupla e não um dicionário.<br>
Com todos dados tratados, caso exista algo dentro do banco relacionado ao meu parâmetro, o backend deve me retornar todos os dados em json.<br>

<p>
Por fim, nossa rota de busca deve ficar da seguinte maneira:
</p>

```
@app.route('/search/<string:item_id>', methods=['GET'])
def get_data(item_id):
    con = get_db()
    cur = con.cursor()
    if len(item_id) > 3:
        cur.execute(f"SELECT * FROM  email_xyz.emails WHERE email = '{item_id}@empresaxyz.com.br'")
    elif len(item_id) == 3:
        cur.execute(f"SELECT * FROM email_xyz.emails WHERE filial = '{item_id.upper()}')
    item = cur.fetchall()
    if len(item) == 0:
        return jsonify({'Status': Ops, não foi possível encontrar o que procura.}), 404
    else:
        data = {}
        for i in item:
            id, filial, setor, email, senha, changelog = i
            data[id] = {
                'id' = id,
                'filial' = filial,
                'setor' = setor,
                'email' = email,
                'senha' = senha,
                'changelog' = changelog
            }
        return jsonify(data)
```

<h2>Atualizando informações no banco</h2>
Agora já podemos inserir e buscar essas informações, o que podemos fazer agora é atualizar elas caso alguma inserção seja feita de forma incorreta ou até mesmo atualizada periódicamente no caso das senhas que é o que vamos trabalhar para atualizar.<br>
Para isso, agora vamos criar uma rota de /update/<'int:item_id> que dessa vez utilizaremos o método <b><i>PUT</i></b>.<br>
Após criar a rota, precisamos definir a função que será responsável por realizar a atualização das nossas informações, essa função será chamada de <i>update_data(item_id)</i> e receberá nosso parâmetro como argumento. Dentro dessa função será necessário criar uma variável para receber o json inserido pelo navegador e deste json vamos capturar a informação que queremos atualizar, vamos chamar essa variável de 'data'.<br>
Com a variável que recebe o json inserido, nós vamos criar uma variável com a informação que vamos atualizar, no nosso caso a senha, essa variável será chamada de 'new_password'. Em seguida após declarar essas duas variáveis, realizamos a conexão com o banco de dados, abrimos o cursor para execução de scripts e iniciamos uma tratativa de erros para evitar a queda do nosso banco, caso ocorra tudo certo, nos deve retornar um json confirmando a alteração e status 200, se houver alguma falha, a conexão deve ser encerrada.<br>
Por fim a rota de update deve ficar da seguinte maneira:

```
@app.route('/update/<int:item_id>', methods=['PUT'])
def update_data(item_id):
    data = request.get_json()
    new_password = data.get('senha')
    con = get_db()
    cur = con.cursor()
    try:
        cur.execute("UPDATE email_xyz.emails SET senha = %s WHERE id  = %s", (new_password, item_id))
        con.commit()
        return jsonify({'Status': f'Senha do e-mail com id {item_id} atualizada com sucesso!'}), 200
    finnaly:
        con.close()
```

<h2>Removendo informações no banco</h2>
<p>
Para realizar a ultima etapa do nosso crud, iremos configurar a ultima rota responsável por deletar informações da nossa tabela. Rota essa que vamos definir como /delete/<'int:item_id> e vamos utilizar o método <b><i>DELETE</i></b> para trabalhar com essa função.
</p>
<p>
Depois de configurar nossa rota, precisamos definir a função responsável por executar o script no banco, vamos chamar essa função de <i>drop_data(item_id)</i> que irá receber nosso parâmetro como argumento, nessa função vamos realizar a conexão com o banco, iniciar o cursor para executar o script dentro do banco e iniciar uma tratativa de erros para evitar a queda da nossa aplicação.
</p>
<p>
Caso nossa aplicação funcione de forma correta e delete a informação mencionada no parâmetro, deve-se realizar um commit e retornar um json com o status confirmando a execução da tarefa e statuscode 200.
Se por ventura ocorrer um erro, deve-se encerrar a conexão com o banco.
</p>
<p>
O código deverá ficar da seguinte maneira:

```
@app.route('/delete/<int:item_id>', methods=['DELETE'])
def drop_data(item_id):
    con = get_db()
    cur = con.cursor()
    try:
        cur.execute("DELETE FROM email_xyz.emails WHERE id = %s", (item_id))
        con.commit()
        return jsonify({'Status': f'Email com id {item_id} deletado com sucesso!}),200
    finnaly:
        con.close()
```

<h2>Referências Bibliográficas</h2>
<a href="https://www.python.org/">Python</a>
<a href="https://www.postgresql.org/">PostgreSQL</a>
<a href="https://www.psycopg.org/docs/">Documentação biblioteca psycopg2</a>
<a href="https://flask.palletsprojects.com/en/3.0.x/quickstart/#a-minimal-application">Documentçaão biblioteca Flask</a>
