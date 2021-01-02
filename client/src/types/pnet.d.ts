interface PnetProfileCard {
  id: string,
  name: string,
  name_kana: string,
  belong: string,
  image: string,
  self_intro: string
}

interface PnetUserListTag {
  tag_id: string,
  user_id: string,
  title: string,
  good: number,
  bad: number
}

interface PnetUserListElem extends PnetProfileCard {
  tag: PnetUserListTag[]
}

interface PnetUserList {
  data: PnetUserListElem[],
  cnt: number
}

type tagReactionType = 'good' | 'bad';

interface TagEditType {
  id?: string,
  comment?: string,
  reaction: tagReactionType,
  title?: string
}

interface TagReactionUpdate {
  tag_id: string,
  action_user_id: string,
  comment: string,
  reaction: tagReactionType
}

interface TagSet {
  tag_id: string,
  action_user_id: string,
  tag_user_id: string,
  comment: string,
  reaction: tagReactionType
}

interface TagRegister extends TagSet {
  title: string
}

interface TagType {
  id: string,
  title: string,
  good: {
    user_id: string,
    comment: string
  }[],
  bad: {
    user_id: string,
    comment: string
  }[]
}

interface Career {
  history_id: string,
  title: string,
  year: string,
  detail: string
}

interface Hobby {
  id: string,
  title: string,
  detail: string
}

interface PnetUserInfo extends PnetProfileCard {
  hobby: Hobby[],
  tag: TagType[],
  career: Career[]
}

interface PnetProfileEditInfo {
  id: string,
  name_kana: string,
  belong: string,
  self_intro: string
}

interface HobbyEditType {
  id?: string,
  title?: string,
  detail?: string
}

interface HobbySet {
  user_id: string,
  id?: string,
  title: string,
  detail: string
}

interface CareerEditType {
  history_id?: string,
  title?: string,
  year?: Date,
  detail?: string
}

interface CareerSet {
  history_id?: string,
  user_id: string,
  title: string,
  year: Date,
  create_user_cd: string,
  detail: string
}

interface UserSearchParam {
  name: string,
  kana: string,
  belong: string,
  tag: string,
  detail: string
}

interface UserSearchRequestParam {
  search_param: UserSearchParam,
  limit: number,
  offset: number
}
