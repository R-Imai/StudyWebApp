import axios from 'axios';
import API from './ApiBase';

type LoginResponce = {
  token: string,
  user_info: {
    id: string,
    name: string,
    image: string,
    email: string
  }
  detail?: string
}

export async function login(id: string, pass: string) {
  const responce = await axios.post<LoginResponce>(`${API.UrlBase}${API.Auth.login}`, {id: id, password: pass})
  if (responce.status !== 200) {
    throw new Error(responce.data.detail);
  }
  document.cookie = `my-token=${responce.data.token};`
  return responce.data.user_info;
}

export async function logout(token: string) {
  const responce = await axios.post<null>(`${API.UrlBase}${API.Auth.logout}`, {}, {
    headers: {
      'my-token': token
    }});
  return responce;
}
