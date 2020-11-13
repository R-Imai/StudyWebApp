from pydantic import BaseModel

class AppInfo(BaseModel):
    name: str = "Nameless"
    version: str
    description: str = "R-Imai's WebApp"


class LoginInfo(BaseModel):
    id: str
    password: str

class UserInfo(BaseModel):
    id: str
    name: str
    image: str
    email: str

class LoginResponce(BaseModel):
    token: str
    user_info: UserInfo

class RegisterInfo(UserInfo):
    password: str

class PasswordUpdateInfo(BaseModel):
    id: str
    current_password: str
    new_password: str
