import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  brandId: number;
  text: string;
};

export default (input: Input): Insight => {
  console.log("Creating insight");

  const createdAt = new Date().toISOString();

  input.db
    .sql`INSERT INTO insights (brandId, createdAt, text) VALUES (${input.brandId}, ${createdAt}, ${input.text})`;

  const id = Number(input.db.lastInsertRowId);
  const result: Insight = {
    id,
    brandId: input.brandId,
    createdAt: new Date(createdAt),
    text: input.text,
  };

  console.log("Created insight:", result);
  return result;
};
