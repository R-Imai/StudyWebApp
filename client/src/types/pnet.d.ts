interface PnetProfile {
  id: string,
  name: string,
  name_kana: string,
  belong: string,
  image: string,
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

interface PnetUserInfo extends PnetProfile {
  self_intro: string,
  hobby: {
      id: string,
      title: string,
      detail: string
  }[],
  tag: Tag[],
  career: {
    history_id: string,
    title: string,
    year: Date,
    detail: string
  }[]
}
