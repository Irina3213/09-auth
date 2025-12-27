import axios from "axios";
import { User } from "@/types/user";
import { Note } from "@/types/note";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const serverInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export const getMe = async (cookieString: string): Promise<User> => {
  const res = await serverInstance.get("/users/me", {
    headers: {
      Cookie: cookieString,
    },
  });
  return res.data;
};

export const checkSession = async (
  cookieString: string
): Promise<User | null> => {
  try {
    const res = await serverInstance.get("/auth/session", {
      headers: {
        Cookie: cookieString,
      },
    });
    return res.data;
  } catch {
    return null;
  }
};
export const fetchNoteById = async (
  id: string,
  cookie: string
): Promise<Note> => {
  const res = await serverInstance.get(`/notes/${id}`, {
    headers: {
      Cookie: cookie,
    },
  });
  return res.data;
};
