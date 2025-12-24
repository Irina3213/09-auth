import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

// оновив інстанс axios

export const api = axios.create({
  baseURL: 'https://notehub-api.goit.study/',
  withCredentials: true,
});
