import { readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

export const campaignSchema = z.object({
  active: z.boolean(),
  season: z.string().min(1),
});

export type Campaign = z.infer<typeof campaignSchema>;

export function parseCampaign(raw: unknown): Campaign {
  return campaignSchema.parse(raw);
}

export function getCampaign(): Campaign {
  const filePath = path.join(process.cwd(), 'content', 'campaign.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  return parseCampaign(raw);
}
