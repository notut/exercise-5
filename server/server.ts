import { Hono } from "hono";
import { serve } from "@hono/node-server";
//import pg from "pg";

//const postgresql = new pg.Pool({ user: "postgres" });

const app = new Hono();
app.get("/", async (c) => {
  return c.text("Heisann");
});
app.get("exercise-5/api/kommuner_grense.json", (c) => {
  //const result = postgresql.query("select");
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
