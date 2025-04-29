export type User = {
  id: number;
  name: string;
  email: string;
  password: string; // används internt när du SELECT:ar eller INSERT:ar med password
  created_at: string;
};

export type PublicUser = Omit<User, "password">; // används när du skickar ut till klient

export type NewUser = {
  name: string;
  email: string;
  password?: string; // optional eftersom POST /api/users inte alltid sätter lösenord
};
