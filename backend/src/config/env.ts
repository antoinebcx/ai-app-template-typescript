import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: number;
  OPENAI_API_KEY: string;
  CORS_ORIGIN: string;
}

export const config: Config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
