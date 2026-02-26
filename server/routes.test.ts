import { expect } from "@std/expect";
import { afterAll, beforeAll, describe, it } from "@std/testing/bdd";
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as insightsTable from "$tables/insights.ts";
import { createRouter } from "./router.ts";

const TEST_PORT = 18765;

describe("routes", () => {
  let db: Database;
  let controller: AbortController;
  const base = `http://localhost:${TEST_PORT}`;

  beforeAll(async () => {
    db = new Database(":memory:");
    db.exec(insightsTable.createTable);

    const router = createRouter(db);
    const app = new oak.Application();
    app.use(router.routes());
    app.use(router.allowedMethods());

    controller = new AbortController();

    await new Promise<void>((resolve) => {
      app.addEventListener("listen", () => resolve());
      app.listen({ port: TEST_PORT, signal: controller.signal }).catch(() => {});
    });
  });

  afterAll(() => {
    controller.abort();
    db.close();
  });

  describe("GET /_health", () => {
    it("returns 200 when DB is accessible", async () => {
      const res = await fetch(`${base}/_health`);
      expect(res.status).toBe(200);
      await res.body?.cancel();
    });
  });

  describe("GET /insights", () => {
    it("returns empty array when no data", async () => {
      const res = await fetch(`${base}/insights`);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([]);
    });

    it("returns insights after data is inserted", async () => {
      db.sql`INSERT INTO insights (brandId, createdAt, text) VALUES (1, ${new Date().toISOString()}, ${"A test insight"})`;

      const res = await fetch(`${base}/insights`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.length).toBeGreaterThan(0);
      expect(body[0].text).toBe("A test insight");
    });

    it("returns 400 for invalid pagination params", async () => {
      const res = await fetch(`${base}/insights?limit=abc`);
      expect(res.status).toBe(400);
      await res.body?.cancel();
    });
  });

  describe("POST /insights", () => {
    it("creates an insight and returns 201", async () => {
      const res = await fetch(`${base}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: 1, text: "New insight" }),
      });
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.text).toBe("New insight");
      expect(body.brandId).toBe(1);
      expect(body.id).toBeGreaterThan(0);
    });

    it("returns 400 when body is invalid", async () => {
      const res = await fetch(`${base}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: "not-a-number", text: "" }),
      });
      expect(res.status).toBe(400);
      await res.body?.cancel();
    });

    it("returns 400 when text is empty", async () => {
      const res = await fetch(`${base}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: 1, text: "" }),
      });
      expect(res.status).toBe(400);
      await res.body?.cancel();
    });
  });

  describe("GET /insights/:id", () => {
    it("returns the insight when found", async () => {
      const created = await fetch(`${base}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: 2, text: "Lookup test" }),
      }).then((r) => r.json());

      const res = await fetch(`${base}/insights/${created.id}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.text).toBe("Lookup test");
    });

    it("returns 404 when insight does not exist", async () => {
      const res = await fetch(`${base}/insights/999999`);
      expect(res.status).toBe(404);
      await res.body?.cancel();
    });

    it("returns 400 for non-integer id", async () => {
      const res = await fetch(`${base}/insights/abc`);
      expect(res.status).toBe(400);
      await res.body?.cancel();
    });
  });

  describe("DELETE /insights/:id", () => {
    it("returns 204 when insight is deleted", async () => {
      const created = await fetch(`${base}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: 1, text: "To be deleted" }),
      }).then((r) => r.json());

      const res = await fetch(`${base}/insights/${created.id}`, { method: "DELETE" });
      expect(res.status).toBe(204);
      await res.body?.cancel();
    });

    it("returns 404 when insight does not exist", async () => {
      const res = await fetch(`${base}/insights/999999`, { method: "DELETE" });
      expect(res.status).toBe(404);
      await res.body?.cancel();
    });

    it("returns 400 for non-integer id", async () => {
      const res = await fetch(`${base}/insights/abc`, { method: "DELETE" });
      expect(res.status).toBe(400);
      await res.body?.cancel();
    });
  });
});
