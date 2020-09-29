from typing import Optional
from fastapi import FastAPI, Header, HTTPException
from starlette.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder

from src.type import api_variable as variable
from src.type import pnet as pnet_type
from src.dao import connection
from src.service.auth import AuthService
from src.service.user import UserService
from src.service.pnet import PnetService
from src.type.exception import AlreadyExistExeption, FailureAuthenticationException, UserNotFoundException

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connection = connection.mk_connection()
auth_service = AuthService(connection)
user_service = UserService(connection)
pnet_service = PnetService()

def __mk_responce_json(model):
    json_model = jsonable_encoder(model)
    return JSONResponse(content=json_model)

@app.get("/", response_model=variable.AppInfo)
def root():
    info = variable.AppInfo(version="0.0.1")
    return __mk_responce_json(info)

@app.post("/api/login", response_model=variable.LoginResponce, tags=["Auth"])
def login(post_param: variable.LoginInfo):
    try:
        login_info = auth_service.login(post_param);
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    return __mk_responce_json(login_info)

@app.post("/api/logout", tags=["Auth"])
def logout(my_token: Optional[str] = Header(None)):
    auth_service.logout(my_token)

@app.post("/api/user/register", tags=["Auth"])
def user_register(user_info: variable.RegisterInfo):
    try:
        auth_service.register(user_info)
    except AlreadyExistExeption as e:
        raise HTTPException(
            status_code=409,
            detail=str(e),
        )

@app.get("/api/user/detail", response_model=variable.UserInfo, tags=["User"])
def login_user_detail(my_token: Optional[str] = Header(None)):
    try:
        user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    try:
        user_info = user_service.get_user_detail(user_id)
    except UserNotFoundException as e:
        raise HTTPException(
            status_code=500,
            detail="ユーザ情報の取得に失敗しました"
        )
    return __mk_responce_json(user_info)



# == pnet ==

@app.get("/api/pnet/profile", response_model=pnet_type.UserData, tags=["People Network"])
def pnet_my_profile(my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    try:
        user_info = pnet_service.get_user_info(login_user_id)
    except UserNotFoundException as e:
        raise HTTPException(
            status_code=500,
            detail="【Pnet-E001】: このアプリケーションへ未登録の可能性があります"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )
    return __mk_responce_json(user_info)

@app.get("/api/pnet/user", response_model=pnet_type.UserData, tags=["People Network"])
def pnet_user_detail(user_id: str, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    try:
        user_info = pnet_service.get_user_info(user_id)
    except UserNotFoundException as e:
        raise HTTPException(
            status_code=500,
            detail="【Pnet-E001】: このアプリケーションへ未登録の可能性があります"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )
    return __mk_responce_json(user_info)

@app.post("/api/pnet/user/new", tags=["People Network"])
def pnet_user_register(post_param: pnet_type.InsertMaster, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if post_param.id != login_user_id:
        raise HTTPException(
            status_code=400,
            detail="不正なリクエストです"
        )

    try:
        user_info = pnet_service.insert_user_info(post_param)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )

@app.post("/api/pnet/profile", tags=["People Network"])
def pnet_user_update(post_param: pnet_type.InsertMaster, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if post_param.id != login_user_id:
        raise HTTPException(
            status_code=400,
            detail="不正なリクエストです"
        )

    try:
        user_info = pnet_service.update_user_info(post_param)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )

@app.post("/api/pnet/user/hobby", response_model=pnet_type.InsertUserHobby, tags=["People Network"])
def pnet_user_hobby(post_param: pnet_type.InsertUserHobby, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if post_param.user_id != login_user_id:
        raise HTTPException(
            status_code=400,
            detail="不正なリクエストです"
        )

    try:
        user_hobby = pnet_service.set_user_hobby(post_param)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )

    return __mk_responce_json(user_hobby)

@app.delete("/api/pnet/user/hobby", tags=["People Network"])
def delete_user_hobby(user_id: str, hobby_id:str, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if user_id != login_user_id:
        raise HTTPException(
            status_code=400,
            detail="不正なリクエストです"
        )

    try:
        pnet_service.delete_user_hobby(user_id, hobby_id)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )

@app.post("/api/pnet/user/tag", response_model=pnet_type.InsertUserTag, tags=["People Network"])
def pnet_user_tag(post_param: pnet_type.TagRegister, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if post_param.action_user_id != login_user_id:
        raise HTTPException(
            status_code=400,
            detail="不正なリクエストです"
        )

    try:
        user_tag = pnet_service.register_tag(post_param)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )

    return __mk_responce_json(user_tag)

@app.post("/api/pnet/user/tag/good", tags=["People Network"])
def pnet_user_tag_good(post_param: pnet_type.UserTagReaction, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if post_param.action_user_id != login_user_id:
        raise HTTPException(
            status_code=400,
            detail="不正なリクエストです"
        )

    try:
        post_param.reaction="good"
        user_tag = pnet_service.register_tag_reaction(post_param)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )


@app.post("/api/pnet/user/tag/bad", tags=["People Network"])
def pnet_user_tag_bad(post_param: pnet_type.UserTagReaction, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if post_param.action_user_id != login_user_id:
        raise HTTPException(
            status_code=400,
            detail="不正なリクエストです"
        )

    try:
        post_param.reaction="bad"
        user_tag = pnet_service.register_tag_reaction(post_param)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )

@app.delete("/api/pnet/user/tag", tags=["People Network"])
def pnet_delete_tag_reaction(tag_id: str, action_user_id: str, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if action_user_id != login_user_id:
        raise HTTPException(
            status_code=400,
            detail="不正なリクエストです"
        )

    try:
        pnet_service.delete_tag_reaction(tag_id, action_user_id)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"予期せぬエラーが発生しました。\n{e}"
        )

@app.post("/api/pnet/user/career", tags=["People Network"])
def pnet_user_career(post_param: pnet_type.InsertUserCareer, my_token: Optional[str] = Header(None)):
    try:
        login_user_id = auth_service.authentication_token(my_token)
    except FailureAuthenticationException as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if post_param.create_user_cd != login_user_id:
        raise HTTPException(
            status_code=400,
            detail="不正なリクエストです"
        )
    if post_param.user_id == login_user_id:
        try:
            pnet_service.register_user_career(post_param)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"予期せぬエラーが発生しました。\n{e}"
            )
    else:
        try:
            pnet_service.register_user_career_pr(post_param)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"予期せぬエラーが発生しました。\n{e}"
            )
