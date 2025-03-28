import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();
app.get("/", async (c) => {
  return c.text("Heii test");
});
serve(app);
