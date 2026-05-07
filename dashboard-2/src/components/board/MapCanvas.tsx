import { Accessibility } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { KAU_CENTER } from '../../data/services';

interface Props {
  accessible?: boolean;
  /** Marker latitude. Defaults to KAU Jeddah campus center. */
  lat?: number;
  /** Marker longitude. Defaults to KAU Jeddah campus center. */
  lng?: number;
  /** Bounding-box span in degrees around the marker. Larger = more zoomed out. */
  span?: number;
}

/** Build the OpenStreetMap embed URL. Free, no API key, no signup. */
function osmEmbedUrl(lat: number, lng: number, span: number) {
  const minLon = (lng - span).toFixed(5);
  const minLat = (lat - span).toFixed(5);
  const maxLon = (lng + span).toFixed(5);
  const maxLat = (lat + span).toFixed(5);
  const bbox = `${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}`;
  const marker = `${lat.toFixed(5)}%2C${lng.toFixed(5)}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
}

/** Real free map of KAU Jeddah campus, served by OpenStreetMap. */
export function MapCanvas({
  accessible = false,
  lat = KAU_CENTER.lat,
  lng = KAU_CENTER.lng,
  span = 0.006,
}: Props) {
  const { lang } = useApp();
  const url = osmEmbedUrl(lat, lng, span);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border-soft min-h-[420px] bg-surface-2">
      <iframe
        title={lang === 'ar' ? 'خريطة الحرم الجامعي' : 'Campus map'}
        className="absolute inset-0 w-full h-full"
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0, colorScheme: 'light' }}
      />

      {/* Caption pill — top-right */}
      <div className="absolute top-4 right-4 bg-white/95 dark:bg-surface/95 backdrop-blur rounded-xl px-4 py-2 text-sm font-medium text-ink shadow-md border border-border-soft pointer-events-none">
        {lang === 'ar' ? 'خريطة جامعة الملك عبدالعزيز' : 'King Abdulaziz University · Jeddah'}
      </div>

      {/* Accessible-mode badge */}
      {accessible && (
        <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-success text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg pointer-events-none">
          <Accessibility className="w-4 h-4" />
          {lang === 'ar' ? 'مسار ميسر مفعّل' : 'Accessible route on'}
        </div>
      )}

      {/* Attribution — required by OSM */}
      <div className="absolute bottom-1 right-2 text-[10px] text-ink-muted bg-white/80 dark:bg-surface/80 px-1.5 py-0.5 rounded pointer-events-none">
        © OpenStreetMap
      </div>
    </div>
  );
}

/** Compact version of the same OSM map for inline previews. */
export function MiniMapPreview({
  lat = KAU_CENTER.lat,
  lng = KAU_CENTER.lng,
  span = 0.008,
}: Pick<Props, 'lat' | 'lng' | 'span'>) {
  const url = osmEmbedUrl(lat, lng, span);
  return (
    <div className="w-full max-w-[640px] aspect-[3/1.4] rounded-2xl border border-border-soft overflow-hidden relative bg-surface-2">
      <iframe
        title="Campus map preview"
        className="absolute inset-0 w-full h-full"
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ border: 0, colorScheme: 'light' }}
      />
      <div className="absolute bottom-1 right-2 text-[10px] text-ink-muted bg-white/80 dark:bg-surface/80 px-1.5 py-0.5 rounded pointer-events-none">
        © OpenStreetMap
      </div>
    </div>
  );
}
