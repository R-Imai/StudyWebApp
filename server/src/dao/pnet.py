import psycopg2

from ..type import pnet as type
from ..type.exception import UserNotFoundException

class PnetDAO:
    def __init__(self):
        self.query = {
            "select_user_info": "SELECT pnet_master.id, user_master.name, pnet_master.name_kana, pnet_master.belong, pnet_master.self_intro, user_master.image FROM user_master INNER JOIN pnet_master ON user_master.id = pnet_master.id  WHERE pnet_master.id=%s",
            "select_user_hobby": "SELECT id, title, detail FROM pnet_hobby WHERE user_id = %s",
            "select_tag": "SELECT tag_id, title FROM pnet_tag WHERE user_id = %s",
            "select_tag_reaction": "SELECT tag_id, action_user_id, comment, reaction from pnet_tag_reaction WHERE tag_user_id = %s",
            "select_tag_reaction_by_tag_id": "SELECT tag_id, action_user_id, comment, reaction from pnet_tag_reaction WHERE tag_user_id = %s AND tag_id=%s",
            "select_career": "SELECT history_id, title, year, detail FROM pnet_career WHERE user_id = %s",
            "select_career_pr": "SELECT history_id, title, year, detail FROM pnet_career_pr WHERE user_id = %s",
            "insert_master": "INSERT INTO pnet_master (id, name_kana, belong, self_intro) values (%s, %s, %s, %s);",
            "update_master": "UPDATE pnet_master SET id=%s, name_kana=%s, belong=%s, self_intro=%s WHERE id=%s;",
            "insert_user_hobby": "INSERT INTO pnet_hobby (user_id, id, title, detail) values (%s, %s, %s, %s);",
            "update_user_hobby": "UPDATE pnet_hobby SET user_id=%s, id=%s, title=%s, detail=%s WHERE user_id=%s AND id=%s;",
            "delete_user_hobby": "DELETE FROM pnet_hobby WHERE user_id=%s AND id=%s;",
            "insert_tag": "INSERT INTO pnet_tag (tag_id, user_id, title) values (%s, %s, %s);",
            "insert_tag_reaction": "INSERT INTO pnet_tag_reaction (tag_id, tag_user_id, action_user_id, comment, reaction) values (%s, %s, %s, %s, %s);",
            "tagid_2_taguser": "SELECT user_id FROM pnet_tag WHERE tag_id=%s",
            "insert_pnet_career": "INSERT INTO pnet_career (history_id, user_id, title, year, detail, create_user_cd) VALUES (%s, %s, %s, %s, %s, %s)",
            "insert_pnet_career_pr": "INSERT INTO pnet_career_pr (history_id, user_id, title, year, detail, create_user_cd) VALUES (%s, %s, %s, %s, %s, %s);",
            "get_tag_reaction_user": "SELECT tag_id, tag_user_id, action_user_id, comment, reaction FROM pnet_tag_reaction WHERE tag_id=%s AND tag_user_id=%s AND action_user_id=%s;",
            "update_tag_reaction": "UPDATE pnet_tag_reaction SET tag_id=%s, tag_user_id=%s, action_user_id=%s, comment=%s, reaction=%s WHERE tag_id=%s AND tag_user_id=%s AND action_user_id=%s;",
            "delete_tag_reaction": "DELETE FROM pnet_tag_reaction WHERE tag_id=%s AND tag_user_id=%s AND action_user_id=%s;",
            "delete_tag": "DELETE FROM pnet_tag WHERE tag_id=%s AND user_id=%s;"
        }

    def insert_user_info(self, cur, user_info: type.InsertMaster):
        query = self.query["insert_master"]
        cur.execute(query, (user_info.id, user_info.name_kana, user_info.belong, user_info.self_intro))

    def update_user_info(self, cur, user_info: type.InsertMaster):
        query = self.query["update_master"]
        cur.execute(query, (user_info.id, user_info.name_kana, user_info.belong, user_info.self_intro, user_info.id))

    def get_user_info(self, cur, user_id: str) -> type.Master:
        query = self.query["select_user_info"]
        cur.execute(query, (user_id,))
        res = cur.fetchone()
        if res is None:
            raise UserNotFoundException(f"ユーザID: '{user_id}'は存在しません")
        return type.Master(id=res[0], name=res[1], name_kana=res[2], belong=res[3], self_intro=res[4], image=res[5].tobytes())

    def get_user_hobby(self, cur, user_id: str) -> [type.UserHobby]:
        query = self.query["select_user_hobby"]
        cur.execute(query, (user_id,))
        rows = cur.fetchall()
        return list(map(lambda x: type.UserHobby(id=x[0], title=x[1], detail=x[2]), rows))

    def get_tag(self, cur, user_id: str) -> [type.UserTag]:
        query = self.query["select_tag"]
        cur.execute(query, (user_id,))
        rows = cur.fetchall()
        return list(map(lambda x: type.UserTag(id=x[0], title=x[1]), rows))

    def get_tag_reaction(self, cur, user_id: str):
        query = self.query["select_tag_reaction"]
        cur.execute(query, (user_id,))
        rows = cur.fetchall()

        tag_list = list(set(map(lambda x: x[0], rows)))
        tag_data = {}
        for tag_id in tag_list:
            target = list(filter(lambda x: x[0] == tag_id, rows))
            good = list(map(lambda y: type.TagReaction(user_id = y[1], comment=y[2]), filter(lambda x: x[3] == "good", target)))
            bad = list(map(lambda y: type.TagReaction(user_id = y[1], comment=y[2]), filter(lambda x: x[3] == "bad", target)))
            tag_data[tag_id] = {
                "good": good,
                "bad": bad
            }
        return tag_data

    def get_tag_reaction_by_tag_id(self, cur, user_id: str, tag_id: str):
        query = self.query["select_tag_reaction_by_tag_id"]
        cur.execute(query, (user_id, tag_id))
        rows = cur.fetchall()

        good = list(map(lambda y: type.TagReaction(user_id = y[1], comment=y[2]), filter(lambda x: x[3] == "good", rows)))
        bad = list(map(lambda y: type.TagReaction(user_id = y[1], comment=y[2]), filter(lambda x: x[3] == "bad", rows)))
        tag_data = {
            "good": good,
            "bad": bad
        }
        return tag_data

    def get_career(self, cur, user_id: str) -> [type.UserCareer]:
        query = self.query["select_career"]
        cur.execute(query, (user_id,))
        rows = cur.fetchall()
        return list(map(lambda x: type.UserCareer(history_id=x[0], title=x[1], year=x[2], detail=x[3]), rows))

    def get_career_pr(self, cur, user_id: str) -> [type.UserCareer]:
        query = self.query["select_career_pr"]
        cur.execute(query, (user_id,))
        rows = cur.fetchall()
        return list(map(lambda x: type.UserCareer(history_id=x[0], title=x[1], year=x[2], detail=x[3]), rows))

    def insert_user_hobby(self, cur, hobby: type.UserHobby):
        query = self.query["insert_user_hobby"]
        cur.execute(query, (hobby.user_id, hobby.id, hobby.title, hobby.detail))

    def update_user_hobby(self, cur, hobby: type.UserHobby):
        query = self.query["update_user_hobby"]
        cur.execute(query, (hobby.user_id, hobby.id, hobby.title, hobby.detail, hobby.user_id, hobby.id))

    def delete_user_hobby(self, cur, user_id: str, hobby_id:str):
        query = self.query["delete_user_hobby"]
        cur.execute(query, (user_id, hobby_id))

    def insert_tag(self, cur, tag_data: type.InsertUserTag):
        query = self.query["insert_tag"]
        cur.execute(query, (tag_data.tag_id, tag_data.user_id, tag_data.title))

    def insert_tag_reaction(self, cur, tag_reaction_data: type.InsertTagReaction):
        query = self.query["insert_tag_reaction"]
        cur.execute(query, (tag_reaction_data.tag_id, tag_reaction_data.tag_user_id, tag_reaction_data.action_user_id, tag_reaction_data.comment, tag_reaction_data.reaction))

    def get_tag_user_id(self, cur, tag_id):
        query = self.query["tagid_2_taguser"]
        cur.execute(query, (tag_id,))
        return cur.fetchone()

    def insert_career(self, cur, user_career: type.InsertUserCareer):
        query = self.query["insert_pnet_career"]
        cur.execute(query, (user_career.history_id, user_career.user_id, user_career.title, user_career.year, user_career.detail, user_career.create_user_cd))

    def insert_career_pr(self, cur, user_career: type.InsertUserCareer):
        query = self.query["insert_pnet_career_pr"]
        cur.execute(query, (user_career.history_id, user_career.user_id, user_career.title, user_career.year, user_career.detail, user_career.create_user_cd))

    def get_tag_reaction_user(self, cur, tag_id, tag_user_id, action_user_id):
        query = self.query["get_tag_reaction_user"]
        cur.execute(query, (tag_id, tag_user_id, action_user_id))
        return cur.fetchone()

    def update_tag_reaction(self, cur, tag_reaction_data: type.InsertTagReaction):
        query = self.query["update_tag_reaction"]
        cur.execute(query, (tag_reaction_data.tag_id, tag_reaction_data.tag_user_id, tag_reaction_data.action_user_id, tag_reaction_data.comment, tag_reaction_data.reaction, tag_reaction_data.tag_id, tag_reaction_data.tag_user_id, tag_reaction_data.action_user_id))

    def delete_tag_reaction(self, cur, tag_id, tag_user_id, action_user_id):
        query = self.query["delete_tag_reaction"]
        cur.execute(query, (tag_id, tag_user_id, action_user_id))

    def delete_tag(self, cur, tag_id, tag_user_id):
        query = self.query["delete_tag"]
        cur.execute(query, (tag_id, tag_user_id))
