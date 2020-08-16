import axios from 'axios';
import API from './ApiBase';

type userInfo = {
  id: string;
  name: string;
  image: string;
  email: string;
  detail?: string;
}


export async function getUserDetail(token: string) {
  const responce = await axios.get<userInfo>(`${API.UrlBase}${API.User.detail}`, {
    headers: {
      'my-token': token
    }});
  if (responce.status !== 200) {
    throw new Error(responce.data.detail);
  }
  return responce.data;
}
