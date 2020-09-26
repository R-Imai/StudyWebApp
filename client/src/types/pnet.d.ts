interface PnetProfileCard {
  id: string,
  name: string,
  name_kana: string,
  belong: string,
  image: string,
  self_intro: string
}

interface Tag {
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
  tag: Tag[],
  career: Career[]
}

interface PnetProfileEditInfo {
  id: string,
  name_kana: string,
  belong: string,
  self_intro: string
}
