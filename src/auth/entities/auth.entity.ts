import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const schema = extendApi(
  z.object({
    accessToken: z.string().jwt(),
    refreshToken: z.string().jwt(),
  }),
);
export class Auth extends createZodDto(schema) {}
