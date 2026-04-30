import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map as MapIcon } from "lucide-react";
import { getCityCoords, KING_COUNTY_CENTER } from "@/lib/king-county-cities";

interface MapProperty {
  id: string;
  name: string;
  city: string | null;
}

interface PropertiesMapProps {
  properties: MapProperty[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function PropertiesMap({ properties, selectedId, onSelect }: PropertiesMapProps) {
  const token = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ?? "";
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  useEffect(() => {
    console.info("[housing] Map diagnostics", { hasPublicToken: Boolean(token) });
  }, [token]);

  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({ container: containerRef.current, style: "mapbox://styles/mapbox/light-v11", center: KING_COUNTY_CENTER, zoom: 8.5 });
      map.on("load", () => setMapReady(true));
      map.on("error", () => setMapFailed(true));
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      mapRef.current = map;
    } catch {
      setMapFailed(true);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
      setMapReady(false);
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const bounds = new mapboxgl.LngLatBounds();
    const cityCount: Record<string, number> = {};

    properties.forEach((p) => {
      const coords = getCityCoords(p.city);
      if (!coords) return;
      const key = p.city ?? "";
      const idx = cityCount[key] ?? 0;
      cityCount[key] = idx + 1;
      const angle = idx * 0.7;
      const radius = idx === 0 ? 0 : 0.004 + idx * 0.0008;
      const lng = coords[0] + Math.cos(angle) * radius;
      const lat = coords[1] + Math.sin(angle) * radius;
      const el = document.createElement("button");
      el.className = "map-pin";
      el.onclick = (e) => {
        e.stopPropagation();
        onSelect(p.id);
      };
      const marker = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
      markersRef.current.set(p.id, marker);
      bounds.extend([lng, lat]);
    });

    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 40, maxZoom: 12, duration: 300 });
  }, [properties, onSelect, mapReady]);

  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      el.style.cssText = id === selectedId
        ? "width:26px;height:26px;border-radius:9999px;background:hsl(var(--destructive));border:2px solid white;"
        : "width:18px;height:18px;border-radius:9999px;background:hsl(var(--primary));border:2px solid white;";
    });
  }, [selectedId]);

  if (!token || mapFailed) {
    return <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-muted/30 p-6 text-center">
      <MapIcon className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">Map unavailable right now.</p>
      <p className="text-xs text-muted-foreground">Results list is still fully available and up to date.</p>
    </div>;
  }

  return <div ref={containerRef} className="h-full w-full overflow-hidden rounded-2xl border border-border" />;
}
