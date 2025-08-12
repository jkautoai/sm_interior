import React from 'react';
import { ArrowLeft, Download, Share, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockClients } from '../data/mockData';

const EstimatePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
  
  // 이전 페이지로 이동
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // 인쇄 핸들러
  const handlePrint = () => {
    window.print();
  };

  // 테스트용 고객 데이터 (실제로는 시뮬레이션에서 선택한 데이터를 사용)
  const customer = mockClients[0];

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* 상단 메뉴 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button 
              className="flex items-center text-gray-600 hover:text-gray-900"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>돌아가기</span>
            </button>
          </div>
          <h1 className="text-xl font-bold">견적서 미리보기</h1>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1" />
              <span>PDF 다운로드</span>
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Share className="h-4 w-4 mr-1" />
              <span>이메일 전송</span>
            </button>
            <button 
              className="flex items-center px-3 py-2 bg-teal-600 rounded-md text-sm font-medium text-white hover:bg-teal-700"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-1" />
              <span>인쇄</span>
            </button>
          </div>
        </div>

        {/* 견적서 내용 */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          {/* 견적서 헤더 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">인테리어 견적서</h2>
                <p className="text-gray-600 text-sm">견적번호: EST-0AIN01UU</p>
                <p className="text-gray-600 text-sm">작성일: {formattedDate}</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-medium text-teal-700">인테리어 견적마스터</h3>
                <p className="text-gray-600 text-sm">서울특별시 강남구 테헤란로 123</p>
                <p className="text-gray-600 text-sm">전화: 02-123-4567</p>
                <p className="text-gray-600 text-sm">이메일: contact@estimatemaster.kr</p>
              </div>
            </div>
          </div>

          {/* 고객 정보 */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">고객 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">고객명</p>
                <p className="text-gray-900">{customer.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">연락처</p>
                <p className="text-gray-900">{customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">시공 주소</p>
                <p className="text-gray-900">{customer.address}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">요청사항</p>
                <p className="text-gray-900">{customer.notes}</p>
              </div>
            </div>
          </div>

          {/* 시공 공간 */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">시공 공간</h3>
            <div className="flex flex-wrap">
              <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                주방
              </span>
            </div>
          </div>

          {/* 자재 내역 */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">자재 내역</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      구분
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      자재명
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      단가
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      수량/규격
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      금액
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      바닥재
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>강화 마루</div>
                      <div className="text-xs text-gray-500">홍송 자연마루 / 밝은색</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ₩45,000/평
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      1 평
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₩45,000
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      바닥재
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>프리미엄 원목 마루</div>
                      <div className="text-xs text-gray-500">프리미엄 / 내추럴 오크</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ₩85,000/평
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      1 평
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₩85,000
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                      총 견적금액
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-teal-700">
                      ₩130,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 견적 조건 및 유의사항 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">견적 조건 및 유의사항</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>본 견적은 작성일로부터 30일간 유효합니다.</li>
            <li>자재 가격은 시장 상황에 따라 변동될 수 있습니다.</li>
            <li>시공 일정은 계약 후 협의하여 결정됩니다.</li>
            <li>계약 금액 중 자재 발주 시 계약 금액의 50% 지불, 완공 시 잔금 지불.</li>
            <li>견적에 포함되지 않은 비용: 페기물 처리, 인허가 비용, 추가재 비용</li>
          </ul>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center mb-8">
          <button 
            className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            onClick={handlePrint}
          >
            견적서 인쇄 및 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimatePreviewPage; 