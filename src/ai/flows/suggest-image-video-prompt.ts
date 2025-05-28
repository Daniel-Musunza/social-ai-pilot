'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting image or video prompts to enhance social media posts.
 *
 * - suggestImageVideoPrompt - A function that takes a social media caption and suggests image/video ideas.
 * - SuggestImageVideoPromptInput - The input type for the suggestImageVideoPrompt function.
 * - SuggestImageVideoPromptOutput - The return type for the suggestImageVideoPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImageVideoPromptInputSchema = z.object({
  caption: z.string().describe('The social media caption to enhance.'),
});
export type SuggestImageVideoPromptInput = z.infer<typeof SuggestImageVideoPromptInputSchema>;

const SuggestImageVideoPromptOutputSchema = z.object({
  imagePrompt: z.string().optional().describe('A creative image prompt suggestion.'),
  videoPrompt: z.string().optional().describe('A creative video prompt suggestion.'),
});
export type SuggestImageVideoPromptOutput = z.infer<typeof SuggestImageVideoPromptOutputSchema>;

export async function suggestImageVideoPrompt(input: SuggestImageVideoPromptInput): Promise<SuggestImageVideoPromptOutput> {
  return suggestImageVideoPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImageVideoPromptPrompt',
  input: {schema: SuggestImageVideoPromptInputSchema},
  output: {schema: SuggestImageVideoPromptOutputSchema},
  prompt: `Given the following social media caption, suggest a creative image prompt and a creative video prompt to visually enhance the post. You do not need to generate both, choose only one if necessary.

Caption: {{{caption}}}

Output:
{
  imagePrompt: string, // A creative image prompt. Optional.
  videoPrompt: string, // A creative video prompt. Optional.
}`,
});

const suggestImageVideoPromptFlow = ai.defineFlow(
  {
    name: 'suggestImageVideoPromptFlow',
    inputSchema: SuggestImageVideoPromptInputSchema,
    outputSchema: SuggestImageVideoPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
