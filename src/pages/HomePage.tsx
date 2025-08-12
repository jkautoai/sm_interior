import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ClientCard from '../components/ClientCard';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { Plus, Search, Sparkles, FileText, Database } from 'lucide-react';

const HomePage: React.FC = () => {
  const { 
    clients, 
    estimates, 
    setCurrentClient, 
    setCurrentEstimate 
  } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase())
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
  
  const handleViewEstimate = (estimate: any) => {
    setCurrentEstimate(estimate);
    navigate(`/estimates/${estimate.id}`);
  };
  
  const handleAddClient = () => {
    navigate('/clients/new');
  };

  const handleStartBudgetSimulation = () => {
    navigate('/budget-simulation');
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">인테리어 견적마스터</h1>
        <p className="text-gray-600">
          AI 기반 인테리어 견적 자동화 시스템으로 효율적인 견적 작성과 관리가 가능합니다.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-teal-700 to-teal-900 text-white">
          <CardContent className="py-6">
            <Sparkles className="h-8 w-8 mb-4" />
            <h2 className="text-xl font-bold mb-2">자동 예산 시뮬레이션</h2>
            <p className="text-teal-100 mb-4">
              고객의 예산에 맞는 최적의 자재 조합을 AI가 자동으로 추천합니다.
            </p>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/10"
              onClick={handleStartBudgetSimulation}
            >
              시작하기
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-700 to-slate-900 text-white">
          <CardContent className="py-6">
            <FileText className="h-8 w-8 mb-4" />
            <h2 className="text-xl font-bold mb-2">PDF 견적서 자동 생성</h2>
            <p className="text-slate-100 mb-4">
              전문적인 견적서를 자동으로 생성하고 고객에게 즉시 공유할 수 있습니다.
            </p>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              샘플 보기
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-600 to-amber-800 text-white">
          <CardContent className="py-6">
            <Database className="h-8 w-8 mb-4" />
            <h2 className="text-xl font-bold mb-2">자재 데이터베이스</h2>
            <p className="text-amber-100 mb-4">
              최신 인테리어 자재 정보와 가격을 실시간으로 확인하고 견적에 반영합니다.
            </p>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              자재 둘러보기
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">고객 목록</h2>
        <Button 
          variant="primary" 
          icon={<Plus size={16} />}
          onClick={handleAddClient}
        >
          신규 고객 등록
        </Button>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="고객명 또는 주소로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">등록된 고객이 없습니다.</p>
            <Button 
              variant="primary" 
              icon={<Plus size={16} />}
              onClick={handleAddClient}
            >
              신규 고객 등록
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              estimates={getClientEstimates(client.id)}
              onSelectClient={handleSelectClient}
              onNewEstimate={handleNewEstimate}
              onViewEstimate={handleViewEstimate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;