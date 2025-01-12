import { FEW_SHOT_EXAMPLE } from './examples';

export const SYSTEM_PROMPT = `You are an input analyzer.`;

export const getUserPrompt = (textInput: string): string => `
<INSTRUCTIONS>
Your role is to perfectly analyze and describe the input in a structured way.
</INSTRUCTIONS>

<FEW-SHOT EXAMPLE>
${FEW_SHOT_EXAMPLE}
</FEW-SHOT EXAMPLE>

Now, please analyze this input:
<INPUT>
${textInput}
</INPUT>
`;
