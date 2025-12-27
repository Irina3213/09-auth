import {
  User,
  RegisterCredentials,
  LoginCredentials,
  UpdateUserDto,
} from "@/types/user";
import { Note } from "@/types/note";
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});
// --- AUTH ---
export const register = async (data: RegisterCredentials): Promise<User> => {
  const res = await instance.post("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginCredentials): Promise<User> => {
  const res = await instance.post("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await instance.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const res = await instance.get("/auth/session");
  return res.data || null;
};

// --- USER ---
export const updateMe = async (data: UpdateUserDto): Promise<User> => {
  const res = await instance.patch("/users/me", data);
  return res.data;
};

// --- NOTES TYPES ---
export interface CreateNoteParams {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

// Структура відповіді від сервера для списку нотаток
export interface NoteResponse {
  notes: Note[];
  total: number;
  pages: number;
  page: number;
}

// --- NOTES METHODS ---

export const createNote = async (data: CreateNoteParams): Promise<Note> => {
  const res = await instance.post("/notes", data);
  return res.data;
};

// Тільки ОДНЕ оголошення fetchNotes
export const fetchNotes = async (
  params: { page?: number; search?: string; tag?: string } = {}
): Promise<NoteResponse> => {
  const res = await instance.get("/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await instance.get(`/notes/${id}`);
  return res.data;
};

export const updateNote = async (
  id: string,
  data: Partial<CreateNoteParams>
): Promise<Note> => {
  const res = await instance.patch(`/notes/${id}`, data);
  return res.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await instance.delete(`/notes/${id}`);
};
