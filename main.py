import psycopg2
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)


@app.route('/')
def hello():
    return render_template('index.html')


def get_db():
    con = psycopg2.connect(
        host='localhost',
        database='alt',
        user='postgres',
        password='admin'
    )
    return con


# Converte e-mail em id
def convert(id_email):
    con = get_db()
    cur = con.cursor()
    cur.execute(f"SELECT * FROM email_alt.emails WHERE id = {id_email}")
    id_filial, filial, setor, email, senha, changelog = cur.fetchone()
    return email


# Busca os emails no banco de dados
@app.route('/search/<string:item_id>', methods=['GET'])
def get_data(item_id):
    con = get_db()
    cur = con.cursor()
    if len(item_id) > 3:
        cur.execute(f"SELECT * FROM email_alt.emails WHERE email = '{item_id}@altbrasil.com.br'")
    elif len(item_id) == 3:
        cur.execute(f"SELECT * FROM email_alt.emails WHERE filial = '{item_id.upper()}'")
    item = cur.fetchall()
    if len(item) == 0:
        return jsonify({'erro': 'Item não encontrado'})
    else:
        data = {}
        for i in item:
            id_filial, filial, setor, email, senha, changelog = i
            data[id_filial] = {
                "id": id_filial,
                "filial": filial,
                "setor": setor,
                "email": email,
                "senha": senha,
                "changelog": changelog
            }
        return jsonify(data)


# Busca os emails no banco de dados
@app.route('/id/<string:item_id>', methods=['GET'])
def get_item(item_id):
    con = get_db()
    cur = con.cursor()
    cur.execute(f"SELECT * FROM email_alt.emails WHERE id = '{item_id}'")
    item = cur.fetchall()
    if len(item) == 0:
        return jsonify({'erro': 'Item não encontrado'})
    else:
        data = {}
        for i in item:
            id_filial, filial, setor, email, senha, changelog = i
            data[id_filial] = {
                "id": id_filial,
                "filial": filial,
                "setor": setor,
                "email": email,
                "senha": senha,
                "changelog": changelog
            }
        return jsonify(data)


# Adiciona um e-mail no banco de dados
@app.route('/search', methods=['POST'])
def post_data():
    data = request.get_json()
    con = get_db()
    cur = con.cursor()
    try:
        cur.execute("INSERT INTO email_alt.emails (filial, setor, email, senha, changelog) VALUES (%s, %s, %s, %s, %s)"
                    , (data.get('filial'),data.get('setor'),data.get('email'),data.get('senha'),data.get('changelog')))
        con.commit()
        return jsonify({'Status': 'E-mail adicionado com sucesso!'})
    finally:
        con.close()


# Atualiza os dados de um e-mail no banco de dados
@app.route('/update/<int:item_id>', methods=['PUT'])
def update_data(item_id):
    data = request.get_json()
    con = get_db()
    cur = con.cursor()
    try:
        for key, value in data.items():
            cur.execute(f"UPDATE email_alt.emails SET {key} = %s WHERE id = %s",(value, item_id))
        con.commit()
        return jsonify(data), 200
    finally:
        con.close()


# Remove um e-mail do banco de dados.
@app.route('/delete/<int:item_id>', methods=['DELETE'])
def drop_data(item_id):
    con = get_db()
    cur = con.cursor()
    try:
        cur.execute(f"DELETE FROM email_alt.emails WHERE id = '{item_id}'")
        con.commit()
        return jsonify({'Status': f'O endereço de e-mail com ID {item_id} foi deletado com sucesso!'}), 200
    finally:
        con.close()


if __name__ == '__main__':
    app.run()
