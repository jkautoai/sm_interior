import React from 'react';
import { useAppContext } from '../context/AppContext';
import { spaceTypeLabels, materialCategoryLabels } from '../data/mockData';

const DataView: React.FC = () => {
  const { clients, materials, estimates } = useAppContext();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">데이터 뷰</h1>
      
      {/* 고객 정보 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">고객 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(clients || []).map((client) => (
            <div key={client.id} className="border p-4 rounded-lg shadow">
              <h3 className="font-bold">{client.name}</h3>
              <p>전화: {client.phone}</p>
              <p>주소: {client.address}</p>
              <p>메모: {client.notes}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 자재 정보 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">자재 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(materials || []).map((material) => (
            <div key={material.id} className="border p-4 rounded-lg shadow">
              <h3 className="font-bold">{material.name}</h3>
              <p>카테고리: {materialCategoryLabels[material.category]}</p>
              <p>브랜드: {material.brand}</p>
              <p>가격: {material.price_per_unit.toLocaleString()}원/{material.unit}</p>
              <img 
                src={material.image_url} 
                alt={material.name}
                className="w-full h-48 object-cover mt-2 rounded"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 견적 정보 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">견적 정보</h2>
        <div className="grid grid-cols-1 gap-4">
          {(estimates || []).map((estimate) => (
            <div key={estimate.id} className="border p-4 rounded-lg shadow">
              <h3 className="font-bold">견적 ID: {estimate.id}</h3>
              <p>고객명: {estimate.clientName}</p>
              <p>총 견적 금액: {estimate.totalPrice.toLocaleString()}원</p>
              <p>예산: {estimate.budget?.toLocaleString() || '미설정'}원</p>
              
              <div className="mt-4">
                <h4 className="font-semibold">선택된 공간:</h4>
                <ul className="list-disc pl-5">
                  {estimate.spaces
                    .filter(space => space.selected)
                    .map(space => (
                      <li key={space.id}>{spaceTypeLabels[space.name]}</li>
                    ))}
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold">선택된 자재:</h4>
                <ul className="list-disc pl-5">
                  {estimate.materials.map((material, index) => (
                    <li key={index}>
                      {material.name} - {material.quantity}{material.unit} 
                      ({material.totalPrice.toLocaleString()}원)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DataView; 