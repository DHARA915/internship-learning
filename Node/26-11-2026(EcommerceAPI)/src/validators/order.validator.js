import { z } from "zod";

export const orderIdSchema = z.object({
    id: z.string().regex(/^[1-9]\d*$/, "Invalid order ID")
});