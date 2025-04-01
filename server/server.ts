import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();
app.get("/", async (c) => {
  return c.text("Heisann");
});
app.get("exercise-5/api/kommuner_grense.json", (c) => {
  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: [],
  });
});
serve(app);
