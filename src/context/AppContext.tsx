import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSupabaseClients } from '../hooks/useSupabaseClients';
import { useSupabaseMaterials } from '../hooks/useSupabaseMaterials';
import { useSupabaseEstimates } from '../hooks/useSupabaseEstimates';

import { 
  Client, 
  Estimate, 
  EstimateMaterial, 
  Material, 
  Space 
} from '../types';
import { 
  availableSpaces 
} from '../data/mockData';
import { 
  calculateEstimateTotal,
  generateBudgetOptions 
} from '../utils/helpers';

interface AppContextType {
  // Data
  clients: Client[];
  estimates: Estimate[];
  materials: Material[];
  spaces: Space[];
  
  // Current state
  currentClient: Client | null;
  currentEstimate: Estimate | null;
  
  // Actions
  addClient: (client: Omit<Client, 'id' | 'created_at'>) => Promise<{ data?: any, error?: any }>;
  updateClient: (id: string, client: Partial<Client>) => Promise<{ data?: any, error?: any }>;
  deleteClient: (id: string) => Promise<{ error?: any }>;
  
  addMaterial: (material: Omit<Material, 'id' | 'created_at' | 'updated_at'>) => Promise<{ data?: any, error?: any }>;
  updateMaterial: (id: string, material: Partial<Material>) => Promise<{ data?: any, error?: any }>;
  deleteMaterial: (id: string) => Promise<{ error?: any }>;
  
  setCurrentClient: (client: Client | null) => void;
  setCurrentEstimate: (estimate: Estimate | null) => void;
  
  addEstimate: (estimate: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt' | 'totalPrice'>) => Promise<{ data?: any, error?: any }>;
  updateEstimate: (estimateId: string, updates: Partial<Estimate>) => Promise<{ data?: any, error?: any }>;
  deleteEstimate: (id: string) => Promise<{ error?: any }>;
  
  addMaterialToEstimate: (estimateId: string, material: Material, quantity: number) => Promise<{ error?: any }>;
  updateMaterialInEstimate: (estimateId: string, materialId: string, quantity: number) => Promise<{ error?: any }>;
  removeMaterialFromEstimate: (estimateId: string, materialId: string) => Promise<{ error?: any }>;
  
  generateBudgetSimulation: (estimateId: string, budget?: number) => void;
  
  setSelectedSpaces: (spaces: Space[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    clients,
    addClient,
    updateClient,
    deleteClient
  } = useSupabaseClients();

  const {
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial
  } = useSupabaseMaterials();

  const {
    estimates,
    addEstimate: supabaseAddEstimate,
    updateEstimate: supabaseUpdateEstimate,
    deleteEstimate: supabaseDeleteEstimate,
    addMaterialToEstimate: supabaseAddMaterialToEstimate,
    updateMaterialInEstimate: supabaseUpdateMaterialInEstimate,
    removeMaterialFromEstimate: supabaseRemoveMaterialFromEstimate
  } = useSupabaseEstimates();
  const [spaces, setSpaces] = useState<Space[]>(availableSpaces);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [currentEstimate, setCurrentEstimate] = useState<Estimate | null>(null);


  
  // Estimate actions (Supabase 버전)
  const addEstimate = async (
    estimateData: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt' | 'totalPrice'>
  ) => {
    return await supabaseAddEstimate({
      clientId: estimateData.clientId,
      clientName: estimateData.clientName,
      spaces: estimateData.spaces,
      materials: estimateData.materials,
      budget: estimateData.budget
    });
  };
  
  const updateEstimate = async (estimateId: string, updates: Partial<Estimate>) => {
    const result = await supabaseUpdateEstimate(estimateId, {
      clientName: updates.clientName,
      budget: updates.budget,
      status: 'draft' // 필요시 업데이트
    });
    
    // currentEstimate 업데이트
    if (currentEstimate?.id === estimateId && result.data) {
      const updatedEstimate = estimates.find(est => est.id === estimateId);
      if (updatedEstimate) {
        setCurrentEstimate(updatedEstimate);
      }
    }
    
    return result;
  };
  
  const deleteEstimate = async (id: string) => {
    const result = await supabaseDeleteEstimate(id);
    if (!result.error && currentEstimate?.id === id) {
      setCurrentEstimate(null);
    }
    return result;
  };
  
  // Material actions (Supabase 버전)
  const addMaterialToEstimate = async (estimateId: string, material: Material, quantity: number) => {
    const estimateMaterial: EstimateMaterial = {
      ...material,
      quantity,
      totalPrice: material.price_per_unit * quantity,
    };
    
    return await supabaseAddMaterialToEstimate(estimateId, estimateMaterial);
  };
  
  const updateMaterialInEstimate = async (estimateId: string, materialId: string, quantity: number) => {
    const estimate = estimates.find(est => est.id === estimateId);
    if (!estimate) return { error: { message: '견적을 찾을 수 없습니다.' } };
    
    const material = estimate.materials.find(mat => mat.id === materialId);
    if (!material) return { error: { message: '자재를 찾을 수 없습니다.' } };
    
    const total_price = material.price_per_unit * quantity;
    
    return await supabaseUpdateMaterialInEstimate(estimateId, materialId, {
      quantity,
      total_price
    });
  };
  
  const removeMaterialFromEstimate = async (estimateId: string, materialId: string) => {
    return await supabaseRemoveMaterialFromEstimate(estimateId, materialId);
  };
  
  // Budget simulation
  const generateBudgetSimulation = (estimateId: string, budget?: number) => {
    const estimate = estimates.find(est => est.id === estimateId);
    if (!estimate) return;
    
    const options = generateBudgetOptions(
      estimate.materials, 
      materials
    );
    
    const premiumTotal = calculateEstimateTotal(options.premium);
    const standardTotal = calculateEstimateTotal(options.standard);
    const economyTotal = calculateEstimateTotal(options.economy);
    
    const updatedEstimate: Estimate = {
      ...estimate,
      budget: budget || estimate.budget,
      options: {
        premium: {
          totalPrice: premiumTotal,
          materials: options.premium,
        },
        standard: {
          totalPrice: standardTotal,
          materials: options.standard,
        },
        economy: {
          totalPrice: economyTotal,
          materials: options.economy,
        },
      },
      updatedAt: new Date().toISOString(),
    };
    
    // Budget simulation은 로컬 상태만 업데이트 (실제 저장은 사용자가 확정시에만)
    setCurrentEstimate(updatedEstimate);
  };
  
  // Space selection
  const setSelectedSpaces = (updatedSpaces: Space[]) => {
    setSpaces(updatedSpaces);
    
    if (currentEstimate) {
      const updatedEstimate: Estimate = {
        ...currentEstimate,
        spaces: updatedSpaces.filter(space => space.selected),
        updatedAt: new Date().toISOString(),
      };
      
      // 공간 선택 변경은 로컬 상태만 업데이트
      setCurrentEstimate(updatedEstimate);
    }
  };
  
  const value = {
    // Data
    clients,
    estimates,
    materials,
    spaces,
    
    // Current state
    currentClient,
    currentEstimate,
    
    // Actions
    addClient,
    updateClient,
    deleteClient,
    
    addMaterial,
    updateMaterial,
    deleteMaterial,
    
    setCurrentClient,
    setCurrentEstimate,
    
    addEstimate,
    updateEstimate,
    deleteEstimate,
    
    addMaterialToEstimate,
    updateMaterialInEstimate,
    removeMaterialFromEstimate,
    
    generateBudgetSimulation,
    
    setSelectedSpaces,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};