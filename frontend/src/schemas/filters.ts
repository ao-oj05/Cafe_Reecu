import { z } from "zod";

export const salesFilterSchema = z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});
