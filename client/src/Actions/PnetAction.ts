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
