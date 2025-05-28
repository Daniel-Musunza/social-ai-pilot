'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating social media posts.
 *
 * The flow takes a topic or keyword as input and generates a social media post with a relevant caption,
 * optimized hashtags, and short-form video content hooks. The flow uses the Gemini model via Genkit for
 * AI content generation.
 *
 * @interface GenerateSocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * @interface GenerateSocialMediaPostOutput - The output type for the generateSocialMediaPost function.
 * @function generateSocialMediaPost - A function that handles the generation of social media posts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostInputSchema = z.object({
  topic: z.string().describe('The topic or keyword for the social media post.'),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.object({
  caption: z.string().describe('An engaging social media caption.'),
  hashtags: z.array(z.string()).describe('A list of platform-optimized hashtags.'),
  shortFormHook: z
    .string()
    .optional()
    .describe('A suggested video/audio hook for TikTok/Shorts.'),
  imagePrompt: z
    .string()
    .optional()
    .describe('An optional prompt for image generation.'),
  videoPrompt: z
    .string()
    .optional()
    .describe('An optional prompt for video generation.'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(
  input: GenerateSocialMediaPostInput
): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const generateSocialMediaPostPrompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `Generate an engaging social media post about {{topic}}, with a content hook for short-form video (TikTok/Shorts), 3–5 relevant hashtags, and optionally a creative image or video idea.\n\
Output format: \
{
  caption: string; // An engaging social media caption
  hashtags: string[]; // A list of platform-optimized hashtags
  shortFormHook?: string; // A suggested video/audio hook for TikTok/Shorts
  imagePrompt?: string; // An optional prompt for image generation
  videoPrompt?: string; // An optional prompt for video generation
}
`,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await generateSocialMediaPostPrompt(input);
    return output!;
  }
);
