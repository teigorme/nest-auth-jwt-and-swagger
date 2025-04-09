import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const CreateUserDtoSchemaZod = extendApi(z.object({
    name:z.string().min(1).max(255),
    email:z.string().min(1).max(255).email(),
    password:z.string().min(8).max(255)
}))

export class CreateUserDto extends createZodDto(CreateUserDtoSchemaZod){}
