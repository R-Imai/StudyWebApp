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
