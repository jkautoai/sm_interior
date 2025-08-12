import { EstimateMaterial, Material } from '../types';

// Format currency function
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date function
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate total price of estimate material
export const calculateMaterialTotal = (material: EstimateMaterial): number => {
  return material.price_per_unit * material.quantity;
};

// Calculate total price of all materials
export const calculateEstimateTotal = (materials: EstimateMaterial[]): number => {
  return materials.reduce((sum, material) => sum + calculateMaterialTotal(material), 0);
};

// Generate alternative options based on premium material
export const generateAlternatives = (
  material: Material,
  alternativeMaterials: Material[]
): { 
  standard: Material | null, 
  economy: Material | null 
} => {
  // Find materials in the same category with lower prices
  const sameCategoryMaterials = alternativeMaterials
    .filter(m => 
      m.category === material.category && 
      m.price_per_unit < material.price_per_unit
    )
    .sort((a, b) => b.price_per_unit - a.price_per_unit);
  
  // Pick the highest price for standard and lowest for economy
  const standard = sameCategoryMaterials.length > 0 ? sameCategoryMaterials[0] : null;
  const economy = sameCategoryMaterials.length > 1 
    ? sameCategoryMaterials[sameCategoryMaterials.length - 1] 
    : (sameCategoryMaterials.length === 1 ? sameCategoryMaterials[0] : null);
  
  return { standard, economy };
};

// Generate budget options based on selected materials
export const generateBudgetOptions = (
  materials: EstimateMaterial[],
  alternativeMaterials: Material[]
): {
  premium: EstimateMaterial[],
  standard: EstimateMaterial[],
  economy: EstimateMaterial[]
} => {
  // Premium is the original selection
  const premium = [...materials];
  
  // Generate standard and economy options
  const standard = materials.map(material => {
    const alternatives = generateAlternatives(material, alternativeMaterials);
    if (alternatives.standard) {
      return {
        ...alternatives.standard,
        quantity: material.quantity,
        totalPrice: alternatives.standard.price_per_unit * material.quantity,
      };
    }
    return material;
  });
  
  const economy = materials.map(material => {
    const alternatives = generateAlternatives(material, alternativeMaterials);
    if (alternatives.economy) {
      return {
        ...alternatives.economy,
        quantity: material.quantity,
        totalPrice: alternatives.economy.price_per_unit * material.quantity,
      };
    }
    return material;
  });
  
  return { premium, standard, economy };
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};