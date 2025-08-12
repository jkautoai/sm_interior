import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ClientCard from '../components/ClientCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Search } from 'lucide-react';

const ClientManagePage: React.FC = () => {
  const { 
    clients, 
    estimates, 
    setCurrentClient
  } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    )
    .sort((a, b) => new Date(b.created_at || b.createdAt || '').getTime() - new Date(a.created_at || a.createdAt || '').getTime());
  
  const getClientEstimates = (clientId: string) => {
    return estimates.filter(estimate => estimate.clientId === clientId);
  };
  
  const handleSelectClient = (client: any) => {
    setCurrentClient(client);
    navigate(`/clients/${client.id}`);
  };
  
  const handleNewEstimate = (client: any) => {
    setCurrentClient(client);
    navigate(`/estimates/new?clientId=${client.id}`);
  };
  
  const handleAddClient = () => {
    navigate('/clients/new');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">고객 관리</h1>
            <p className="text-gray-600 mt-2">등록된 고객 정보를 관리하고 견적을 작성하세요</p>
          </div>
          <Button 
            onClick={handleAddClient}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 고객 추가
          </Button>
        </div>

        {/* 검색 */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="고객명, 주소, 전화번호로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-teal-600">{clients.length}</div>
          <div className="text-gray-600">총 고객 수</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">{estimates.length}</div>
          <div className="text-gray-600">총 견적 수</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">
            {estimates.reduce((sum, est) => sum + est.totalPrice, 0).toLocaleString()}원
          </div>
          <div className="text-gray-600">총 견적 금액</div>
        </div>
      </div>

      {/* 고객 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            고객 목록 ({filteredClients.length}명)
          </h2>
        </div>
        
        <div className="p-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                {searchTerm ? '검색 결과가 없습니다' : '등록된 고객이 없습니다'}
              </div>
              <Button 
                onClick={handleAddClient}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                첫 번째 고객 추가하기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  estimates={getClientEstimates(client.id)}
                  onSelectClient={handleSelectClient}
                  onNewEstimate={handleNewEstimate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagePage;
