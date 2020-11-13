import axios, {AxiosResponse} from 'axios';
import API from './ApiBase';

type UserInfo = {
  id: string;
  name: string;
  image: string;
  email: string;
  detail?: string;
}

type RegisterUserInfo = {
  id: string;
  name: string;
  image: string;
  email: string;
  password: string;
}

type UpdateUserInfo = {
  id: string;
  name: string;
  image: string;
  email: string;
}

type ErrResponseValue = {
  detail: string
}

type ErrResponse = {
  response: AxiosResponse<ErrResponseValue>
}

export async function getUserDetail(token: string) {
  const responce = await axios.get<UserInfo>(`${API.UrlBase}${API.User.detail}`, {
    headers: {
      'my-token': token
    }})
    .catch((e: ErrResponse) => {throw new Error(e.response.data.detail)});
  if(!responce) {
    return
  };
  if (responce.status !== 200) {
    throw new Error(responce.data.detail);
  }
  return responce.data;
}

export async function userRegister(userInfo: RegisterUserInfo) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Auth.register}`, userInfo)
    .catch((e: ErrResponse) => {
      console.error(e);
      throw new Error(e.response.data.detail);
    })
  return responce.status
}

export async function profileUpdate(token: string, userInfo: UpdateUserInfo) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.User.profileUpdate}`, userInfo, {
      headers: {
        'my-token': token
      }
    })
    .catch((e: ErrResponse) => {
      console.error(e);
      throw new Error(e.response.data.detail);
    })
  return responce.status
}
