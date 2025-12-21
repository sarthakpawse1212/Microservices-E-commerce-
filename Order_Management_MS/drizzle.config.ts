import {DB_URL} from './src/config'
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/*',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DB_URL!,
  },
  verbose: true,
  strict: true
});