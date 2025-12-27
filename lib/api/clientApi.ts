import { instance } from "./api";
import {
  User,
  RegisterCredentials,
  LoginCredentials,
  UpdateUserDto,
} from "@/types/user"; // Переконайтеся, що шлях правильний
import { Note, CreateNoteDto } from "@/types/note";

// Функція реєстрації
export const register = async (data: RegisterCredentials): Promise<User> => {
  const res = await instance.post("/auth/register", data);
  return res.data;
};

// Функція логіну
export const login = async (data: LoginCredentials): Promise<User> => {
  const res = await instance.post("/auth/login", data);
  return res.data;
};

// Функція логауту
export const logout = async (): Promise<void> => {
  await instance.post("/auth/logout");
};

// Функція оновлення профілю
export const updateMe = async (data: UpdateUserDto): Promise<User> => {
  const res = await instance.patch("/users/me", data);
  return res.data;
};
export const createNote = async (data: CreateNoteDto): Promise<Note> => {
  const res = await instance.post("/notes", data);
  return res.data;
};
export const checkSession = async (): Promise<User | null> => {
  const res = await instance.get("/auth/session");
  return res.data || null;
};
