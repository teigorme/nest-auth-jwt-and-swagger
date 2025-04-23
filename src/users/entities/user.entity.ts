import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const schema = extendApi(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'MANAGER', 'USER']),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
);
export class User extends createZodDto(schema) {}
