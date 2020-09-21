import uuid

from ..dao import pnet as dao
from ..dao import connection
from ..type import api_variable as variable
from ..type import pnet as pnet_type
from ..type.exception import UserNotFoundException

class PnetService:
    def __init__(self):
        self.pnet_dao = dao.PnetDAO()

    def get_user_info(self, user_id):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                master = self.pnet_dao.get_user_info(cur, user_id)
                hobby = self.pnet_dao.get_user_hobby(cur, user_id)
                tags = self.pnet_dao.get_tag(cur, user_id)
                tags_reaction = self.pnet_dao.get_tag_reaction(cur, user_id)
                career = self.pnet_dao.get_career(cur, user_id)
                conn.commit()
        except UserNotFoundException as e:
            conn.rollback()
            raise UserNotFoundException(e)
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()

        tag_data = []
        for tag in tags:
            if tag.id in tags_reaction:
                reaction = tags_reaction[tag.id]
                tag_data.append(pnet_type.UserTagData(**tag.__dict__, good=reaction["good"], bad=reaction["bad"]))
            else:
                tag_data.append(pnet_type.UserTagData(**tag.__dict__, good=[], bad=[]))

        user_data = pnet_type.UserData(**master.__dict__, hobby=hobby, tag=tag_data, career=career)
        return user_data

    def insert_user_info(self, user_info: pnet_type.InsertMaster):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                self.pnet_dao.insert_user_info(cur, user_info)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()

    def update_user_info(self, user_info: pnet_type.InsertMaster):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                self.pnet_dao.update_user_info(cur, user_info)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()

    def set_user_hobby(self, user_hobby: pnet_type.InsertUserHobby):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                if user_hobby.id is None:
                    id = str(uuid.uuid4())[-12:]
                    user_hobby.id = id
                    self.pnet_dao.insert_user_hobby(cur, user_hobby)
                else:
                    self.pnet_dao.update_user_hobby(cur, user_hobby)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()
        return user_hobby

    def register_tag(self, tag_data: pnet_type.TagRegister):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                id = str(uuid.uuid4())[-12:]
                tag_data.tag_id = id
                tag_master_data = pnet_type.InsertUserTag(tag_id=tag_data.tag_id, user_id=tag_data.tag_user_id, title=tag_data.title)
                tag_reaction_user = pnet_type.InsertTagReaction(
                    tag_id=tag_data.tag_id,
                    tag_user_id=tag_data.tag_user_id,
                    action_user_id=tag_data.action_user_id,
                    comment=tag_data.comment,
                    reaction="good"
                )
                self.pnet_dao.insert_tag(cur, tag_master_data)
                self.pnet_dao.insert_tag_reaction(cur, tag_reaction_user)

                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()
        return tag_master_data

    def register_tag_reaction(self, tag_reaction: pnet_type.UserTagReaction):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                user_id = self.pnet_dao.get_tag_user_id(cur, tag_reaction.tag_id)
                if user_id is None:
                    raise Exception(f"tag_id: {tag_reaction.tag_id} の情報が見つかりません")
                tag_reaction_user = pnet_type.InsertTagReaction(
                    tag_id=tag_reaction.tag_id,
                    tag_user_id=user_id[0],
                    action_user_id=tag_reaction.action_user_id,
                    comment=tag_reaction.comment,
                    reaction=tag_reaction.reaction
                )
                self.pnet_dao.insert_tag_reaction(cur, tag_reaction_user)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()

    def register_user_career(self, user_career: pnet_type.InsertUserCareer):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                id = str(uuid.uuid4())[-12:]
                user_career.history_id = id
                self.pnet_dao.insert_career(cur, user_career)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()

    def register_user_career_pr(self, user_career: pnet_type.InsertUserCareer):
        try:
            conn = connection.mk_connection()
            with conn.cursor() as cur:
                id = str(uuid.uuid4())[-12:]
                user_career.history_id = id
                self.pnet_dao.insert_career_pr(cur, user_career)
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(e)
        finally:
            conn.close()
