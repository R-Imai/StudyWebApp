
from ..dao import user as dao
from ..type import api_variable as variable

class UserService:
    def __init__(self, connection):
        self.auth_dao = dao.UserDAO(connection)

    def get_user_detail(self, user_id):
        userInfo = self.auth_dao.get_user_detail(user_id)
        if userInfo is None:
            raise UserNotFoundException(f"ユーザID: '{user_id}'は存在しません")
        return variable.UserInfo(id=userInfo[0], name=userInfo[1], image=userInfo[2].tobytes(), email=userInfo[3])
