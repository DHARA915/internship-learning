import {users} from '../../data/logindata'

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "active" | "inactive";
}

export const loginUser = (
  email: string,
  password: string
): User | null => {
  const user = (users as User[]).find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password &&
      user.status === "active"
  );

  return user ?? null;
};