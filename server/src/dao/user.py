import psycopg2

class UserDAO:
    def __init__(self, connection):
        self.connection = connection
        self.query = {
            "select_by_ueer_id": "SELECT id, name, image, email FROM user_master WHERE id='{0}'"
        }

    def get_user_detail(self, user_id):
        with self.connection.cursor() as cur:
            query = self.query["select_by_ueer_id"].format(user_id)
            cur.execute(query)
            res = cur.fetchone()
        self.connection.commit()
        return res
