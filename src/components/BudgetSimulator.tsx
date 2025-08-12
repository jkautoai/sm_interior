import React, { useState } from 'react';
import { Estimate, EstimateMaterial } from '../types';
import { formatCurrency } from '../utils/helpers';
import Card, { CardContent, CardHeader } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface BudgetSimulatorProps {
  estimate: Estimate;
  onUpdateBudget: (budget: number) => void;
  onSelectOption: (option: 'premium' | 'standard' | 'economy') => void;
}

const BudgetSimulator: React.FC<BudgetSimulatorProps> = ({
  estimate,
  onUpdateBudget,
  onSelectOption,
}) => {
  const [budget, setBudget] = useState<string>(estimate.budget?.toString() || '');
  const options = estimate.options;
  
  const handleBudgetUpdate = () => {
    const numericBudget = parseInt(budget, 10);
    if (!isNaN(numericBudget) && numericBudget > 0) {
      onUpdateBudget(numericBudget);
    }
  };
  
  if (!options) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-800">예산 시뮬레이션</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-gray-600 mb-4">
            <AlertCircle size={18} className="text-amber-500 mr-2" />
            <p className="text-sm">자재를 선택하고 예산을 입력하여 시뮬레이션을 실행하세요.</p>
          </div>
          
          <div className="flex items-end gap-3 mb-4">
            <Input
              label="예산 입력"
              type="number"
              placeholder="원하는 예산을 입력하세요"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              fullWidth
            />
            <Button onClick={handleBudgetUpdate} className="mb-4">
              시뮬레이션
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const premiumBudgetGap = estimate.budget 
    ? options.premium.totalPrice - estimate.budget
    : 0;
  
  const renderMaterials = (materials: EstimateMaterial[]) => {
    const totalCount = materials.length;
    
    // Display only first 3 materials and show a count for the rest
    const visibleMaterials = materials.slice(0, 3);
    const hiddenCount = totalCount - visibleMaterials.length;
    
    return (
      <>
        <div className="space-y-2 mb-3">
          {visibleMaterials.map((mat) => (
            <div key={mat.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{mat.name}</span>
              <span className="font-medium">{formatCurrency(mat.totalPrice)}</span>
            </div>
          ))}
        </div>
        
        {hiddenCount > 0 && (
          <p className="text-xs text-gray-500 italic mt-1">외 {hiddenCount}개 자재</p>
        )}
      </>
    );
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">예산 시뮬레이션</h2>
        
        <div className="flex items-end gap-3">
          <Input
            label="예산 변경"
            type="number"
            placeholder="원하는 예산을 입력하세요"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="text-sm"
          />
          <Button onClick={handleBudgetUpdate} size="sm">
            업데이트
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Premium Option */}
          <div className={`
            border rounded-lg p-4 
            ${premiumBudgetGap > 0 
              ? 'border-amber-300 bg-amber-50' 
              : 'border-teal-300 bg-teal-50'
            }
          `}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">프리미엄</h3>
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(options.premium.totalPrice)}
              </span>
            </div>
            
            {renderMaterials(options.premium.materials)}
            
            {estimate.budget && (
              <div className="mt-3 text-sm">
                {premiumBudgetGap > 0 ? (
                  <p className="text-amber-700">
                    예산 초과: {formatCurrency(premiumBudgetGap)}
                  </p>
                ) : (
                  <p className="text-teal-700">
                    예산 내 시공 가능
                  </p>
                )}
              </div>
            )}
            
            <Button
              variant="primary"
              fullWidth
              onClick={() => onSelectOption('premium')}
              className="mt-3"
            >
              프리미엄 선택
            </Button>
          </div>
          
          {/* Standard Option */}
          <div className="border border-blue-300 bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">스탠다드</h3>
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(options.standard.totalPrice)}
              </span>
            </div>
            
            {renderMaterials(options.standard.materials)}
            
            {estimate.budget && (
              <div className="mt-3 text-sm">
                {options.standard.totalPrice > estimate.budget ? (
                  <p className="text-amber-700">
                    예산 초과: {formatCurrency(options.standard.totalPrice - estimate.budget)}
                  </p>
                ) : (
                  <p className="text-teal-700">
                    예산 내 시공 가능
                  </p>
                )}
              </div>
            )}
            
            <Button
              variant="primary"
              fullWidth
              onClick={() => onSelectOption('standard')}
              className="mt-3"
            >
              스탠다드 선택
            </Button>
          </div>
          
          {/* Economy Option */}
          <div className="border border-green-300 bg-green-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">이코노미</h3>
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(options.economy.totalPrice)}
              </span>
            </div>
            
            {renderMaterials(options.economy.materials)}
            
            {estimate.budget && (
              <div className="mt-3 text-sm">
                {options.economy.totalPrice > estimate.budget ? (
                  <p className="text-amber-700">
                    예산 초과: {formatCurrency(options.economy.totalPrice - estimate.budget)}
                  </p>
                ) : (
                  <p className="text-teal-700">
                    예산 안정: {formatCurrency(estimate.budget - options.economy.totalPrice)} 절약
                  </p>
                )}
              </div>
            )}
            
            <Button
              variant="primary"
              fullWidth
              onClick={() => onSelectOption('economy')}
              className="mt-3"
            >
              이코노미 선택
            </Button>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">안내사항</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-start">
              <ArrowRight size={12} className="mr-1 mt-1 flex-shrink-0" />
              <span>프리미엄: 최고급 자재와 브랜드로 구성된 최상의 품질</span>
            </li>
            <li className="flex items-start">
              <ArrowRight size={12} className="mr-1 mt-1 flex-shrink-0" />
              <span>스탠다드: 합리적인 가격의 중급 자재로 구성된 균형있는 선택</span>
            </li>
            <li className="flex items-start">
              <ArrowRight size={12} className="mr-1 mt-1 flex-shrink-0" />
              <span>이코노미: 가장 경제적인 자재로 기본 기능을 충족하는 선택</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSimulator;