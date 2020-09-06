import psycopg2
import uuid
import datetime

from ..type.exception import AlreadyExistExeption

class AuthDAO:
    def __init__(self, connection):
        self.connection = connection
        self.query = {
            "authentication": "SELECT user_id, create_date FROM active_token WHERE token=%s",
            "login": "SELECT user_master.id, user_master.name, user_master.image, user_master.email FROM user_auth INNER JOIN user_master ON user_auth.id = user_master.id WHERE user_auth.id=%s AND user_auth.password=%s",
            "create_token": "INSERT INTO active_token (token, user_id, create_date) VALUES (%s, %s, %s);",
            "delete_token": "DELETE FROM active_token WHERE token = %s;",
            "user_id_count":"SELECT count(*) as count FROM user_master WHERE id = %s;",
            "register_user_master":"INSERT INTO user_master (id, name, image, email) values (%s, %s, %s, %s);",
            "register_auth_info":"INSERT INTO user_auth (id, password) values (%s, %s);"
        }

    def authentication(self, token):
        with self.connection.cursor() as cur:
            query = self.query["authentication"]
            cur.execute(query, (token,))
            res = cur.fetchone()
        self.connection.commit()
        if res is None:
            return None
        return {"user_id": res[0], "create_date": res[1]}

    def login(self, id, password):
        with self.connection.cursor() as cur:
            get_user_query = self.query["login"]
            cur.execute(get_user_query, (id, password))
            user_info = cur.fetchone()
            if user_info is None:
                self.connection.commit()
                return None
            token = str(uuid.uuid4())
            datetime_now = datetime.datetime.now()
            set_token_query = self.query["create_token"]
            cur.execute(set_token_query, (token, user_info[0], datetime_now))
        self.connection.commit()
        return {"user_info": user_info, "token": token}

    def logout(self, token):
        with self.connection.cursor() as cur:
            query = self.query["delete_token"]
            cur.execute(query, (token,))
        self.connection.commit()

    def register(self, user_info):
        with self.connection.cursor() as cur:
            user_id_count_query = self.query["user_id_count"]
            cur.execute(user_id_count_query, (user_info.id,))
            user_id_count = cur.fetchone()[0]
            if user_id_count > 0:
                raise AlreadyExistExeption(f"ユーザID: '{user_info.id}'は既に使用されています。")
            register_user_master_query = self.query["register_user_master"]
            cur.execute(register_user_master_query, (user_info.id, user_info.name, user_info.image, user_info.email))
            register_auth_info_query = self.query["register_auth_info"]
            cur.execute(register_auth_info_query, (user_info.id, user_info.password))
        self.connection.commit()
