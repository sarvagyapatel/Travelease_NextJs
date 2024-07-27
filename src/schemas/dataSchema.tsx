import * as z from 'zod';

export const dataSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  date: z.object({
    from: z.date(),
    to: z.date()
  }).required(),
  categories: z.array(z.string()).nonempty('At least one category is required'),
});
