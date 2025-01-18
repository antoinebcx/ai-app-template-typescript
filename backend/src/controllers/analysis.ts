import { Request, Response } from 'express';
import { llmAnalysis, audioTranscription, imageToText } from '../ai/services';
import { classifyWithFunctionCalling } from '../ai/functionCalling';

export async function analyzeText(req: Request, res: Response) {
  try {
    const { text } = req.body;
    const [analysis, classification] = await Promise.all([
      llmAnalysis(text),
      classifyWithFunctionCalling(text)
    ]);
    res.json({ analysis, classification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze text' });
  }
}

export async function analyzeAudio(req: Request, res: Response) {
  try {
    const audioBuffer = req.file?.buffer;
    if (!audioBuffer) throw new Error('No audio file provided');
    
    const transcript = await audioTranscription(audioBuffer);
    const [analysis, classification] = await Promise.all([
      llmAnalysis(transcript),
      classifyWithFunctionCalling(transcript)
    ]);
    
    res.json({
      transcript,
      analysis,
      classification
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze audio' });
  }
}

export async function analyzeImage(req: Request, res: Response) {
  try {
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) throw new Error('No image file provided');
    
    const extractedText = await imageToText(imageBuffer);
    const [analysis, classification] = await Promise.all([
      llmAnalysis(extractedText),
      classifyWithFunctionCalling(extractedText)
    ]);
    
    res.json({
      extractedText,
      analysis,
      classification
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze image' });
  }
}
