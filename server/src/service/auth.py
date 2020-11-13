from datetime import timedelta, datetime
import hashlib

from ..dao import auth as dao
from ..dao import connection
from ..type import api_variable as variable
from ..type.exception import FailureAuthenticationException

TOKEN_VALID_PERIOD = timedelta(days=7)

class AuthService:
    def __init__(self):
        self.auth_dao = dao.AuthDAO()

    def authentication_token(self, token: str):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                user_info = self.auth_dao.authentication(cur, token)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()

        if user_info is None:
            raise FailureAuthenticationException("ログインが必要です")
        now = datetime.today()
        td = now - user_info["create_date"]
        if td > TOKEN_VALID_PERIOD:
            self.logout(token)
            raise FailureAuthenticationException("再度ログインが必要です")
        return user_info["user_id"]

    def login(self, post_param: variable.LoginInfo) -> variable.LoginResponce:
        passwordHash = hashlib.sha256(post_param.password.encode()).hexdigest()
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                login_info = self.auth_dao.login(cur, post_param.id, passwordHash)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()

        if login_info is None:
            raise FailureAuthenticationException("IDもしくはパスワードが正しくありません")
        user_info = variable.UserInfo(id=login_info["user_info"][0], name=login_info["user_info"][1], image=login_info["user_info"][2].tobytes(), email=login_info["user_info"][3])
        responce = variable.LoginResponce(user_info=user_info, token=login_info["token"])
        return responce

    def logout(self, token: str):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                self.auth_dao.logout(cur, token)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()

    def register(self, user_info: variable.RegisterInfo):
        user_info.password = hashlib.sha256(user_info.password.encode()).hexdigest()
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                self.auth_dao.register(cur, user_info)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()

    def password_update(self, password_info: variable.PasswordUpdateInfo):
        password_info.current_password = hashlib.sha256(password_info.current_password.encode()).hexdigest()
        password_info.new_password = hashlib.sha256(password_info.new_password.encode()).hexdigest()
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                user_info = self.auth_dao.password_auth(cur, password_info.id, password_info.current_password)
                if user_info is None:
                    raise FailureAuthenticationException("パスワードが正しくありません")
                self.auth_dao.update_password(cur, password_info)
                conn.commit()
        except FailureAuthenticationException as e:
            conn.rollback()
            raise e
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()
