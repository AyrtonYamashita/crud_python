import pandas as pd
import PySimpleGUI as pg

file_database = pd.read_excel('DATABASE.xlsx')
dataframe = pd.DataFrame(file_database)
pg.theme('DarkBlue')
layout_search = [
    [pg.Text('Digite um e-mail para busca: '),
     pg.Push(), pg.InputText(key='email'), pg.Button('Buscar', key='search_email')],
    [pg.Text('Digite uma filial para busca: '),
     pg.Push(), pg.InputText(key='filial', default_text='CUIABÁ'), pg.Button('Buscar', key='search_filial')],
]


janela = pg.Window('Sistema de busca', layout_search)
event, valor = janela.read()
while True:
    if event == "search_email":
        busca_email = dataframe.loc[dataframe["EMAIL"] == valor["email"]]
        janela.close()
        if len(busca_email.index) == 0:
            pg.PopupOK(f'O email "{valor["email"]}" não existe!', title="Sistema de busca")
            break
        else:
            pg.popup_scrolled(f"""
                                        EMAIL ENCONTRADO!
            Filial: {dataframe.at[busca_email.index[0], "FILIAL"]}
            Setor: {dataframe.at[busca_email.index[0], "SETOR"]}
            Email: {dataframe.at[busca_email.index[0], "EMAIL"]}
            Senha: {dataframe.at[busca_email.index[0], "SENHA"]}
            Changelog: {dataframe.at[busca_email.index[0], "CHANGELOG"]}
            """, title="Sistema de busca")
            break
    elif event == "search_filial":
        janela.close()
        list_result = []
        busca_filial = dataframe.loc[dataframe["FILIAL"] == valor["filial"]]
        for i in busca_filial.index:
            list_result.append({'FILIAL': dataframe.at[i, 'FILIAL'],
                                'SETOR': dataframe.at[i, 'SETOR'],
                                'EMAIL': dataframe.at[i, 'EMAIL'],
                                'SENHA': dataframe.at[i, 'SENHA'],
                                'CHANGELOG': dataframe.at[i, 'CHANGELOG']})
        for index, item in enumerate(list_result):
            print(f'FILIAL: {list_result[index]["FILIAL"]},'
                  f'SETOR: {list_result[index]["SETOR"]},'
                  f'EMAIL: {list_result[index]["EMAIL"]},'
                  f'SENHA: {list_result[index]["SENHA"]},'
                  f'CHANGELOG: {list_result[index]["CHANGELOG"]}')
        break



