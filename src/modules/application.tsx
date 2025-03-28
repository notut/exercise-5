import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { useGeographic } from "ol/proj";
import { Style, Fill, Stroke } from "ol/style";
import Overlay from "ol/Overlay";
import "ol/ol.css";

useGeographic();

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [popupInfo] = useState<{
    name: string;
    coordinates: number[];
  } | null>(null);

  //Stil for fylkene
  useEffect(() => {
    const defaultPolygonStyle = new Style({
      fill: new Fill({ color: "rgba(245,33,233,0.3)" }),
      stroke: new Stroke({ color: "#f85699", width: 2 }),
    });

    //Hover-stil for fylkene
    const hoverPolygonStyle = new Style({
      fill: new Fill({ color: "rgba(0,200,255,0.5)" }),
      stroke: new Stroke({ color: "#00BBFF", width: 3 }),
    });

    //Henter oversikt over fylkene
    const KommunerSource = new VectorSource({
      url: "exercise-5/geojson/kommuner_grense.json",
      format: new GeoJSON(),
    });

    const KommunerLayer = new VectorLayer({
      source: KommunerSource,
      style: defaultPolygonStyle,
    });

    //Popup med informasjon
    const popupOverlay = new Overlay({
      element: popupRef.current!,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });

    //Oppretter kartet
    const map = new Map({
      target: mapRef.current!,
      view: new View({ center: [10.8, 59.9], zoom: 6 }),
      layers: [new TileLayer({ source: new OSM() }), KommunerLayer],
      overlays: [popupOverlay],
    });

    //Viser popup med klikk
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

  //Stil på pop up beskjed
  return (
    <div className="map-container">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <div
        ref={popupRef}
        className="popup"
        style={{ display: popupInfo ? "block" : "none" }}
      >
        {popupInfo && <div className="popup-content">{popupInfo.name}</div>}
      </div>
    </div>
  );
}
