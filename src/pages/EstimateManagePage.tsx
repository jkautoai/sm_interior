import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { Plus, Search, Calendar, User, FileText, Trash2, Edit } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const EstimateManagePage: React.FC = () => {
  const { 
    estimates, 
    clients,
    deleteEstimate,
    setCurrentEstimate
  } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const filteredEstimates = estimates
    .filter(estimate => {
      const matchesSearch = !searchTerm || 
        estimate.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estimate.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || estimate.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleNewEstimate = () => {
    navigate('/estimates/new');
  };

  const handleViewEstimate = (estimate: any) => {
    setCurrentEstimate(estimate);
    navigate(`/estimates/${estimate.id}/summary`);
  };

  const handleEditEstimate = (estimate: any) => {
    setCurrentEstimate(estimate);
    navigate(`/estimates/new?estimateId=${estimate.id}`);
  };

  const handleDeleteEstimate = async (estimateId: string) => {
    if (window.confirm('이 견적을 삭제하시겠습니까?')) {
      const result = await deleteEstimate(estimateId);
      if (result.error) {
        alert('견적 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      draft: '임시저장',
      sent: '발송됨',
      approved: '승인됨',
      rejected: '거절됨'
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">견적 관리</h1>
            <p className="text-gray-600 mt-2">작성된 견적을 관리하고 추적하세요</p>
          </div>
          <Button 
            onClick={handleNewEstimate}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 견적 작성
          </Button>
        </div>

        {/* 검색 및 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="고객명 또는 견적 ID로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            label=""
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: '모든 상태' },
              { value: 'draft', label: '임시저장' },
              { value: 'sent', label: '발송됨' },
              { value: 'approved', label: '승인됨' },
              { value: 'rejected', label: '거절됨' }
            ]}
          />
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-teal-600">{estimates.length}</div>
          <div className="text-gray-600">총 견적 수</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">
            {estimates.filter(est => est.status === 'sent').length}
          </div>
          <div className="text-gray-600">발송된 견적</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">
            {estimates.filter(est => est.status === 'approved').length}
          </div>
          <div className="text-gray-600">승인된 견적</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(estimates.reduce((sum, est) => sum + est.totalPrice, 0))}
          </div>
          <div className="text-gray-600">총 견적 금액</div>
        </div>
      </div>

      {/* 견적 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            견적 목록 ({filteredEstimates.length}개)
          </h2>
        </div>
        
        <div className="p-6">
          {filteredEstimates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                {searchTerm || statusFilter ? '검색 결과가 없습니다' : '작성된 견적이 없습니다'}
              </div>
              <Button 
                onClick={handleNewEstimate}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                첫 번째 견적 작성하기
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEstimates.map((estimate) => (
                <Card key={estimate.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {estimate.clientName}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(estimate.status || 'draft')}`}>
                            {getStatusLabel(estimate.status || 'draft')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            견적 ID: {estimate.id.slice(0, 8)}...
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(estimate.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            자재 {estimate.materials.length}개
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="text-xl font-bold text-teal-600">
                            {formatCurrency(estimate.totalPrice)}
                          </div>
                          {estimate.budget && (
                            <div className="text-sm text-gray-500">
                              예산: {formatCurrency(estimate.budget)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEstimate(estimate)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEstimate(estimate)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEstimate(estimate.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstimateManagePage;
