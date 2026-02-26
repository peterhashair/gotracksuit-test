export const createTable = `
  CREATE TABLE IF NOT EXISTS insights (
                                        id INTEGER PRIMARY KEY ASC NOT NULL,
                                        brandId INTEGER NOT NULL,
                                        createdAt TEXT NOT NULL,
                                        text TEXT NOT NULL
  )
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

export const insertStatement = (item: Insert) =>
  `INSERT INTO insights (brandId, createdAt, text) VALUES (${item.brandId}, '${item.createdAt}', '${item.text}')`;
