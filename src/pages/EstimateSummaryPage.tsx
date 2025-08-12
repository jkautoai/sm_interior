import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import MaterialCard from '../components/MaterialCard';
import BudgetSimulator from '../components/BudgetSimulator';
import EstimatePDF from '../components/EstimatePDF';
import { ArrowLeft, Calculator, Home, FileText } from 'lucide-react';
import { spaceTypeLabels } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';

const EstimateSummaryPage: React.FC = () => {
  const { 
    estimates, 
    clients,
    currentEstimate,
    setCurrentEstimate,
    updateEstimate,
    generateBudgetSimulation,
  } = useAppContext();
  
  const navigate = useNavigate();
  const { estimateId } = useParams<{ estimateId: string }>();
  
  const [estimate, setEstimate] = useState(currentEstimate);
  const [client, setClient] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  
  // Load estimate data
  useEffect(() => {
    if (estimateId) {
      const foundEstimate = estimates.find(e => e.id === estimateId);
      if (foundEstimate) {
        setEstimate(foundEstimate);
        setCurrentEstimate(foundEstimate);
        
        // Find client
        const foundClient = clients.find(c => c.id === foundEstimate.clientId);
        if (foundClient) {
          setClient(foundClient);
        }
        
        // Generate budget simulation if not exists
        if (!foundEstimate.options) {
          generateBudgetSimulation(foundEstimate.id);
        }
      } else {
        navigate('/estimates');
      }
    }
  }, [estimateId, estimates, clients, setCurrentEstimate, generateBudgetSimulation, navigate]);
  
  if (!estimate || !client) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">견적 정보를 불러오는 중입니다...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handleUpdateBudget = (budget: number) => {
    generateBudgetSimulation(estimate.id, budget);
  };
  
  const handleSelectOption = (option: 'premium' | 'standard' | 'economy') => {
    if (!estimate.options) return;
    
    const selectedOption = estimate.options[option];
    const updatedEstimate = {
      ...estimate,
      materials: selectedOption.materials,
      totalPrice: selectedOption.totalPrice,
    };
    
    updateEstimate(updatedEstimate);
  };
  
  const handleGeneratePdf = () => {
    setShowPdf(true);
  };
  
  const handleDownloadPdf = () => {
    alert('PDF 다운로드 기능이 구현됩니다.');
  };
  
  const handleSendPdf = () => {
    alert('PDF 이메일 전송 기능이 구현됩니다.');
  };
  
  const handlePrintPdf = () => {
    alert('PDF 인쇄 기능이 구현됩니다.');
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
      
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-2/3">
          {showPdf ? (
            <EstimatePDF 
              estimate={estimate}
              client={client}
              onDownload={handleDownloadPdf}
              onSend={handleSendPdf}
              onPrint={handlePrintPdf}
            />
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-800 mb-1">
                      견적 요약
                    </h1>
                    <p className="text-gray-500 text-sm">
                      고객: {client.name} | 작성일: {new Date(estimate.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      icon={<Home size={16} />}
                      onClick={() => navigate('/')}
                    >
                      홈으로
                    </Button>
                    
                    <Button 
                      variant="primary" 
                      size="sm"
                      icon={<FileText size={16} />}
                      onClick={handleGeneratePdf}
                    >
                      PDF 견적서
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">고객명</p>
                        <p className="font-medium">{client.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">연락처</p>
                        <p className="font-medium">{client.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">시공 주소</p>
                        <p className="font-medium">{client.address}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">시공 공간</p>
                      <div className="flex flex-wrap gap-2">
                        {estimate.spaces.map(space => (
                          <span 
                            key={space.id}
                            className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                          >
                            {spaceTypeLabels[space.name]}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-gray-500">총 견적 금액</p>
                        <p className="text-xl font-semibold text-teal-700">{formatCurrency(estimate.totalPrice)}</p>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        총 {estimate.materials.length}개 자재 포함
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <BudgetSimulator
                estimate={estimate}
                onUpdateBudget={handleUpdateBudget}
                onSelectOption={handleSelectOption}
              />
              
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-800">선택된 자재 ({estimate.materials.length})</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {estimate.materials.map(material => (
                      <MaterialCard
                        key={material.id}
                        material={material}
                        showQuantity
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        <div className="w-full md:w-1/3 sticky top-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-800">빠른 작업</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  icon={<Calculator size={16} />}
                  onClick={() => setShowPdf(false)}
                >
                  견적 시뮬레이션
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  icon={<FileText size={16} />}
                  onClick={handleGeneratePdf}
                >
                  견적서 PDF 보기
                </Button>
                
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handlePrintPdf}
                >
                  견적서 인쇄/저장
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">고객 정보</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">이름:</span> {client.name}</p>
                  <p><span className="text-gray-500">연락처:</span> {client.phone}</p>
                  <p><span className="text-gray-500">주소:</span> {client.address}</p>
                  {client.notes && (
                    <div>
                      <p className="text-gray-500">요청사항:</p>
                      <p className="mt-1 bg-gray-50 p-2 rounded text-xs">{client.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">견적 요약</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">작성일:</span> {new Date(estimate.createdAt).toLocaleDateString('ko-KR')}</p>
                  <p><span className="text-gray-500">최종 수정일:</span> {new Date(estimate.updatedAt).toLocaleDateString('ko-KR')}</p>
                  <p><span className="text-gray-500">공간:</span> {estimate.spaces.length}개</p>
                  <p><span className="text-gray-500">자재:</span> {estimate.materials.length}개</p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">총 금액:</span>
                    <span className="font-semibold">{formatCurrency(estimate.totalPrice)}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EstimateSummaryPage;