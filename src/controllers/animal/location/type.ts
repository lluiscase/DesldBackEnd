export type AnimalLocation = {
  id: number;
  animal_id: number;
  zip?: string;
  state?: string;
  city?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  observation_date: Date | string;
};