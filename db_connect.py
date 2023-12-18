import psycopg2

class Connect:
    def __init__(self, host, database, user, password):
        self.host = host
        self.database = database
        self.user = user
        self.password = password
    def connect(self):
        con = psycopg2.connect(
            host = self.host,
            database = self.database,
            user = self.user,
            password = self.password
        )
        return con