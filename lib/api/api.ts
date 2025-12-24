import axios from 'axios';

// axios.defaults.baseURL = 'https://notehub-api.goit.study/api';
const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api/';
// Створюємо інстанс axios
export const nextServer = axios.create({
  baseURL, //baseURL=http://localhost:3000
  withCredentials: true, // дозволяє axios працювати з cookie
});
