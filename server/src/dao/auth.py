import psycopg2
import uuid
import datetime

from ..type.exception import AlreadyExistExeption

class AuthDAO:
    def __init__(self, connection):
        self.connection = connection
        self.query = {
            "authentication": "SELECT user_id, create_date FROM active_token WHERE token='{0}'",
            "login": "SELECT user_master.id, user_master.name, user_master.image, user_master.email FROM user_auth INNER JOIN user_master ON user_auth.id = user_master.id WHERE user_auth.id='{0}' AND user_auth.password='{1}'",
            "create_token": "INSERT INTO active_token (token, user_id, create_date) VALUES ('{0}', '{1}', '{2}');",
            "delete_token": "DELETE FROM active_token WHERE token = '{0}';",
            "user_id_count":"SELECT count(*) as count FROM user_master WHERE id = '{0}';",
            "register_user_master":"INSERT INTO user_master (id, name, image, email) values ('{0}', '{1}', '{2}', '{3}');",
            "register_auth_info":"INSERT INTO user_auth (id, password) values ('{0}', '{1}');"
        }

    def authentication(self, token):
        with self.connection.cursor() as cur:
            query = self.query["authentication"].format(token)
            cur.execute(query)
            res = cur.fetchone()
        self.connection.commit()
        if res is None:
            return None
        return {"user_id": res[0], "create_date": res[1]}

    def login(self, id, password):
        with self.connection.cursor() as cur:
            get_user_query = self.query["login"].format(id, password)
            cur.execute(get_user_query)
            user_info = cur.fetchone()
            if user_info is None:
                self.connection.commit()
                return None
            token = str(uuid.uuid4())
            datetime_now = datetime.datetime.now()
            set_token_query = self.query["create_token"].format(token, user_info[0], datetime_now)
            cur.execute(set_token_query)
        self.connection.commit()
        return {"user_info": user_info, "token": token}

    def logout(self, token):
        with self.connection.cursor() as cur:
            query = self.query["delete_token"].format(token)
            cur.execute(query)
        self.connection.commit()

    def register(self, user_info):
        with self.connection.cursor() as cur:
            user_id_count_query = self.query["user_id_count"].format(user_info.id)
            cur.execute(user_id_count_query)
            user_id_count = cur.fetchone()[0]
            if user_id_count > 0:
                raise AlreadyExistExeption(f"ユーザID: '{user_info.id}'は既に使用されています。")
            register_user_master_query = self.query["register_user_master"].format(user_info.id, user_info.name, user_info.image, user_info.email)
            cur.execute(register_user_master_query)
            register_auth_info_query = self.query["register_auth_info"].format(user_info.id, user_info.password);
            cur.execute(register_auth_info_query)
        self.connection.commit()
