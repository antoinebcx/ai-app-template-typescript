import { z } from 'zod';

export const ElementSchema = z.object({
  elementNumber: z.number()
    .describe("Number of appearance of the element."),
  elementName: z.string()
    .describe("Name of the element."),
  elementDescription: z.string()
    .describe("Description of the element.")
}).describe("Model for tracking individual elements within an input and analyzing them.");

export const InputAnalysisSchema = z.object({
  reasoning: z.string()
    .describe("Reasoning field to understand the input before writing the analysis and summary."),
  elements: z.array(ElementSchema)
    .describe("Identifying and analyzing individual elements of the input, one by one."),
  summary: z.string()
    .describe("The number of elements in the input.")
}).describe("Main Zod schema for analyzing and summarizing the input. Contains a reasoning field, individual element identification, and a summary.");

export type Element = z.infer<typeof ElementSchema>;
export type InputAnalysis = z.infer<typeof InputAnalysisSchema>;

export const validateElement = (data: unknown): Element => {
  return ElementSchema.parse(data);
};

export const validateInputAnalysis = (data: unknown): InputAnalysis => {
  return InputAnalysisSchema.parse(data);
};
