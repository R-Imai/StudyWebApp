from ..dao import auth as dao
from ..type import api_variable as variable
from ..type.exception import FailureAuthenticationException

class AuthService:
    def __init__(self, connection):
        self.auth_dao = dao.AuthDAO(connection)

    def authentication_token(self, token: str):
        user_info = self.auth_dao.authentication(token)
        if user_info is None:
            raise HTTPException(
                status_code=401,
                detail="unaccept token",
            )
        return user_info

    def login(self, post_param: variable.LoginInfo) -> variable.LoginResponce:
        login_info = self.auth_dao.login(post_param.id, post_param.password);
        if login_info is None:
            raise FailureAuthenticationException("invalid user id or password")
        user_info = variable.UserInfo(id=login_info["user_info"][0], name=login_info["user_info"][1], image=login_info["user_info"][2].tobytes(), email=login_info["user_info"][3])
        responce = variable.LoginResponce(user_info=user_info, token=login_info["token"])
        return responce

    def logout(self, token: str):
        self.auth_dao.logout(token)

    def register(self, user_info: variable.RegisterInfo):
        self.auth_dao.register(user_info)
