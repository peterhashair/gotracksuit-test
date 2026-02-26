import { expect } from "@std/expect";
import { beforeAll, describe, it } from "@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import createInsight from "./create-insight.ts";

describe("creating an insight in the database", () => {
  describe("inserting a new insight", () => {
    withDB((fixture) => {
      let result: Insight;

      beforeAll(() => {
        result = createInsight({ ...fixture, brandId: 1, text: "A new insight" });
      });

      it("returns the created insight", () => {
        expect(result.brandId).toBe(1);
        expect(result.text).toBe("A new insight");
        expect(result.id).toBeGreaterThan(0);
        expect(result.createdAt).toBeInstanceOf(Date);
      });

      it("persists the insight to the database", () => {
        const rows = fixture.insights.selectAll();
        expect(rows.length).toBe(1);
        expect(rows[0].brandId).toBe(1);
        expect(rows[0].text).toBe("A new insight");
      });
    });
  });

  describe("inserting multiple insights", () => {
    withDB((fixture) => {
      let first: Insight;
      let second: Insight;

      beforeAll(() => {
        first = createInsight({ ...fixture, brandId: 1, text: "First" });
        second = createInsight({ ...fixture, brandId: 2, text: "Second" });
      });

      it("assigns distinct ids", () => {
        expect(first.id).not.toBe(second.id);
      });

      it("persists all insights to the database", () => {
        expect(fixture.insights.selectAll().length).toBe(2);
      });
    });
  });
});
