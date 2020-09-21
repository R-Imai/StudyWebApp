import datetime
from pydantic import BaseModel
from typing import List

class Master(BaseModel):
    id: str
    name: str
    name_kana: str
    belong: str
    self_intro: str

class InsertMaster(BaseModel):
    id: str
    name_kana: str
    belong: str
    self_intro: str

class UserHobby(BaseModel):
    id: str
    title: str
    detail: str

class InsertUserHobby(BaseModel):
    user_id: str
    id: str = None
    title: str
    detail: str

class UserTag(BaseModel):
    id: str
    title: str

class InsertUserTag(BaseModel):
    tag_id: str
    user_id: str
    title: str

class TagReaction(BaseModel):
    user_id: str
    comment: str

class InsertTagReaction(BaseModel):
    tag_id: str
    tag_user_id: str
    action_user_id: str
    comment: str
    reaction: str

class UserCareer(BaseModel):
    history_id: str
    title: str
    year: datetime.date
    detail: str

class UserTagData(UserTag):
    good: List[TagReaction]
    bad: List[TagReaction]

class UserData(Master):
    hobby: List[UserHobby]
    tag: List[UserTagData]
    career: List[UserCareer]

class TagRegister(BaseModel):
    tag_id: str = None
    tag_user_id: str
    title: str
    action_user_id: str
    comment: str

class UserTagReaction(BaseModel):
    tag_id: str
    action_user_id: str
    comment: str
    reaction: str = None

class InsertUserCareer(BaseModel):
    history_id: str = None
    user_id: str
    title: str
    year: datetime.date
    create_user_cd: str
    detail: str
