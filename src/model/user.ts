export interface User {
  reviewer: boolean;
  admin: boolean;
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
