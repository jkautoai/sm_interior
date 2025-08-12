import { Client, Material, Estimate, Space, SpaceType, MaterialCategory } from '../types';

// Mock Clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: '김지민',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 152',
    notes: '욕실 및 주방 리모델링 요청',
    createdAt: '2023-09-15T09:30:00.000Z',
  },
  {
    id: '2',
    name: '이서연',
    phone: '010-5678-1234',
    address: '서울시 마포구 와우산로 94',
    notes: '전체 인테리어 공사, 9월 중순 완공 희망',
    createdAt: '2023-09-10T14:20:00.000Z',
  },
  {
    id: '3',
    name: '박준호',
    phone: '010-9876-5432',
    address: '경기도 성남시 분당구 판교역로 235',
    notes: '거실 및 침실 바닥재 교체 문의',
    createdAt: '2023-09-05T11:45:00.000Z',
  },
];

// Available spaces
export const availableSpaces: Space[] = [
  { id: '1', name: 'bathroom', selected: false },
  { id: '2', name: 'kitchen', selected: false },
  { id: '3', name: 'livingRoom', selected: false },
  { id: '4', name: 'bedroom', selected: false },
  { id: '5', name: 'diningRoom', selected: false },
  { id: '6', name: 'office', selected: false },
  { id: '7', name: 'hallway', selected: false },
  { id: '8', name: 'other', selected: false },
];

// Space type labels in Korean
export const spaceTypeLabels: Record<SpaceType, string> = {
  bathroom: '욕실',
  kitchen: '주방',
  livingRoom: '거실',
  bedroom: '침실',
  diningRoom: '식당',
  office: '서재/작업실',
  hallway: '현관/복도',
  other: '기타',
};

// Material category labels in Korean
export const materialCategoryLabels: Record<MaterialCategory, string> = {
  flooring: '바닥재',
  tile: '타일',
  wallpaper: '벽지',
  paint: '페인트',
  lighting: '조명',
  fixture: '수전/설비',
  furniture: '가구',
  appliance: '가전',
  countertop: '싱크대/상판',
  cabinet: '수납장/선반',
  other: '기타',
};

// Mock Materials
export const mockMaterials: Material[] = [
  // Flooring
  {
    id: 'f1',
    category: 'flooring',
    name: '프리미엄 원목 마루',
    brand: '한솔 홈데코',
    material: '천연 원목',
    color: '내추럴 오크',
    pricePerUnit: 85000,
    unit: '평',
    imageUrl: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg',
    description: '고급 원목 소재의 프리미엄 마루, 내구성과 디자인 우수',
  },
  {
    id: 'f2',
    category: 'flooring',
    name: '강화 마루',
    brand: '동화 자연마루',
    material: '합판',
    color: '월넛',
    pricePerUnit: 45000,
    unit: '평',
    imageUrl: 'https://images.pexels.com/photos/953240/pexels-photo-953240.jpeg',
    description: '가성비 좋은 강화 마루, 내수성 우수',
  },
  {
    id: 'f3',
    category: 'flooring',
    name: 'PVC 마루',
    brand: 'LG 하우시스',
    material: 'PVC',
    color: '그레이 애쉬',
    pricePerUnit: 32000,
    unit: '평',
    imageUrl: 'https://images.pexels.com/photos/921294/pexels-photo-921294.jpeg',
    description: '수분에 강한 PVC 마루, 관리 용이',
  },
  
  // Tile
  {
    id: 't1',
    category: 'tile',
    name: '이태리 수입 대리석 타일',
    brand: 'Marazzi',
    material: '대리석',
    color: '카라라 화이트',
    pricePerUnit: 120000,
    unit: '평',
    imageUrl: 'https://images.pexels.com/photos/7319334/pexels-photo-7319334.jpeg',
    description: '고급 대리석 수입 타일, 고급스러운 공간 연출',
  },
  {
    id: 't2',
    category: 'tile',
    name: '포셀린 타일',
    brand: '삼현타일',
    material: '포셀린',
    color: '콘크리트 그레이',
    pricePerUnit: 65000,
    unit: '평',
    imageUrl: 'https://images.pexels.com/photos/5490380/pexels-photo-5490380.jpeg',
    description: '내구성 강한 포셀린 타일, 다양한 공간에 활용 가능',
  },
  {
    id: 't3',
    category: 'tile',
    name: '도기질 타일',
    brand: '대동타일',
    material: '도기질',
    color: '화이트 매트',
    pricePerUnit: 38000,
    unit: '평',
    imageUrl: 'https://images.pexels.com/photos/6444266/pexels-photo-6444266.jpeg',
    description: '가성비 좋은 도기질 타일, 욕실/주방에 적합',
  },
  
  // Wallpaper
  {
    id: 'w1',
    category: 'wallpaper',
    name: '프리미엄 실크 벽지',
    brand: '신한벽지',
    material: '실크',
    color: '소프트 베이지',
    pricePerUnit: 58000,
    unit: '평',
    imageUrl: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    description: '고급스러운 질감의 실크 벽지, 내구성 우수',
  },
  {
    id: 'w2',
    category: 'wallpaper',
    name: '친환경 벽지',
    brand: 'LG 하우시스',
    material: '비닐',
    color: '라이트 그레이',
    pricePerUnit: 35000,
    unit: '평',
    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    description: '친환경 인증을 받은 벽지, 유해물질 방출 최소화',
  },
  {
    id: 'w3',
    category: 'wallpaper',
    name: '합지 벽지',
    brand: '코스모스벽지',
    material: '합지',
    color: '화이트',
    pricePerUnit: 22000,
    unit: '평',
    imageUrl: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg',
    description: '가성비 좋은 합지 벽지, 다양한 컬러 선택 가능',
  },
  
  // Lighting
  {
    id: 'l1',
    category: 'lighting',
    name: '크리스탈 샹들리에',
    brand: 'FLOS',
    material: '크리스탈, 스테인리스',
    color: '실버/크리스탈',
    pricePerUnit: 950000,
    unit: '개',
    imageUrl: 'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg',
    description: '럭셔리한 크리스탈 디자인, 거실/다이닝룸에 최적',
  },
  {
    id: 'l2',
    category: 'lighting',
    name: '모던 펜던트 조명',
    brand: 'IKEA',
    material: '알루미늄, 유리',
    color: '블랙',
    pricePerUnit: 350000,
    unit: '개',
    imageUrl: 'https://images.pexels.com/photos/1166642/pexels-photo-1166642.jpeg',
    description: '심플한 디자인의 모던 조명, 다양한 공간에 어울림',
  },
  {
    id: 'l3',
    category: 'lighting',
    name: 'LED 다운라이트',
    brand: '필립스',
    material: '플라스틱, LED',
    color: '화이트',
    pricePerUnit: 45000,
    unit: '개',
    imageUrl: 'https://images.pexels.com/photos/1042152/pexels-photo-1042152.jpeg',
    description: '에너지 효율적인 LED 다운라이트, 설치 간편',
  },
];

// Mock Estimates
export const mockEstimates: Estimate[] = [
  {
    id: '1',
    clientId: '1',
    clientName: '김지민',
    spaces: [
      { id: '1', name: 'bathroom', selected: true },
      { id: '2', name: 'kitchen', selected: true },
    ],
    materials: [
      {
        ...mockMaterials[3], // t1 - Tile
        quantity: 3,
        totalPrice: 360000,
        alternativeOptions: {
          standard: mockMaterials[4], // t2
          economy: mockMaterials[5], // t3
        }
      },
      {
        ...mockMaterials[6], // w1 - Wallpaper
        quantity: 4,
        totalPrice: 232000,
        alternativeOptions: {
          standard: mockMaterials[7], // w2
          economy: mockMaterials[8], // w3
        }
      },
    ],
    totalPrice: 592000,
    budget: 600000,
    options: {
      premium: {
        totalPrice: 592000,
        materials: [
          {
            ...mockMaterials[3], // t1
            quantity: 3,
            totalPrice: 360000,
          },
          {
            ...mockMaterials[6], // w1
            quantity: 4,
            totalPrice: 232000,
          },
        ],
      },
      standard: {
        totalPrice: 400000,
        materials: [
          {
            ...mockMaterials[4], // t2
            quantity: 3, 
            totalPrice: 195000,
          },
          {
            ...mockMaterials[7], // w2
            quantity: 4,
            totalPrice: 140000,
          },
        ],
      },
      economy: {
        totalPrice: 236000,
        materials: [
          {
            ...mockMaterials[5], // t3
            quantity: 3,
            totalPrice: 114000,
          },
          {
            ...mockMaterials[8], // w3
            quantity: 4,
            totalPrice: 88000,
          },
        ],
      },
    },
    createdAt: '2023-09-20T10:30:00.000Z',
    updatedAt: '2023-09-20T14:45:00.000Z',
  },
];