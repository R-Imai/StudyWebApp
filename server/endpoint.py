from typing import Optional
from fastapi import FastAPI, Header, HTTPException
from src.type import api_variable as variable
from starlette.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder

from src.dao import connection
from src.service.auth import AuthService
from src.type.exception import AlreadyExistExeption, FailureAuthenticationException

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connection = connection.mk_connection()
auth_service = AuthService(connection)

def __mk_responce_json(model):
    json_model = jsonable_encoder(model)
    return JSONResponse(content=json_model)

@app.get("/", response_model=variable.AppInfo)
def root():
    info = variable.AppInfo(version="0.0.1")
    return __mk_responce_json(info)

@app.post("/api/login", response_model=variable.LoginResponce)
def login(post_param: variable.LoginInfo):
    try:
        login_info = auth_service.login(post_param);
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    return __mk_responce_json(login_info)

@app.post("/api/logout")
def logout(my_token: Optional[str] = Header(None)):
    auth_service.logout(my_token)

@app.post("/api/user/register")
def user_register(user_info: variable.RegisterInfo):
    try:
        auth_service.register(user_info)
    except AlreadyExistExeption as e:
        raise HTTPException(
            status_code=409,
            detail=str(e),
        )
