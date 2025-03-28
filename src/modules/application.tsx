import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { useGeographic } from "ol/proj";
import { Style, Fill, Stroke } from "ol/style";

import "ol/ol.css";

useGeographic();

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const defaultPolygonStyle = new Style({
      fill: new Fill({ color: "rgba(245,33,233,0.3)" }),
      stroke: new Stroke({ color: "#f85699", width: 2 }),
    });

    const hoverPolygonStyle = new Style({
      fill: new Fill({ color: "rgba(0,200,255,0.5)" }),
      stroke: new Stroke({ color: "#00BBFF", width: 3 }),
    });

    const KommunerSource = new VectorSource({
      url: "geojson/Kommuner _grense_.json", // fjernet "public/"
      format: new GeoJSON(),
    });

    const KommunerLayer = new VectorLayer({
      source: KommunerSource,
      style: defaultPolygonStyle,
    });

    const map = new Map({
      target: mapRef.current!,
      view: new View({ center: [10.8, 59.9], zoom: 6 }),
      layers: [new TileLayer({ source: new OSM() }), KommunerLayer],
    });

    map.on("pointermove", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
      KommunerLayer.getSource()
        ?.getFeatures()
        .forEach((feat) => {
          feat.setStyle(
            feat === feature ? hoverPolygonStyle : defaultPolygonStyle,
          );
        });
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
