import { z } from "zod";

export const iconaIconData = z.object({
  name: z.string(),
  svg: z.string(),
  metadatas: z.array(z.string()).optional(),
  png: z.object({
    "1x": z.string().nullable(),
    "2x": z.string().nullable(),
    "3x": z.string().nullable(),
    "4x": z.string().nullable(),
  }),
});

export type IconaIconData = z.infer<typeof iconaIconData>;

export const iconaIconJsonFile = z.record(iconaIconData);

export type IconaIconJsonFile = z.infer<typeof iconaIconJsonFile>;
