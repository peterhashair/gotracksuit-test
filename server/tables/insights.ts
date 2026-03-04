export const createTable = `
  CREATE TABLE IF NOT EXISTS insights (
                                        id INTEGER PRIMARY KEY ASC NOT NULL,
                                        brandId INTEGER NOT NULL,
                                        createdAt TEXT NOT NULL,
                                        text TEXT NOT NULL
  )
`;

export const createIndexes = `
  CREATE INDEX IF NOT EXISTS idx_insights_brandId ON insights (brandId)
`;

export type Row = {
  id: number;
  brandId: number;
  createdAt: string;
  text: string;
};

export type Insert = {
  brandId: number;
  createdAt: string;
  text: string;
};
