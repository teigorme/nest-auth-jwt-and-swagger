import { Roles } from "@prisma/client";

export type Payload = {
  sub: string;
  name: string;
  email: string;
  role: Roles;
  
};
