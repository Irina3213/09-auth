import { Note, NewFormNote, notesHttpResponse } from '@/types/note';
import type { LoginRequest, RegisterRequest, User } from '@/types/user';
import { nextServer } from './api';

export type UpdateUserRequest = {
  username: string;
};

export type CheckSessionRequest = {
  success: boolean;
  email: string;
  username: string;
  avatar: string;
};

export async function fetchNotes(
  search: string,
  page: number,
  perPage: number = 12,
  tag?: string
): Promise<notesHttpResponse> {
  if (tag === 'All') {
    tag = undefined;
  }
  const response = await nextServer.get<notesHttpResponse>('/notes', {
    params: {
      search: search,
      page,
      perPage,
      tag,
    },
  });
  return response.data;
}

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};

export async function createNote(data: NewFormNote): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', data);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${noteId}`);
  return response.data;
}

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await nextServer.patch<User>('/users/me', payload);
  return res.data;
};
