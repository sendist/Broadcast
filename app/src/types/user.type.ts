import { $Enums } from "@prisma/client";

export type User = {
  id: string;
  username: string;
  role: $Enums.role_t;
};
