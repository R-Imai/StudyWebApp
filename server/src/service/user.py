
from ..dao import user as dao
from ..dao import connection
from ..type import api_variable as variable
from ..type.exception import UserNotFoundException

class UserService:
    def __init__(self):
        self.auth_dao = dao.UserDAO()

    def get_user_detail(self, user_id):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                userInfo = self.auth_dao.get_user_detail(cur, user_id)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()
        if userInfo is None:
            raise UserNotFoundException(f"ユーザID: '{user_id}'は存在しません")
        return variable.UserInfo(id=userInfo[0], name=userInfo[1], image=userInfo[2].tobytes(), email=userInfo[3])

    def update_user_detail(self, user_info: variable.UserInfo):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                self.auth_dao.update_user_detail(cur, user_info)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()
