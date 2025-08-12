import React from 'react';
import { Client, Estimate } from '../types';
import Card, { CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { formatDate } from '../utils/helpers';
import { Phone, MapPin, FileText } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  estimates?: Estimate[];
  onSelectClient: (client: Client) => void;
  onNewEstimate: (client: Client) => void;
  onViewEstimate?: (estimate: Estimate) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  estimates = [],
  onSelectClient,
  onNewEstimate,
  onViewEstimate,
}) => {
  const latestEstimate = estimates.length > 0
    ? estimates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;
  
  return (
    <Card 
      hoverable 
      onClick={() => onSelectClient(client)}
      className="h-full flex flex-col"
    >
      <CardContent className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
          <span className="text-sm text-gray-500">{formatDate(client.createdAt)}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Phone size={16} className="mr-2 text-gray-400" />
            {client.phone}
          </div>
          <div className="flex items-start text-sm text-gray-600">
            <MapPin size={16} className="mr-2 mt-1 flex-shrink-0 text-gray-400" />
            <span>{client.address}</span>
          </div>
        </div>
        
        {client.notes && (
          <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm text-gray-600">
            <p className="line-clamp-3">{client.notes}</p>
          </div>
        )}
        
        {latestEstimate && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <FileText size={16} className="mr-2 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">최근 견적</span>
            </div>
            <div 
              className="p-3 bg-teal-50 rounded-md cursor-pointer hover:bg-teal-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewEstimate) onViewEstimate(latestEstimate);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-800">
                  {latestEstimate.spaces.filter(s => s.selected).length}개 공간 / 
                  {latestEstimate.materials.length}개 자재
                </span>
                <span className="text-sm font-semibold text-teal-700">
                  {new Intl.NumberFormat('ko-KR').format(latestEstimate.totalPrice)}원
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(latestEstimate.updatedAt)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50">
        <Button 
          variant="primary" 
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onNewEstimate(client);
          }}
        >
          + 새 견적 작성
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;