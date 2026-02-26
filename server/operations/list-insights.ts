import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  limit?: number;
  offset?: number;
};

export default (input: Input): Insight[] => {
  const limit = input.limit ?? 50;
  const offset = input.offset ?? 0;

  console.log("Listing insights");

  const rows = input.db.sql<insightsTable.Row>`SELECT * FROM insights LIMIT ${limit} OFFSET ${offset}`;

  const result: Insight[] = rows.map((row) => ({
    ...row,
    createdAt: new Date(row.createdAt),
  }));

  console.log("Retrieved insights successfully: ", result);
  return result;
};
