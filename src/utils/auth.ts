import { User } from "../types/auth";

export const getUsers = (): User[] => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

export const getUserSession = (): User | null => {
  const session = localStorage.getItem("userSession");
  return session ? JSON.parse(session) : null;
};

export const setUserSession = (user: User) => {
  localStorage.setItem("userSession", JSON.stringify(user));
};

export const clearUserSession = () => {
  localStorage.removeItem("userSession");
};
