import { defineCollection, z } from 'astro:content'; 
import { glob } from 'astro/loaders';

const bids = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/bids" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    cover: image(),
    coverAlt: z.string(),
  }),
});

export const collections = { bids }; 