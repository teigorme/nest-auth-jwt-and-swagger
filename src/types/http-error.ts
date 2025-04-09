import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const schema = extendApi(
  z.object({
    statusCode: z.number(),
    message: z.string(),
  }),
);

export class HttpError extends createZodDto(schema) {}
