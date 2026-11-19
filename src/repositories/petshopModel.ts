import connection from "../database/database";
import { safeJsonArray } from "../adapters/petAdapter";

export interface PetShopService {
  name: string;
  priceFrom?: number;
  icon: string;
}

export interface PetShopItem {
  id: string;
  name: string;
  description: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  openingHours: Array<{ days: string; hours: string }>;
  rating: number;
  reviewsCount: number;
  services: PetShopService[];
  isPartner?: boolean;
  partnerBenefit?: string;
}

class PetshopModel {
  getAll(): Promise<PetShopItem[]> {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM petshops ORDER BY rating DESC", (err: any, rows: any[]) => {
        if (err) return reject(err);

        const shops: PetShopItem[] = (rows || []).map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          address: row.address,
          coordinates: {
            latitude: Number(row.latitude),
            longitude: Number(row.longitude)
          },
          phone: row.phone,
          openingHours: safeJsonArray<{ days: string; hours: string }>(row.opening_hours),
          rating: Number(row.rating),
          reviewsCount: Number(row.reviews_count),
          services: safeJsonArray<PetShopService>(row.services),
          isPartner: Boolean(row.is_partner),
          partnerBenefit: row.partner_benefit || undefined
        }));

        resolve(shops);
      });
    });
  }

  getId(id: string): Promise<PetShopItem | null> {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM petshops WHERE id = ?", [id], (err: any, rows: any[]) => {
        if (err) return reject(err);
        if (!rows || rows.length === 0) return resolve(null);

        const row = rows[0];
        const shop: PetShopItem = {
          id: row.id,
          name: row.name,
          description: row.description,
          address: row.address,
          coordinates: {
            latitude: Number(row.latitude),
            longitude: Number(row.longitude)
          },
          phone: row.phone,
          openingHours: safeJsonArray<{ days: string; hours: string }>(row.opening_hours),
          rating: Number(row.rating),
          reviewsCount: Number(row.reviews_count),
          services: safeJsonArray<PetShopService>(row.services),
          isPartner: Boolean(row.is_partner),
          partnerBenefit: row.partner_benefit || undefined
        };

        resolve(shop);
      });
    });
  }
}

export default new PetshopModel();
