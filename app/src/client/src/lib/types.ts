export type Account = {
  id: number;
  username: string;
  accessToken: string;
  role: "superadmin" | "admin";
};

export type ServerResult<T> =
  | {
      error: null;
      data: T;
    }
  | {
      error: string;
      data: null;
    };
