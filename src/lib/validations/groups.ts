import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100, "Group name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  monthlyContribution: z.number().min(1, "Contribution amount must be at least $1").max(10000, "Contribution amount is too large"),
  minimumMembers: z.number().int().min(2, "Minimum members must be at least 2").max(200).optional(),
  maximumMembers: z.number().int().min(2, "Maximum members must be at least 2").max(200).optional(),
  contributionDay: z.number().int().min(1, "Contribution day must be between 1 and 28").max(28).optional(),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

