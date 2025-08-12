import React from 'react';
import { Material, EstimateMaterial } from '../types';
import Card, { CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { formatCurrency } from '../utils/helpers';
import { materialCategoryLabels } from '../data/mockData';
import { Plus, Check, X } from 'lucide-react';

interface MaterialCardProps {
  material: Material | EstimateMaterial;
  isSelected?: boolean;
  onSelect?: (material: Material) => void;
  onRemove?: (materialId: string) => void;
  showQuantity?: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  isSelected = false,
  onSelect,
  onRemove,
  showQuantity = false,
}) => {
  const isEstimateMaterial = 'quantity' in material;
  
  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={material.image_url} 
          alt={material.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 p-2">
          <span className="inline-block bg-teal-700 text-white px-2 py-1 text-xs font-semibold rounded">
            {materialCategoryLabels[material.category]}
          </span>
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 bg-teal-500 text-white p-1 rounded-full">
            <Check size={16} />
          </div>
        )}
      </div>
      
      <CardContent className="flex-1">
        <h3 className="font-medium text-gray-900 mb-1">{material.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{material.brand}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-gray-500">소재:</span>
            <span className="ml-1 text-gray-700">{material.material}</span>
          </div>
          <div>
            <span className="text-gray-500">색상:</span>
            <span className="ml-1 text-gray-700">{material.color}</span>
          </div>
        </div>
        
        <div className="mt-2">
          <span className="block text-gray-500 text-sm">단가:</span>
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(material.price_per_unit)}
            <span className="text-sm text-gray-500 font-normal ml-1">/ {material.unit}</span>
          </span>
        </div>
        
        {isEstimateMaterial && showQuantity && (
          <div className="mt-3 bg-gray-50 p-2 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">수량/면적:</span>
              <span className="font-medium">{material.quantity} {material.unit}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-600">금액:</span>
              <span className="font-semibold text-teal-700">{formatCurrency(material.totalPrice)}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50">
        {onSelect && !isSelected && (
          <Button 
            variant="primary" 
            fullWidth
            icon={<Plus size={16} />}
            onClick={() => onSelect(material)}
          >
            자재 선택
          </Button>
        )}
        
        {onRemove && isSelected && (
          <Button 
            variant="outline" 
            fullWidth
            icon={<X size={16} />}
            onClick={() => onRemove(material.id)}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            제거
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MaterialCard;