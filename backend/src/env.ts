import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

const { DATABASE_URL, JWT_SECRET, PORT, NODE_ENV } = process.env
export const env = { DATABASE_URL, JWT_SECRET, PORT, NODE_ENV }
