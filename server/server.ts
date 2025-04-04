import { Hono } from "hono";
import { serve } from "@hono/node-server";
import pg from "pg";

const postgresql = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

const app = new Hono();
app.get("/", async (c) => {
  return c.text("Heisann");
});
// Henter skoler som GeoJSON
app.get("/exercise-5/api/skoler", async (c) => {
  console.log("Kjører SQL-spørring...");
  const result = await postgresql.query(
    "SELECT skolenavn, posisjon::json as coordinates FROM grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole",
  );
  console.log("Resultat hentet, lager GeoJSON");

  const features = result.rows.map((row) => ({
    type: "Feature",
    properties: {
      skolenavn: row.skolenavn,
    },
    geometry: {
      type: "Point",
      coordinates: row.coordinates.coordinates,
    },
  }));

  return c.json({
    type: "FeatureCollection",
    features,
  });
});

// Start server
serve(app);
console.log("Server kjører på http://localhost:3000");
