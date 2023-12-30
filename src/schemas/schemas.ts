import { z } from '@hono/zod-openapi'

const IDSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[0-9]+$/) // Only numbers
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
})

const EventSmallSchema = z.object({
  type: z.string().openapi({
    example: 'Event_SM',
  }),
  id: z
    .string()
    .min(3)
    .regex(/^[0-9]+$/) // Only numbers
    .openapi({
      example: '000000000001927',
    }),
  link: z.string().openapi({
    example:
      'https://www.vlr.gg/event/1927/champions-tour-2023-china-ascension',
  }),
  name: z.string().openapi({
    example: 'Champions Tour 2023 China: Ascension',
  }),
  date: z.string().openapi({
    example: 'Dec 22—30',
  }),
  status: z
    .string()
    .regex(/New||Ongoing||Completed/)
    .openapi({
      example: 'completed',
    }),
  prize: z.string().openapi({
    example: '$250,000',
  }),
  region: z
    .string()
    .regex(/EU||NA||KR||BR||AP||LATAM||OCE/)
    .openapi({
      example: 'EU',
    }),
  logo: z.string().openapi({
    example: 'https://owcdn.net/img/6009f963577f4.png',
  }),
})

const MatchSchema = z.object({
  type: z.string().openapi({
    example: 'Event_SM',
  }),
  id: z
    .string()
    .min(3)
    .regex(/^[0-9]+$/) // Only numbers
    .openapi({
      example: '000000000001927',
    }),
  link: z.string().openapi({
    example:
      'https://www.vlr.gg/event/1927/champions-tour-2023-china-ascension',
  }),
  name: z.string().openapi({
    example: 'Champions Tour 2023 China: Ascension',
  }),
  date: z.string().openapi({
    example: 'Dec 22—30',
  }),
  status: z
    .string()
    .regex(/New||Ongoing||Completed/)
    .openapi({
      example: 'completed',
    }),
  prize: z.string().openapi({
    example: '$250,000',
  }),
  region: z
    .string()
    .regex(/EU||NA||KR||BR||AP||LATAM||OCE/)
    .openapi({
      example: 'EU',
    }),
  logo: z.string().openapi({
    example: 'https://owcdn.net/img/6009f963577f4.png',
  }),
})

export { IDSchema, EventSmallSchema, MatchSchema }
