import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import MaterialCard from '../components/MaterialCard';
import { ArrowLeft, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Space, Material, EstimateMaterial } from '../types';
import { spaceTypeLabels, materialCategoryLabels } from '../data/mockData';

const EstimateFormPage: React.FC = () => {
  const { 
    clients, 
    spaces: availableSpaces,
    materials: availableMaterials,
    currentClient,
    addEstimate,
    setCurrentClient,
    setSelectedSpaces,
  } = useAppContext();
  
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const [step, setStep] = useState(1);
  const [client, setClient] = useState(currentClient);
  const [selectedSpaces, setSelectedSpacesLocal] = useState<Space[]>(availableSpaces);
  const [selectedMaterials, setSelectedMaterials] = useState<EstimateMaterial[]>([]);
  const [materialFilter, setMaterialFilter] = useState({
    category: '',
    search: '',
  });
  
  // Load client data
  useEffect(() => {
    if (clientId) {
      const foundClient = clients.find(c => c.id === clientId);
      if (foundClient) {
        setClient(foundClient);
        setCurrentClient(foundClient);
      }
    }
  }, [clientId, clients, setCurrentClient]);
  
  // Step 1: Client selection
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClientId = e.target.value;
    const selectedClient = clients.find(c => c.id === selectedClientId);
    if (selectedClient) {
      setClient(selectedClient);
      setCurrentClient(selectedClient);
    }
  };
  
  // Step 2: Space selection
  const handleSpaceToggle = (spaceId: string) => {
    setSelectedSpacesLocal(prev => 
      prev.map(space => 
        space.id === spaceId ? { ...space, selected: !space.selected } : space
      )
    );
  };
  
  // Step 3: Material selection
  const handleAddMaterial = (material: Material) => {
    const newMaterial: EstimateMaterial = {
      ...material,
      quantity: 1,
      totalPrice: material.price_per_unit,
    };
    
    setSelectedMaterials(prev => [...prev, newMaterial]);
  };
  
  const handleRemoveMaterial = (materialId: string) => {
    setSelectedMaterials(prev => prev.filter(material => material.id !== materialId));
  };
  
  const handleMaterialQuantityChange = (materialId: string, quantity: number) => {
    setSelectedMaterials(prev =>
      prev.map(material =>
        material.id === materialId
          ? { 
              ...material, 
              quantity, 
              totalPrice: material.price_per_unit * quantity 
            }
          : material
      )
    );
  };
  
  const filteredMaterials = availableMaterials.filter(material => {
    const matchesCategory = !materialFilter.category || material.category === materialFilter.category;
    const matchesSearch = !materialFilter.search || 
      material.name.toLowerCase().includes(materialFilter.search.toLowerCase()) ||
      material.brand.toLowerCase().includes(materialFilter.search.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  
  const isMaterialSelected = (materialId: string) => {
    return selectedMaterials.some(material => material.id === materialId);
  };
  
  // Form submission
  const handleCreateEstimate = () => {
    if (!client) return;
    
    const newEstimate = {
      clientId: client.id,
      clientName: client.name,
      spaces: selectedSpaces.filter(space => space.selected),
      materials: selectedMaterials,
    };
    
    const estimateId = addEstimate(newEstimate);
    setSelectedSpaces(selectedSpaces);
    navigate(`/estimates/${estimateId}/summary`);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">1단계: 고객 선택</h2>
            </CardHeader>
            <CardContent>
              {client ? (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{client.name}</h3>
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => setClient(null)}
                    >
                      변경
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{client.phone}</p>
                    <p>{client.address}</p>
                  </div>
                </div>
              ) : (
                <Select
                  label="고객 선택"
                  options={[
                    { value: '', label: '-- 고객을 선택해주세요 --' },
                    ...(clients || []).map(c => ({ value: c.id, label: `${c.name} (${c.phone})` }))
                  ]}
                  value={client?.id || ''}
                  onChange={handleClientChange}
                />
              )}
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  취소
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    icon={<Plus size={16} />}
                    onClick={() => navigate('/clients/new')}
                  >
                    신규 고객
                  </Button>
                  
                  <Button
                    variant="primary"
                    disabled={!client}
                    onClick={() => setStep(2)}
                    icon={<ArrowRight size={16} className="ml-1" />}
                  >
                    다음 단계
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        );
        
      case 2:
        return (
          <>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">2단계: 시공 공간 선택</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                견적 작성에 포함할 시공 공간을 선택해주세요.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {selectedSpaces.map(space => (
                  <div
                    key={space.id}
                    className={`
                      border rounded-lg p-3 text-center cursor-pointer transition-colors
                      ${space.selected 
                        ? 'bg-teal-50 border-teal-300 text-teal-700' 
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'}
                    `}
                    onClick={() => handleSpaceToggle(space.id)}
                  >
                    <span className="block">{spaceTypeLabels[space.name]}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  이전 단계
                </Button>
                
                <Button
                  variant="primary"
                  disabled={!selectedSpaces.some(space => space.selected)}
                  onClick={() => setStep(3)}
                  icon={<ArrowRight size={16} className="ml-1" />}
                >
                  다음 단계
                </Button>
              </div>
            </CardContent>
          </>
        );
        
      case 3:
        return (
          <>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">3단계: 자재 선택</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                <Select
                  label="자재 분류"
                  options={[
                    { value: '', label: '모든 자재' },
                    ...Object.entries(materialCategoryLabels).map(([value, label]) => ({
                      value,
                      label,
                    }))
                  ]}
                  value={materialFilter.category}
                  onChange={(e) => setMaterialFilter(prev => ({ ...prev, category: e.target.value }))}
                  className="md:w-40"
                />
                
                <Input
                  label="자재명 검색"
                  value={materialFilter.search}
                  onChange={(e) => setMaterialFilter(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="자재명 또는 브랜드명 검색..."
                  className="flex-1"
                />
              </div>
              
              {selectedMaterials.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">선택된 자재</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {selectedMaterials.map(material => (
                        <div key={material.id} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                          <div className="flex-1">
                            <div className="font-medium">{material.name}</div>
                            <div className="text-sm text-gray-600">
                              {material.brand} | {materialCategoryLabels[material.category]}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <span className="text-sm mr-2">수량/면적:</span>
                              <input
                                type="number"
                                min="1"
                                value={material.quantity}
                                onChange={(e) => handleMaterialQuantityChange(
                                  material.id, 
                                  parseInt(e.target.value) || 1
                                )}
                                className="w-16 border border-gray-300 rounded p-1 text-center"
                              />
                              <span className="text-sm ml-1">{material.unit}</span>
                            </div>
                            
                            <Button
                              variant="text"
                              size="sm"
                              icon={<Trash2 size={16} />}
                              onClick={() => handleRemoveMaterial(material.id)}
                              className="text-red-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 text-right">
                      <span className="text-gray-600 mr-2">총 금액:</span>
                      <span className="font-semibold text-lg">
                        {new Intl.NumberFormat('ko-KR').format(
                          selectedMaterials.reduce((sum, mat) => sum + mat.totalPrice, 0)
                        )}원
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <h3 className="font-medium text-gray-800 mb-3">자재 목록</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredMaterials.map(material => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    isSelected={isMaterialSelected(material.id)}
                    onSelect={handleAddMaterial}
                    onRemove={handleRemoveMaterial}
                  />
                ))}
                
                {filteredMaterials.length === 0 && (
                  <div className="col-span-3 py-8 text-center text-gray-500">
                    <p>검색 조건에 맞는 자재가 없습니다.</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  이전 단계
                </Button>
                
                <Button
                  variant="primary"
                  disabled={selectedMaterials.length === 0}
                  onClick={handleCreateEstimate}
                  icon={<ArrowRight size={16} className="ml-1" />}
                >
                  견적 생성
                </Button>
              </div>
            </CardContent>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Button
        variant="text"
        icon={<ArrowLeft size={16} />}
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        돌아가기
      </Button>
      
      <Card>
        <div className="border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-800">새 견적 작성</h1>
              <div className="text-sm text-gray-500">
                {step}/3 단계
              </div>
            </div>
            
            <div className="flex items-center">
              <div className={`flex items-center ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">고객 선택</span>
              </div>
              
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-teal-500' : 'bg-gray-200'} mx-2`}></div>
              
              <div className={`flex items-center ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">공간 선택</span>
              </div>
              
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-teal-500' : 'bg-gray-200'} mx-2`}></div>
              
              <div className={`flex items-center ${step >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">자재 선택</span>
              </div>
            </div>
          </div>
        </div>
        
        {renderStepContent()}
      </Card>
    </div>
  );
};

export default EstimateFormPage;