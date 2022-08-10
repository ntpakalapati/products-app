import jwt_decode from "jwt-decode";

const jwtDecode = async () => {
  const token = await getToken();
  if (token) {
    var decoded = jwt_decode(token);
    return decoded;
  }
  return null;
}

export const getUserIdFromToken = async () => {
  const payload = await jwtDecode();
  return payload && payload['userid']
}

export const getEmailFromToken = async () => {
  const payload = await jwtDecode();
  return payload && payload['email']
}

export function getToken() {
  return localStorage.getItem('token')
}