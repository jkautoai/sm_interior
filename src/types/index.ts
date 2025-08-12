export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  created_at: string;  // createdAt → created_at로 변경
  updated_at: string;  // 추가
}

export interface ClientFormData {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

export interface Material {
  id: string;
  category: MaterialCategory;
  name: string;
  brand: string;
  material: string;
  color: string;
  price_per_unit: number;
  unit: string;
  image_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface EstimateMaterial extends Material {
  quantity: number;
  totalPrice: number;
  alternativeOptions?: {
    standard: Material | null;
    economy: Material | null;
  };
}

export interface Space {
  id: string;
  name: SpaceType;
  selected: boolean;
}

export interface Estimate {
  id: string;
  clientId: string;
  clientName: string;
  spaces: Space[];
  materials: EstimateMaterial[];
  totalPrice: number;
  budget?: number;
  options?: {
    premium: EstimateOption;
    standard: EstimateOption;
    economy: EstimateOption;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EstimateOption {
  totalPrice: number;
  materials: EstimateMaterial[];
}

export type MaterialCategory = 
  | 'flooring'
  | 'tile'
  | 'wallpaper'
  | 'paint'
  | 'lighting'
  | 'fixture'
  | 'furniture'
  | 'appliance'
  | 'countertop'
  | 'cabinet'
  | 'other';

export type SpaceType = 
  | 'bathroom'
  | 'kitchen'
  | 'livingRoom'
  | 'bedroom'
  | 'diningRoom'
  | 'office'
  | 'hallway'
  | 'other';