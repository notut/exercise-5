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
app.get("/api/skoler", async (c) => {
  console.log("Kjører SQL-spørring...");
  const result = await postgresql.query(
    `
select skolenavn, fylke.fylkesnummer, st_transform(posisjon, 4326)::json as coordinates
from grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole 
    inner join fylker_ba7aea2735714391a98b1a585644e98a.fylke on st_contains(omrade, posisjon) 
where fylke.objid in (select fylke_fk 
                      from fylker_ba7aea2735714391a98b1a585644e98a.administrativenhetnavn where navn = 'Viken')
                      `,
  );
  console.log("Resultat hentet, lager GeoJSON");

  const features = result.rows.map((row) => ({
    type: "Feature",
    properties: {
      skolenavn: row.skolenavn,
      adresse: row.adresse,
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

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
serve({
  fetch: app.fetch,
  port,
});
// Start server
//serve(app);
//console.log("Server kjører på http://localhost:3000");
