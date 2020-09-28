export const API = {
  // UrlBase: "http://127.0.0.1:5555",
  UrlBase: "http://192.168.1.20:5555",
  Auth: {
    login: "/api/login",
    logout: "/api/logout",
    register: "/api/user/register"
  },
  User: {
    detail: "/api/user/detail"
  },
  Pnet: {
    profile: "/api/pnet/profile",
    userDetail: "/api/pnet/user",
    profileEdit: "/api/pnet/profile",
    userRegister: "/api/pnet/user/new",
    userHobby: "/api/pnet/user/hobby",
    usertag: "/api/pnet/user/tag",
    tagGood: "/api/pnet/user/tag/good",
    tagBad: "/api/pnet/user/tag/bad",
    tagDelete: "/api/pnet/user/tag",
    career: "/api/pnet/user/career"
  }
};

export default API;
