import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
  })
} else {
  config()
}

const schemaEnv = z.object({
  API_PORT: z.number().default(8080),
  NODE_ENV: z.enum(['dev', 'prd', 'test']).default('dev'),
  DATABASE_CLIENT: z.string(),
  DATABASE_URL: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USER: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PASSWORD: z.string(),
})

const _env = schemaEnv.safeParse(process.env)

if (_env.success === false) {
  console.error(`Invalid Variable: ${JSON.stringify(_env.error.format())}`)

  throw new Error('Invalid environment variables')
}

export const env = _env.data
