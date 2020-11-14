import axios, {AxiosResponse} from 'axios';
import API from './ApiBase';

type LoginResponse = {
  token: string,
  user_info: {
    id: string,
    name: string,
    image: string,
    email: string
  }
}

type UpdatePasswordInfo = {
  id: string,
  current_password: string,
  new_password: string
}

type ErrResponseValue = {
  detail: string
}

type ErrResponse = {
  response: AxiosResponse<ErrResponseValue>
}

export async function login(id: string, pass: string) {
  const responce = await axios.post<LoginResponse>(`${API.UrlBase}${API.Auth.login}`, {id: id, password: pass}).catch((e: ErrResponse) => {throw new Error(e.response.data.detail)})
  if(!responce) {
    return
  }
  document.cookie = `my-token=${responce.data.token}; path=/`
  return responce.data.user_info;
}

export async function logout(token: string) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Auth.logout}`, {}, {
    headers: {
      'my-token': token
    }});
  return responce;
}

export async function updatePassword(token: string, passwordInfo: UpdatePasswordInfo) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Auth.passwordUpdate}`, passwordInfo, {
    headers: {
      'my-token': token
    }}).catch((e: ErrResponse) => {throw new Error(e.response.data.detail)});
  return responce;
}
