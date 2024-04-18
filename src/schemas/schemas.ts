import { z } from '@hono/zod-openapi'
import { regionsEnum, statusEnum, timeEnum, typeEnum } from './enums'

// TODO: add openapi examples
// TODO: move all typeExports heare

// Schemas
export const IDType = z
  .string()
  .min(1)
  .regex(/^[0-9]+$/) // Only numbers
  .openapi({
    example: '0 (1-16 characters)',
  })

export const IDSchema = z.object({
  id: IDType,
})

// Schema for error endpoint
export const errorSchema = z.object({
  status: z.string().openapi({ example: 'error' }),
  message: z.string().openapi({ example: 'Error: 404' }),
})
export type ErrorSchema = z.infer<typeof errorSchema>
