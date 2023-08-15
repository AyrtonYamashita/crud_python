import pandas as pd
import PySimpleGUI as pg
import pyperclip as pyper

file_database = pd.read_excel('DATABASE.xlsx')
dataframe = pd.DataFrame(file_database)
pg.theme('DarkBlue')
layout_search = [
    [pg.Text('Digite um e-mail para busca: '),
     pg.Push(), pg.InputText(key='email'), pg.Button('Buscar', key='search_email')],
    [pg.Text('Digite uma filial para busca: '),
     pg.Push(), pg.InputText(key='filial'), pg.Button('Buscar', key='search_filial')],
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
        filiais = {'FILIAL': [], 'SETOR': [], 'EMAIL': [], 'SENHA': [], 'CHANGELOG': []}
        busca_filial = dataframe.loc[dataframe["FILIAL"] == valor["filial"]]
        for i in busca_filial.index:
            filiais['FILIAL'].append(dataframe.loc[[i], ["FILIAL"]])
            filiais['SETOR'].append(dataframe.loc[[i], ["SETOR"]])
            filiais['EMAIL'].append(dataframe.loc[[i], ["EMAIL"]])
            filiais['SENHA'].append(dataframe.loc[[i], ["SENHA"]])
            filiais['CHANGELOG'].append(dataframe.loc[[i], ["CHANGELOG"]])
        pg.popup_scrolled(filiais['EMAIL'], title='Sistema de busca', size=(100, 50))
        break



