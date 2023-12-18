import json
from db_connect import Connect

database = Connect(host='localhost', database='alt', user='postgres', password='admin')

class Email(object):
    def __init__(self,
                 id=None,
                 setor=None,
                 filial=None,
                 email=None,
                 senha=None,
                 changelog=None):
        self.id = id
        self.setor = setor
        self.filial = filial
        self.email = email
        self.senha = senha
        self.changelog = changelog
    def name(self):
        return ("%s %s %s %s %s %s" % (self.id,
                                       self.setor,
                                       self.filial,
                                       self.email,
                                       self.senha,
                                       self.changelog))
    @classmethod
    def getAll(self):
        con = database.connect()
        cur = con.cursor()
        cur.execute('SELECT * FROM email_alt.emails')
        rows = cur.fetchall()
        result = []
        for row in rows:
            email = Email(row[0], row[1], row[2], row[3], row[4], row[5])
            result.append(email)
        cur.close()
        con.close()
        return result
        