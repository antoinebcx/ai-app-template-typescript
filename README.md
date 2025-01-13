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

## The code

The template is structured as a classic TypeScript fullstack app, in a monorepo with `/backend` and `/frontend` folders.

It contains notably:
- AI services (LLM, audio transcription and text extraction from image) in [`backend/src/ai/services.ts`](https://github.com/antoinebcx/ai-app-template-typescript/blob/main/backend/src/ai/services.ts)
- Their corresponding frontend components (`TextAnalysis`, `AudioAnalysis`, `ImageAnalysis`) in [`frontend/src/components`](https://github.com/antoinebcx/ai-app-template-typescript/tree/main/frontend/src/components)
- System prompt and user prompt with XML tags in [`backend/src/utils/prompts.ts`](https://github.com/antoinebcx/ai-app-template-typescript/blob/main/backend/src/utils/prompts.ts)
- Few-shot example in [`backend/src/utils/examples.ts`](https://github.com/antoinebcx/ai-app-template-typescript/blob/main/backend/src/utils/examples.ts)
- Structured outputs Zod schemas in [`backend/src/schemas/analysis.ts`](https://github.com/antoinebcx/ai-app-template-typescript/blob/main/backend/src/schemas/analysis.ts)

All the rest is like any other app (API, controllers, ...).
