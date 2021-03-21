import psycopg2
from ..type import base as type

class UserDAO:
    def __init__(self):
        self.query = {
            "select_by_ueer_id": "SELECT id, name, image, email FROM user_master WHERE id=%s",
            "update_master": "UPDATE user_master SET id=%s, name=%s, image=%s, email=%s WHERE id=%s;",
            "get_simple_user_info": "SELECT id, name, image FROM user_master where id IN %(ids)s;"
        }

    def get_user_detail(self, cur, user_id):
        query = self.query["select_by_ueer_id"]
        cur.execute(query, (user_id,))
        res = cur.fetchone()
        return res

    def update_user_detail(self, cur, user_info):
        query = self.query["update_master"]
        cur.execute(query, (user_info.id, user_info.name, user_info.image, user_info.email, user_info.id))

    def get_simple_user_info(self, cur, ids):
        print(ids)
        query = self.query["get_simple_user_info"]
        query_param = dict(
            ids = tuple(ids)
        )
        cur.execute(query, query_param)
        rows = cur.fetchall()
        return list(map(lambda x: type.SimpleUserInfo(id=x[0], name=x[1], icon=x[2].tobytes()), rows))
