# AI app template

This project is a template of an AI app, built with TypeScript and using Vite, React, Node and Express. It demonstrates how to use AI services to extract information in a structured way from text, audio, and images.

The project shows how to use structured outputs with a reasoning field, how to effectively structure a prompt with XML tags, and how to use few-shot examples (in-context learning).

The app supports text inputs, audio transcription and text extraction from images.

<img width="1323" alt="image" src="https://github.com/user-attachments/assets/fecda86b-9aa3-463d-901c-1ebcd1bb6679" />

## To use the app

To use the app, you need to create a `.env` file in the `/backend` directory with:
```
OPENAI_API_KEY = [your OpenAI API key]
```

Then, you can open two terminal windows, go to the project path and run:
```
cd frontend
npm install
npm run dev
```
```
cd backend
npm install
npm run dev
```
