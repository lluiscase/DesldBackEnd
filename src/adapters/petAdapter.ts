export function safeJsonArray<T = string>(value: unknown): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function buildImageUrl(pathOrUrl: string, baseUrl?: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = baseUrl || process.env.APP_URL || "http://localhost:4000";
  const cleanPath = pathOrUrl.startsWith("/") ? pathOrUrl.slice(1) : pathOrUrl;
  return `${base}/${cleanPath}`;
}

export interface PetResponse {
  id: string;
  name: string | null;
  status: "lost" | "street" | "rescued" | "adoption" | "adopted";
  tags: string[];
  daysCount: number;
  imageUrl: string;
  imageUrls: string[];
  imageBrightness: number[];
  description?: string;
  location?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt?: string;
  species?: string;
  characteristics: string[];
  contactName?: string;
  contactPhone?: string;
  isUserReport: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function petAdapter(
  animalRow: any,
  images: any[] = [],
  location: any = null,
  currentUserId: number | null = null,
  baseUrl?: string
): PetResponse {
  const createdAt = animalRow.created_at ? new Date(animalRow.created_at).toISOString() : undefined;
  
  let daysCount = 0;
  if (animalRow.created_at) {
    const elapsed = Date.now() - new Date(animalRow.created_at).getTime();
    daysCount = Math.max(0, Math.floor(elapsed / DAY_MS));
  } else if (animalRow.missing_date) {
    const elapsed = Date.now() - new Date(animalRow.missing_date).getTime();
    daysCount = Math.max(0, Math.floor(elapsed / DAY_MS));
  }

  // Ordena imagens por display_order se existir
  const sortedImages = [...images].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  
  const imageUrls = sortedImages.map((img) => buildImageUrl(img.image_url, baseUrl));
  const imageBrightness = sortedImages.map((img) => Number(img.brightness ?? 0));
  const primaryImageUrl = imageUrls[0] || (animalRow.image_url ? buildImageUrl(animalRow.image_url, baseUrl) : "");

  let coordinates: { latitude: number; longitude: number } | undefined = undefined;
  if (location && location.latitude !== null && location.longitude !== null && location.latitude !== undefined && location.longitude !== undefined) {
    coordinates = {
      latitude: Number(location.latitude),
      longitude: Number(location.longitude)
    };
  }

  let locationText: string | undefined = undefined;
  if (location) {
    if (location.address_label && location.address_label.trim().length > 0) {
      locationText = location.address_label;
    } else if (location.city || location.state) {
      locationText = [location.county, location.city, location.state].filter(Boolean).join(", ");
    }
  }

  // Mapeamento de status legados se houver registros antigos
  let status = animalRow.status;
  if (status === "missing") status = "lost";
  if (status === "found") status = "street";
  if (status === "reunited") status = "rescued";

  const tags = safeJsonArray<string>(animalRow.tags);
  const characteristics = safeJsonArray<string>(animalRow.characteristics);

  return {
    id: String(animalRow.id),
    name: animalRow.name ? String(animalRow.name).trim() : null,
    status: status || "street",
    tags,
    daysCount,
    imageUrl: primaryImageUrl,
    imageUrls,
    imageBrightness,
    description: animalRow.description || undefined,
    location: locationText || undefined,
    coordinates,
    createdAt,
    species: animalRow.species || undefined,
    characteristics,
    contactName: animalRow.contact_name || undefined,
    contactPhone: animalRow.contact_phone || undefined,
    isUserReport: Boolean(currentUserId && Number(animalRow.user_id) === Number(currentUserId))
  };
}
