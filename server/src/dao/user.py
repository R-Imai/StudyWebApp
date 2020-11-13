import psycopg2

class UserDAO:
    def __init__(self):
        self.query = {
            "select_by_ueer_id": "SELECT id, name, image, email FROM user_master WHERE id=%s",
            "update_master": "UPDATE user_master SET id=%s, name=%s, image=%s, email=%s WHERE id=%s;"
        }

    def get_user_detail(self, cur, user_id):
        query = self.query["select_by_ueer_id"]
        cur.execute(query, (user_id,))
        res = cur.fetchone()
        return res

    def update_user_detail(self, cur, user_info):
        query = self.query["update_master"]
        cur.execute(query, (user_info.id, user_info.name, user_info.image, user_info.email, user_info.id))
