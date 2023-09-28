export type Account = {
  id: number;
  username: string;
  accessToken: string;
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
