import { Roles } from '@prisma/client';

export class Payload {
  sub: string;
  name: string;
  email: string;
  role: Roles;
}
