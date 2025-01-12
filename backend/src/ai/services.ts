import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { InputAnalysisType } from '../types/analysis';
import { InputAnalysisSchema } from '../schemas/analysis';
import { SYSTEM_PROMPT, getUserPrompt } from '../utils/prompts';
import { config } from '../config/env';
import { createReadStream } from 'fs';
import path from 'path';
import fs from 'fs/promises';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY
});

export async function llmAnalysis(textInput: string): Promise<InputAnalysisType> {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: getUserPrompt(textInput) }
      ],
      response_format: zodResponseFormat(InputAnalysisSchema, "analysis"),
      temperature: 0,
    });

    const parsed = completion.choices[0].message.parsed;
    if (!parsed) {
      throw new Error('Failed to parse OpenAI response');
    }

    return parsed;
  } catch (error) {
    console.error('Error in llmAnalysis:', error);
    throw error;
  }
}

export async function audioTranscription(audioBuffer: Buffer): Promise<string> {
  try {
    // Write buffer to temporary file
    const tmpFile = path.join(__dirname, '../../tmp', `audio-${Date.now()}.mp3`);
    await fs.mkdir(path.dirname(tmpFile), { recursive: true });
    await fs.writeFile(tmpFile, audioBuffer);

    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(tmpFile),
      model: "whisper-1",
      language: "en",
      response_format: "text"
    });

    // Clean up temp file
    await fs.unlink(tmpFile);

    return transcription;
  } catch (error) {
    console.error('Error in audioTranscription:', error);
    throw error;
  }
}

export async function imageToText(imageBuffer: Buffer): Promise<string> {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please return all the text from this image, as is."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      temperature: 0
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error in imageToText:', error);
    throw error;
  }
}
