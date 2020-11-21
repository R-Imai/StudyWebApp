export const getToken = () => {
    const cookies = document.cookie;
    const tokenArr = cookies.split(';').find((row:string) => { return row.trim().startsWith('my-token') });
    if (typeof tokenArr === 'undefined') {
        return null;
    }
    const token = tokenArr.split('=')[1];
    return token;
  }