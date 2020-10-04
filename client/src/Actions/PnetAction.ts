import axios, {AxiosResponse} from 'axios';
import API from './ApiBase';

type ErrResponseValue = {
  detail: string
}

type ErrResponse = {
  response: AxiosResponse<ErrResponseValue>
}

export async function getProfile(token: string) {
  const responce = await axios.get<PnetUserInfo>(`${API.UrlBase}${API.Pnet.profile}`, {
    headers: {
      'my-token': token
    }}
  ).catch((e: ErrResponse) => {throw new Error(e.response.data.detail)});

  return responce.data;
}

export async function getUserInfo(token: string, userId: string) {
  const responce = await axios.get<PnetUserInfo>(`${API.UrlBase}${API.Pnet.userDetail}`, {
    params: {
      user_id: userId
    },
    headers: {
      'my-token': token
    }}
  ).catch((e: ErrResponse) => {throw new Error(e.response.data.detail)});

  return responce.data;
}

export async function updateProfile(token: string, profile: PnetProfileEditInfo) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Pnet.profileEdit}`, profile, {
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}

export async function registerProfile(token: string, profile: PnetProfileEditInfo) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Pnet.profileNew}`, profile, {
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}

export async function tagRegister(token: string, tag: TagRegister) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Pnet.usertag}`, tag, {
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}


export async function tagGood(token: string, tag: TagReactionUpdate) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Pnet.tagGood}`, tag, {
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}


export async function tagBad(token: string, tag: TagReactionUpdate) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Pnet.tagBad}`, tag, {
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}

type DeleteTagReactionParam = {
  tag_id: string;
  action_user_id: string;
}

export async function tagReactionDelete(token: string, tagId: string, actionUserId: string) {
  const responce = await axios.delete<null>(`${API.UrlBase}${API.Pnet.tagDelete}`, {
    params: {
      tag_id: tagId,
      action_user_id: actionUserId
    },
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}


export async function userHobbySet(token: string, hobby: HobbySet) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Pnet.userHobby}`, hobby, {
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}


export async function userHobbyDelete(token: string, userId: string, hobbyId:string) {
  const responce = await axios.delete<null>(`${API.UrlBase}${API.Pnet.userHobby}`, {
    params: {
      user_id: userId,
      hobby_id: hobbyId
    },
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}



export async function userCareerSet(token: string, career: CareerSet) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Pnet.career}`, career, {
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}


export async function userCareerDelete(token: string, userId: string, careerId:string) {
  const responce = await axios.delete<null>(`${API.UrlBase}${API.Pnet.career}`, {
    params: {
      user_id: userId,
      history_id: careerId
    },
    headers: {
      'my-token': token
    }
  }).catch((e: ErrResponse) => {
    console.error(e);
    throw new Error(e.response.data.detail);
  });
  return responce.status
}
