const { z } = require("zod");

const leadInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional().default(""),
  website: z.string().optional().default(""),
  budget: z.coerce.number().nonnegative().optional(),
  timeline: z.string().optional().default(""),
  requirement: z.string().min(10)
});

module.exports = { leadInputSchema };
