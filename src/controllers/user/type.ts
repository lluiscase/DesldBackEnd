export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  active: boolean;
  created_at: Date;
  updated_at: Date | null;
};

export type CreateUser = {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  active: boolean;
};
