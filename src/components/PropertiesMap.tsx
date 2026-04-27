import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map as MapIcon } from "lucide-react";
import type { Property } from "@/hooks/use-properties";
import { getCityCoords, KING_COUNTY_CENTER } from "@/lib/king-county-cities";

const TOKEN_KEY = "decoded_housing_mapbox_token";

interface PropertiesMapProps {
  properties: Property[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function PropertiesMap({ properties, selectedId, onSelect }: PropertiesMapProps) {
  const envToken = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) ?? "";
  const [token, setToken] = useState<string>(() => {
    if (envToken) return envToken;
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(TOKEN_KEY) ?? "";
  });
  const [tokenInput, setTokenInput] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  // Initialize map once we have a token
  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = token;

    try {
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: KING_COUNTY_CENTER,
        zoom: 8.5,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      mapRef.current = map;
    } catch (err) {
      console.error("Map init failed", err);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [token]);

  // Sync markers with filtered properties
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const ensureReady = () => {
      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();

      const bounds = new mapboxgl.LngLatBounds();
      let added = 0;

      // Group properties by city to offset overlapping pins slightly
      const cityCount: Record<string, number> = {};

      properties.forEach((p) => {
        const coords = getCityCoords(p.city);
        if (!coords) return;
        const key = p.city ?? "";
        const idx = cityCount[key] ?? 0;
        cityCount[key] = idx + 1;
        // Tiny spiral offset so multiple properties in same city don't fully overlap
        const angle = idx * 0.7;
        const radius = idx === 0 ? 0 : 0.004 + idx * 0.0008;
        const lng = coords[0] + Math.cos(angle) * radius;
        const lat = coords[1] + Math.sin(angle) * radius;

        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", p.name);
        el.dataset.propertyId = p.id;
        el.className = "map-pin";
        el.style.cssText = `
          width: 18px; height: 18px; border-radius: 9999px;
          background: hsl(var(--primary, 152 40% 30%));
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          cursor: pointer; padding: 0;
          transition: transform 0.15s ease, background-color 0.15s ease, width 0.15s ease, height 0.15s ease;
        `;
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelect(p.id);
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);
        markersRef.current.set(p.id, marker);
        bounds.extend([lng, lat]);
        added++;
      });

      if (added > 0 && !bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 40, maxZoom: 12, duration: 600 });
      }
    };

    if (map.loaded()) ensureReady();
    else map.once("load", ensureReady);
  }, [properties, onSelect]);

  // Highlight selected pin
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (id === selectedId) {
        el.style.background = "hsl(var(--destructive, 0 70% 50%))";
        el.style.width = "26px";
        el.style.height = "26px";
        el.style.transform = "translate(-4px, -4px) scale(1)";
        el.style.zIndex = "10";
      } else {
        el.style.background = "";
        el.style.width = "18px";
        el.style.height = "18px";
        el.style.transform = "";
        el.style.zIndex = "";
      }
    });

    if (!selectedId) return;
    const map = mapRef.current;
    const marker = markersRef.current.get(selectedId);
    if (map && marker) {
      map.flyTo({ center: marker.getLngLat(), zoom: Math.max(map.getZoom(), 11), duration: 600 });
    }
  }, [selectedId]);

  if (!token) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-[var(--gradient-soft)] p-6 text-center">
        <MapIcon className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">Add your Mapbox token</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Get a free public token at <a className="underline" href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noreferrer">mapbox.com</a>
          </p>
        </div>
        <form
          className="flex w-full max-w-xs flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!tokenInput.trim()) return;
            window.localStorage.setItem(TOKEN_KEY, tokenInput.trim());
            setToken(tokenInput.trim());
          }}
        >
          <input
            type="text"
            placeholder="pk.eyJ1Ijoi..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
          />
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary-glow">
            Load map
          </button>
        </form>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full overflow-hidden rounded-2xl border border-border" />;
}
