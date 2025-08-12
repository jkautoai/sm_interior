import React, { useRef } from 'react';
import { Estimate, Client } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import Button from './ui/Button';
import Card, { CardContent, CardHeader } from './ui/Card';
import { Download, Printer, Send, FileText } from 'lucide-react';
import { spaceTypeLabels, materialCategoryLabels } from '../data/mockData';

interface EstimatePDFProps {
  estimate: Estimate;
  client: Client;
  onDownload: () => void;
  onSend: () => void;
  onPrint: () => void;
}

const EstimatePDF: React.FC<EstimatePDFProps> = ({
  estimate,
  client,
  onDownload,
  onSend,
  onPrint,
}) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="mb-6">
      <Card className="mb-4">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">견적서 미리보기</h2>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              icon={<Download size={16} />}
              onClick={onDownload}
            >
              PDF 다운로드
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              icon={<Send size={16} />}
              onClick={onSend}
            >
              이메일 전송
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              icon={<Printer size={16} />}
              onClick={onPrint}
            >
              인쇄
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="max-w-4xl mx-auto" ref={pdfRef}>
              {/* PDF Content Preview */}
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">인테리어 견적서</h1>
                    <p className="text-gray-500 text-sm">
                      견적번호: EST-{estimate.id.substring(0, 8).toUpperCase()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      작성일: {formatDate(estimate.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-teal-700 mb-1">인테리어 견적마스터</div>
                    <p className="text-gray-500 text-sm">서울특별시 강남구 테헤란로 123</p>
                    <p className="text-gray-500 text-sm">전화: 02-123-4567</p>
                    <p className="text-gray-500 text-sm">이메일: contact@estimatemaster.kr</p>
                  </div>
                </div>
                
                {/* Client Information */}
                <div className="py-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">고객 정보</h2>
                  <div className="grid grid-cols-2 gap-4">
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
                    {client.notes && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-1">요청사항</p>
                        <p className="text-sm bg-gray-50 p-2 rounded">{client.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Construction Spaces */}
                <div className="py-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">시공 공간</h2>
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
                
                {/* Materials Table */}
                <div className="py-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">자재 내역</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">자재명</th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">단가</th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수량/면적</th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {estimate.materials.map((material, index) => (
                          <tr key={material.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm text-gray-500">{materialCategoryLabels[material.category]}</td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{material.name}</div>
                              <div className="text-xs text-gray-500">{material.brand} / {material.color}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {formatCurrency(material.pricePerUnit)}/{material.unit}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{material.quantity} {material.unit}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(material.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">총 견적금액</td>
                          <td className="px-4 py-3 text-base font-bold text-teal-700">{formatCurrency(estimate.totalPrice)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                {/* Terms & Conditions */}
                <div className="py-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">견적 조건 및 유의사항</h2>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• 본 견적은 작성일로부터 30일간 유효합니다.</li>
                    <li>• 자재 가격은 시장 상황에 따라 변동될 수 있습니다.</li>
                    <li>• 시공 일정은 계약 체결 후 협의하여 결정됩니다.</li>
                    <li>• 추가 공사 및 자재 변경 시 견적 금액이 조정될 수 있습니다.</li>
                    <li>• 견적에 포함되지 않은 비용: 폐기물 처리비, 인허가 비용, 부가세 10%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button 
          variant="primary"
          size="lg"
          icon={<FileText size={18} />}
          onClick={onPrint}
        >
          견적서 인쇄 및 저장
        </Button>
      </div>
    </div>
  );
};

export default EstimatePDF;