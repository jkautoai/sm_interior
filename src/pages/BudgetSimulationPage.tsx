import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMaterials, spaceTypeLabels } from '../data/mockData';
import { Space, SpaceType, Material } from '../types';

interface SimulationOption {
  name: string;
  materials: {
    id: string;
    name: string;
    category: string;
    pricePerUnit: number;
    unit: string;
    quantity: number;
    totalPrice: number;
  }[];
  totalPrice: number;
}

// 예산 시뮬레이션에 사용할 기본 공간
const simulationSpaces: Space[] = [
  { id: '1', name: 'bathroom', selected: false },
  { id: '2', name: 'kitchen', selected: false },
  { id: '3', name: 'livingRoom', selected: false },
  { id: '4', name: 'bedroom', selected: false },
];

// 공간별 적정 면적 (평 단위)
const spaceAreas: Record<SpaceType, number> = {
  bathroom: 3,
  kitchen: 5,
  livingRoom: 10,
  bedroom: 8,
  diningRoom: 6,
  office: 5,
  hallway: 2,
  other: 4
};

// 최소 및 최대 예산 설정
const MIN_BUDGET = 5000000; // 500만원
const MAX_BUDGET = 30000000; // 3,000만원
const STEP_BUDGET = 100000; // 10만원 단위

const BudgetSimulationPage: React.FC = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState<number>(10000000); // 1,000만원 기본값
  const [spaces, setSpaces] = useState<Space[]>(simulationSpaces);
  const [consultingNote, setConsultingNote] = useState<string>('');
  const [options, setOptions] = useState<{
    premium: SimulationOption;
    standard: SimulationOption;
    economy: SimulationOption;
  }>({
    premium: { name: '고급형', materials: [], totalPrice: 0 },
    standard: { name: '일반형', materials: [], totalPrice: 0 },
    economy: { name: '절약형', materials: [], totalPrice: 0 }
  });
  const [selectedOption, setSelectedOption] = useState<'premium' | 'standard' | 'economy'>('standard');

  // 예산과 선택된 공간에 따라 자재 조합 추천
  useEffect(() => {
    const selectedSpaces = spaces.filter(space => space.selected);
    
    if (selectedSpaces.length === 0) {
      return;
    }

    // 예산 분배 - 선택된 공간에 따라 예산 분배 (간단한 구현)
    const totalArea = selectedSpaces.reduce((sum, space) => sum + spaceAreas[space.name], 0);
    const budgetPerArea = budget / totalArea;

    // 각 옵션별 자재 리스트 생성
    const newOptions = {
      premium: { name: '고급형', materials: [], totalPrice: 0 },
      standard: { name: '일반형', materials: [], totalPrice: 0 },
      economy: { name: '절약형', materials: [], totalPrice: 0 }
    };

    // 각 공간별로 자재 할당
    selectedSpaces.forEach(space => {
      // 각 공간별로 필요한 자재 카테고리 선택 (간단한 매핑)
      const categories = getSpaceCategories(space.name);
      
      categories.forEach(category => {
        // 카테고리별 적합한 자재 선택
        const materialsInCategory = mockMaterials.filter(m => m.category === category);
        
        // 자재 없으면 스킵
        if (materialsInCategory.length === 0) return;
        
        // 가격별 정렬
        const sortedMaterials = [...materialsInCategory].sort((a, b) => b.pricePerUnit - a.pricePerUnit);
        
        // 등급별 자재 선택
        const premiumMaterial = sortedMaterials[0] || null;
        const standardMaterial = sortedMaterials[Math.floor(sortedMaterials.length / 2)] || null;
        const economyMaterial = sortedMaterials[sortedMaterials.length - 1] || null;
        
        // 필요한 수량 계산 (단순화)
        const quantity = spaceAreas[space.name];
        
        // 각 등급별 자재 추가
        if (premiumMaterial) {
          const totalPrice = premiumMaterial.pricePerUnit * quantity;
          newOptions.premium.materials.push({
            id: premiumMaterial.id,
            name: premiumMaterial.name,
            category: category,
            pricePerUnit: premiumMaterial.pricePerUnit,
            unit: premiumMaterial.unit,
            quantity,
            totalPrice
          });
          newOptions.premium.totalPrice += totalPrice;
        }
        
        if (standardMaterial) {
          const totalPrice = standardMaterial.pricePerUnit * quantity;
          newOptions.standard.materials.push({
            id: standardMaterial.id,
            name: standardMaterial.name,
            category: category,
            pricePerUnit: standardMaterial.pricePerUnit,
            unit: standardMaterial.unit,
            quantity,
            totalPrice
          });
          newOptions.standard.totalPrice += totalPrice;
        }
        
        if (economyMaterial) {
          const totalPrice = economyMaterial.pricePerUnit * quantity;
          newOptions.economy.materials.push({
            id: economyMaterial.id,
            name: economyMaterial.name,
            category: category,
            pricePerUnit: economyMaterial.pricePerUnit,
            unit: economyMaterial.unit,
            quantity,
            totalPrice
          });
          newOptions.economy.totalPrice += totalPrice;
        }
      });
    });
    
    setOptions(newOptions);
  }, [budget, spaces]);

  // 공간에 필요한 자재 카테고리 반환
  const getSpaceCategories = (spaceType: SpaceType): string[] => {
    switch(spaceType) {
      case 'bathroom':
        return ['tile', 'fixture', 'lighting'];
      case 'kitchen':
        return ['countertop', 'cabinet', 'appliance', 'lighting'];
      case 'livingRoom':
        return ['flooring', 'wallpaper', 'lighting', 'furniture'];
      case 'bedroom':
        return ['flooring', 'wallpaper', 'lighting', 'furniture'];
      default:
        return ['flooring', 'wallpaper', 'lighting'];
    }
  };

  // 예산 입력 변경 핸들러
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= MIN_BUDGET && value <= MAX_BUDGET) {
      setBudget(value);
    }
  };

  // 슬라이더 변경 핸들러
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(Number(e.target.value));
  };

  // 공간 선택 핸들러
  const handleSpaceToggle = (spaceId: string) => {
    setSpaces(spaces.map(space => 
      space.id === spaceId ? { ...space, selected: !space.selected } : space
    ));
  };

  // 조합 저장 핸들러
  const handleSaveOption = () => {
    const selectedData = {
      option: selectedOption,
      materials: options[selectedOption].materials,
      totalPrice: options[selectedOption].totalPrice,
      budget,
      consultingNote,
      selectedSpaces: spaces.filter(space => space.selected),
      timestamp: new Date().toISOString()
    };
    
    // 콘솔에 출력 (실제로는 API 호출 또는 상태 관리를 통해 저장)
    console.log('저장된 시뮬레이션 데이터:', selectedData);
    
    // 간단한 성공 메시지
    alert('선택한 조합이 저장되었습니다.');
  };

  // 다음 단계로 이동
  const handleNext = () => {
    // 단순하게 견적서 페이지로 이동
    navigate('/estimate-preview');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">자동 예산 시뮬레이션</h1>
        <p className="text-gray-600">
          예산과 공간 우선순위를 설정하면 최적의 자재 조합을 자동으로 추천해드립니다.
        </p>
      </div>

      {/* 예산 설정 섹션 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">1. 예산 설정</h2>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="budget" className="font-medium text-gray-700">
              예산 (원)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="budget"
                min={MIN_BUDGET}
                max={MAX_BUDGET}
                step={STEP_BUDGET}
                value={budget}
                onChange={handleBudgetChange}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <span className="text-gray-500 font-medium">{budget.toLocaleString()}원</span>
            </div>
          </div>
          <input
            type="range"
            min={MIN_BUDGET}
            max={MAX_BUDGET}
            step={STEP_BUDGET}
            value={budget}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{MIN_BUDGET.toLocaleString()}원</span>
            <span>{MAX_BUDGET.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 공간 우선순위 선택 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">2. 공간 우선순위 선택</h2>
        <div className="flex flex-wrap gap-2">
          {spaces.map(space => (
            <button
              key={space.id}
              onClick={() => handleSpaceToggle(space.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${space.selected
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {spaceTypeLabels[space.name]}
            </button>
          ))}
        </div>
      </div>

      {/* 자재 구성 추천 테이블 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">3. 자재 구성 추천</h2>
        {spaces.filter(space => space.selected).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            공간을 하나 이상 선택해주세요
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    구분
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    고급형
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    일반형
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    절약형
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    총 예상 비용
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {options.premium.totalPrice.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {options.standard.totalPrice.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {options.economy.totalPrice.toLocaleString()}원
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    적합 예산
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(options.premium.totalPrice * 0.9).toLocaleString()}원 ~
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(options.standard.totalPrice * 0.9).toLocaleString()}원 ~
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(options.economy.totalPrice * 0.9).toLocaleString()}원 ~
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    선택
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="radio"
                      name="option"
                      checked={selectedOption === 'premium'}
                      onChange={() => setSelectedOption('premium')}
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="radio"
                      name="option"
                      checked={selectedOption === 'standard'}
                      onChange={() => setSelectedOption('standard')}
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="radio"
                      name="option"
                      checked={selectedOption === 'economy'}
                      onChange={() => setSelectedOption('economy')}
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 자재 상세 리스트 */}
      {selectedOption && options[selectedOption].materials.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">선택한 자재 구성: {options[selectedOption].name}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    자재명
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    분류
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    단가
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수량
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {options[selectedOption].materials.map((material, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.pricePerUnit.toLocaleString()}원/{material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.quantity} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.totalPrice.toLocaleString()}원
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    합계
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-700">
                    {options[selectedOption].totalPrice.toLocaleString()}원
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 고객 상담 메모 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">4. 고객 상담 메모</h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          rows={4}
          placeholder="상담 중 받은 고객 요청사항을 입력하세요. (예: 밝은 톤 선호 / 세탁기 공간 필요 등)"
          value={consultingNote}
          onChange={(e) => setConsultingNote(e.target.value)}
        ></textarea>
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          onClick={handleSaveOption}
          className="px-6 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          disabled={spaces.filter(space => space.selected).length === 0}
        >
          이 조합 저장
        </button>
        
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          disabled={spaces.filter(space => space.selected).length === 0}
        >
          견적서 미리보기
        </button>
      </div>
    </div>
  );
};

export default BudgetSimulationPage; 