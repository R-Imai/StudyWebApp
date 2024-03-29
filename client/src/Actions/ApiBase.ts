export const API = {
  // UrlBase: "http://127.0.0.1:5555",
  UrlBase: "",
  Auth: {
    login: "/api/login",
    logout: "/api/logout",
    register: "/api/user/register",
    passwordUpdate: "/api/password/update"
  },
  User: {
    detail: "/api/user/detail",
    profileUpdate: "/api/user/update"
  },
  Pnet: {
    profile: "/api/pnet/profile",
    profileNew: "/api/pnet/user/new",
    userDetail: "/api/pnet/user",
    userList: '/api/pnet/user/list',
    profileEdit: "/api/pnet/profile",
    userRegister: "/api/pnet/user/new",
    userHobby: "/api/pnet/user/hobby",
    usertag: "/api/pnet/user/tag",
    userSearch: "/api/pnet/user/search",
    tagGood: "/api/pnet/user/tag/good",
    tagBad: "/api/pnet/user/tag/bad",
    tagDelete: "/api/pnet/user/tag",
    career: "/api/pnet/user/career",
    network: "/api/pnet/user/network",
    networkRelation: "/api/pnet/user/network/relation",
  }
};

export default API;
