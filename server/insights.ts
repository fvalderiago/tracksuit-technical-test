import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

interface Insight {
  id: number;
  brandId: number;
  text: string;
  date: string;
}

let insights: Insight[] = [];
let idCounter = 1;

const router = new Router();

router
  // GET all insights
  .get("/insights", (ctx) => {
    ctx.response.body = insights;
  })
  // POST a new insight
  .post("/insights", async (ctx) => {
    try {
      const body = ctx.request.body({ type: "json" });
      const { brandId, text } = await body.value;

      if (!brandId || !text) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Missing brandId or text" };
        return;
      }

      const newInsight: Insight = {
        id: idCounter++,
        brandId,
        text,
        date: new Date().toISOString(),
      };

      insights.push(newInsight);
      ctx.response.status = 201;
      ctx.response.body = newInsight;
    } catch (error) {
      console.error("Error adding insight:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal Server Error" };
    }
  })
  // DELETE an insight by id
  .delete("/insights/:id", (ctx) => {
    const id = Number(ctx.params.id);
    const index = insights.findIndex((i) => i.id === id);

    if (index === -1) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Insight not found" };
      return;
    }

    insights.splice(index, 1);
    ctx.response.status = 204;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Deno server running at http://localhost:8000");
await app.listen({ port: 8000 });
