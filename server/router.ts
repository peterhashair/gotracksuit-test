import { z } from "zod";
import * as oak from "@oak/oak";
import type { Database } from "@db/sqlite";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";

const CreateInsightBody = z.object({
  brandId: z.number().int().min(1),
  text: z.string().min(1),
});

export const createRouter = (db: Database): oak.Router => {
  const router = new oak.Router();

  router.get("/_health", (ctx) => {
    try {
      db.sql`SELECT 1`;
      ctx.response.body = "OK";
      ctx.response.status = 200;
    } catch (e) {
      console.error("Health check failed:", e);
      ctx.response.status = 503;
      ctx.response.body = { error: "Service unavailable" };
    }
  });

  router.get("/insights", (ctx) => {
    try {
      const params = ctx.request.url.searchParams;
      const limit = params.has("limit") ? Number(params.get("limit")) : 50;
      const offset = params.has("offset") ? Number(params.get("offset")) : 0;

      if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(offset) || offset < 0) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid pagination parameters" };
        return;
      }

      const result = listInsights({ db, limit, offset });
      ctx.response.body = result;
      ctx.response.status = 200;
    } catch (e) {
      console.error("GET /insights failed:", e);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to list insights" };
    }
  });

  router.get("/insights/:id", (ctx) => {
    try {
      const id = Number(ctx.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid id" };
        return;
      }

      const result = lookupInsight({ db, id });
      if (!result) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Insight not found" };
        return;
      }

      ctx.response.body = result;
      ctx.response.status = 200;
    } catch (e) {
      console.error("GET /insights/:id failed:", e);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to get insight" };
    }
  });

  router.post("/insights", async (ctx) => {
    try {
      const body = await ctx.request.body.json();
      const parsed = CreateInsightBody.safeParse(body);
      if (!parsed.success) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid request body" };
        return;
      }

      const result = createInsight({ db, ...parsed.data });
      ctx.response.body = result;
      ctx.response.status = 201;
    } catch (e) {
      console.error("POST /insights failed:", e);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to create insight" };
    }
  });

  router.delete("/insights/:id", (ctx) => {
    try {
      const id = Number(ctx.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid id" };
        return;
      }

      const found = deleteInsight({ db, id });
      if (!found) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Insight not found" };
        return;
      }

      ctx.response.status = 204;
    } catch (e) {
      console.error("DELETE /insights/:id failed:", e);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to delete insight" };
    }
  });

  return router;
};
