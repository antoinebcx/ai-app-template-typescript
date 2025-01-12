import { z } from 'zod';

export const ElementSchema = z.object({
  elementNumber: z.number(),
  elementName: z.string(),
  elementDescription: z.string()
});

export const InputAnalysisSchema = z.object({
  reasoning: z.string(),
  elements: z.array(ElementSchema),
  summary: z.string()
});

export type Element = z.infer<typeof ElementSchema>;
export type InputAnalysis = z.infer<typeof InputAnalysisSchema>;

export const validateElement = (data: unknown): Element => {
  return ElementSchema.parse(data);
};

export const validateInputAnalysis = (data: unknown): InputAnalysis => {
  return InputAnalysisSchema.parse(data);
};
