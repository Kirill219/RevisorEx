export interface User {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  company: string;
  initials: string;
  createdAt: Date;
  updatedAt: Date;
}
