import { expect } from "@std/expect";
import { beforeAll, describe, it } from "@std/testing/bdd";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight.ts";

describe("deleting an insight from the database", () => {
  describe("insight does not exist", () => {
    withDB((fixture) => {
      let result: boolean;

      beforeAll(() => {
        result = deleteInsight({ ...fixture, id: 999 });
      });

      it("returns false", () => {
        expect(result).toBe(false);
      });
    });
  });

  describe("insight exists", () => {
    withDB((fixture) => {
      let result: boolean;

      beforeAll(() => {
        fixture.insights.insert([
          { brandId: 1, createdAt: new Date().toISOString(), text: "To delete" },
          { brandId: 2, createdAt: new Date().toISOString(), text: "Keep me" },
        ]);
        result = deleteInsight({ ...fixture, id: 1 });
      });

      it("returns true", () => {
        expect(result).toBe(true);
      });

      it("removes only the specified insight from the database", () => {
        const remaining = fixture.insights.selectAll();
        expect(remaining.length).toBe(1);
        expect(remaining[0].text).toBe("Keep me");
      });
    });
  });
});
