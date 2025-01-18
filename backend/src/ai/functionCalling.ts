import { OpenAI } from "openai";
import { type ChatCompletionTool } from "openai/resources/chat/completions";
import { config } from '../config/env';
import { ClassificationResult } from '../types/analysis';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY
});

const tools: ChatCompletionTool[] = [{
  type: "function",
  function: {
    name: "classify_input",
    description: "Classify the input text into predefined categories",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["scientific", "historical", "technical", "business", "other"],
          description: "The category that best matches the input text"
        },
        confidence: {
          type: "number",
          description: "Confidence score between 0 and 1"
        }
      },
      required: ["category", "confidence"],
      additionalProperties: false
    }
  }
}];

export async function classifyWithFunctionCalling(textInput: string): Promise<ClassificationResult> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are an expert at classifying text into categories. Analyze the input carefully and provide accurate classifications."
        },
        {
          role: "user",
          content: `Please classify this text:\n\n${textInput}`
        }
      ],
      tools
    });

    const toolCall = completion.choices[0].message.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('No classification result returned');
    }

    const result = JSON.parse(toolCall.function.arguments) as ClassificationResult;
    return result;
  } catch (error) {
    console.error('Error in classification:', error);
    return {
      category: "other",
      confidence: 0
    };
  }
}
