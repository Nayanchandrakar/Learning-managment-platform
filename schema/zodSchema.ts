import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  description: z.string().min(10).max(200),
});