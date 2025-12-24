export type User = {
  email: string;
  username: string;
  avatar: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
  avatar?: string;
};
