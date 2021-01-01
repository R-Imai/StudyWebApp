import psycopg2

from ..type import pnet as type
from ..type.exception import UserNotFoundException

class PnetDAO:
    def __init__(self):
        self.query = {
            "select_user_info": "SELECT pnet_master.id, user_master.name, pnet_master.name_kana, pnet_master.belong, pnet_master.self_intro, user_master.image FROM user_master INNER JOIN pnet_master ON user_master.id = pnet_master.id WHERE pnet_master.id=%s",
            "select_user_list": "SELECT pnet_master.id, user_master.name, pnet_master.name_kana, pnet_master.belong, pnet_master.self_intro, user_master.image FROM user_master INNER JOIN pnet_master ON user_master.id = pnet_master.id WHERE pnet_master.id!=%s LIMIT %s OFFSET %s",
            "select_user_list_cnt": "SELECT count(pnet_master.id) FROM user_master INNER JOIN pnet_master ON user_master.id = pnet_master.id WHERE pnet_master.id!=%s",
            "select_user_hobby": "SELECT id, title, detail FROM pnet_hobby WHERE user_id = %s",
            "select_tag_list": "select t.tag_id as tag_id, t.user_id as user_id, t.title as title, count(r.reaction='good' or NULL) as good, count(r.reaction='bad' or NULL) as bad from pnet_tag as t inner join pnet_tag_reaction as r on t.tag_id = r.tag_id group by t.tag_id, t.title, t.user_id;",
            "select_tag": "SELECT tag_id, title FROM pnet_tag WHERE user_id = %s",
            "select_tag_reaction": "SELECT tag_id, action_user_id, comment, reaction from pnet_tag_reaction WHERE tag_user_id = %s",
            "select_tag_reaction_by_tag_id": "SELECT tag_id, action_user_id, comment, reaction from pnet_tag_reaction WHERE tag_user_id = %s AND tag_id=%s",
            "select_career": "SELECT history_id, title, year, detail FROM pnet_career WHERE user_id = %s ORDER BY year ASC",
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
            "update_pnet_career": "UPDATE pnet_career SET history_id=%s, user_id=%s, title=%s, year=%s, detail=%s, create_user_cd=%s WHERE history_id=%s AND user_id=%s",
            "delete_pnet_career": "DELETE FROM pnet_career WHERE history_id=%s AND user_id=%s",
            "insert_pnet_career_pr": "INSERT INTO pnet_career_pr (history_id, user_id, title, year, detail, create_user_cd) VALUES (%s, %s, %s, %s, %s, %s);",
            "update_pnet_career_pr": "UPDATE pnet_career_pr SET history_id=%s, user_id=%s, title=%s, year=%s, detail=%s, create_user_cd=%s WHERE history_id=%s AND user_id=%s",
            "delete_pnet_career_pr": "DELETE FROM pnet_career_pr WHERE history_id=%s AND user_id=%s",
            "get_tag_reaction_user": "SELECT tag_id, tag_user_id, action_user_id, comment, reaction FROM pnet_tag_reaction WHERE tag_id=%s AND tag_user_id=%s AND action_user_id=%s;",
            "update_tag_reaction": "UPDATE pnet_tag_reaction SET tag_id=%s, tag_user_id=%s, action_user_id=%s, comment=%s, reaction=%s WHERE tag_id=%s AND tag_user_id=%s AND action_user_id=%s;",
            "delete_tag_reaction": "DELETE FROM pnet_tag_reaction WHERE tag_id=%s AND tag_user_id=%s AND action_user_id=%s;",
            "delete_tag": "DELETE FROM pnet_tag WHERE tag_id=%s AND user_id=%s;",
            "search_user": """
                SELECT pnet_master.id, user_master.name, pnet_master.name_kana, pnet_master.belong, pnet_master.self_intro, user_master.image
                FROM user_master INNER JOIN pnet_master ON user_master.id = pnet_master.id
                WHERE pnet_master.id!=%(ignore_id)s
                  AND user_master.name LIKE %(name)s
                  AND pnet_master.name_kana LIKE %(kana)s
                  AND pnet_master.belong LIKE %(belong)s
                  AND pnet_master.id IN (
                    SELECT Distinct(pnet_master.id)
                    FROM pnet_master LEFT OUTER JOIN pnet_tag ON pnet_master.id = pnet_tag.user_id
                    WHERE (CASE WHEN title IS NULL THEN '' ELSE title END) LIKE %(tag)s
                  )
                  AND pnet_master.id IN (
                    SELECT Distinct(pnet_master.id)
                    FROM pnet_master LEFT OUTER JOIN pnet_career ON pnet_career.user_id = pnet_master.id LEFT OUTER JOIN pnet_hobby ON pnet_hobby.user_id = pnet_master.id
                    WHERE pnet_master.self_intro LIKE %(detail)s
                      OR pnet_career.title LIKE %(detail)s
                      OR pnet_career.detail LIKE %(detail)s
                      OR pnet_hobby.title LIKE %(detail)s
                      OR pnet_hobby.detail LIKE %(detail)s
                  )
                LIMIT %(limit)s OFFSET %(offset)s
            """,
            "search_user_cnt": """
                SELECT count(pnet_master.id)
                FROM user_master INNER JOIN pnet_master ON user_master.id = pnet_master.id
                WHERE pnet_master.id!=%(ignore_id)s
                  AND user_master.name LIKE %(name)s
                  AND pnet_master.name_kana LIKE %(kana)s
                  AND pnet_master.belong LIKE %(belong)s
                  AND pnet_master.id IN (
                    SELECT Distinct(pnet_master.id)
                    FROM pnet_master LEFT OUTER JOIN pnet_tag ON pnet_master.id = pnet_tag.user_id
                    WHERE (CASE WHEN title IS NULL THEN '' ELSE title END) LIKE %(tag)s
                  )
                  AND pnet_master.id IN (
                    SELECT Distinct(pnet_master.id)
                    FROM pnet_master LEFT OUTER JOIN pnet_career ON pnet_career.user_id = pnet_master.id LEFT OUTER JOIN pnet_hobby ON pnet_hobby.user_id = pnet_master.id
                    WHERE pnet_master.self_intro LIKE %(detail)s
                      OR pnet_career.title LIKE %(detail)s
                      OR pnet_career.detail LIKE %(detail)s
                      OR pnet_hobby.title LIKE %(detail)s
                      OR pnet_hobby.detail LIKE %(detail)s
                  )
            """
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

    def get_user_list_cnt(self, cur, ignore_user_id) -> int:
        query = self.query["select_user_list_cnt"]
        cur.execute(query, (ignore_user_id,))
        res = cur.fetchone()
        return res[0]

    def get_user_list(self, cur, ignore_user_id, limit, offset) -> type.Master:
        query = self.query["select_user_list"]
        cur.execute(query, (ignore_user_id, limit, offset))
        rows = cur.fetchall()
        return list(map(lambda x: type.Master(id=x[0], name=x[1], name_kana=x[2], belong=x[3], self_intro=x[4], image=x[5].tobytes()), rows))

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

    def get_tag_list(self, cur) -> [type.TagListElem]:
        query = self.query["select_tag_list"]
        cur.execute(query)
        rows = cur.fetchall()
        return list(map(lambda x: type.TagListElem(tag_id=x[0], user_id=x[1], title=x[2], good=x[3], bad=x[4]), rows))

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

    def update_pnet_career(self, cur, user_career: type.InsertUserCareer):
        query = self.query["update_pnet_career"]
        cur.execute(query, (user_career.history_id, user_career.user_id, user_career.title, user_career.year, user_career.detail, user_career.create_user_cd, user_career.history_id, user_career.user_id))

    def delete_pnet_career(self, cur, history_id:str, user_id:str):
        query = self.query["delete_pnet_career"]
        cur.execute(query, (history_id, user_id))

    def insert_career_pr(self, cur, user_career: type.InsertUserCareer):
        query = self.query["insert_pnet_career_pr"]
        cur.execute(query, (user_career.history_id, user_career.user_id, user_career.title, user_career.year, user_career.detail, user_career.create_user_cd))

    def update_pnet_career_pr(self, cur, user_career: type.InsertUserCareer):
        query = self.query["update_pnet_career_pr"]
        cur.execute(query, (user_career.history_id, user_career.user_id, user_career.title, user_career.year, user_career.detail, user_career.create_user_cd, user_career.history_id, user_career.user_id))

    def delete_pnet_career_pr(self, cur, history_id:str, user_id:str):
        query = self.query["delete_pnet_career_pr"]
        cur.execute(query, (history_id, user_id))

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

    def search_user(self, cur, ignore_user_id, limit, offset, search_param:type.PnetUserSearchParam):
        query = self.query["search_user"]
        query_param = dict(
          ignore_id = ignore_user_id,
          name = f"%{search_param.name}%",
          kana = f"%{search_param.kana}%",
          belong = f"%{search_param.belong}%",
          user_id = f"%{search_param.user_id}%",
          tag = f"%{search_param.tag}%",
          detail = f"%{search_param.detail}%",
          limit = limit,
          offset = offset
        )
        cur.execute(query, query_param)
        rows = cur.fetchall()
        return list(map(lambda x: type.Master(id=x[0], name=x[1], name_kana=x[2], belong=x[3], self_intro=x[4], image=x[5].tobytes()), rows))

    def search_user_cnt(self, cur, ignore_user_id, search_param:type.PnetUserSearchParam) -> int:
        query = self.query["search_user_cnt"]
        query_param = dict(
          ignore_id = ignore_user_id,
          name = f"%{search_param.name}%",
          kana = f"%{search_param.kana}%",
          belong = f"%{search_param.belong}%",
          user_id = f"%{search_param.user_id}%",
          tag = f"%{search_param.tag}%",
          detail = f"%{search_param.detail}%"
        )
        cur.execute(query, query_param)
        res = cur.fetchone()
        return res[0]
