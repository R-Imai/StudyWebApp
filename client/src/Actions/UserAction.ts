import axios, {AxiosResponse} from 'axios';
import API from './ApiBase';

type userInfo = {
  id: string;
  name: string;
  image: string;
  email: string;
  detail?: string;
}

type registerUserInfo = {
  id: string;
  name: string;
  image: string;
  email: string;
  password: string;
}

type ErrResponseValue = {
  detail: string
}

type ErrResponse = {
  response: AxiosResponse<ErrResponseValue>
}

export async function getUserDetail(token: string) {
  const responce = await axios.get<userInfo>(`${API.UrlBase}${API.User.detail}`, {
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
