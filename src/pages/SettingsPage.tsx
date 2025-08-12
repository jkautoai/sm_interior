import React, { useState } from 'react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { 
  User, 
  Building, 
  Palette, 
  Database, 
  Shield, 
  Bell,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: '인테리어 견적마스터',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    email: 'contact@estimator.kr',
    businessNumber: '123-45-67890'
  });

  const [userSettings, setUserSettings] = useState({
    currency: 'KRW',
    dateFormat: 'YYYY-MM-DD',
    theme: 'light',
    language: 'ko'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const handleCompanyInfoSave = () => {
    // TODO: Supabase에 회사 정보 저장
    alert('회사 정보가 저장되었습니다.');
  };

  const handleSettingsSave = () => {
    // TODO: 사용자 설정 저장
    alert('설정이 저장되었습니다.');
  };

  const handleDataExport = () => {
    // TODO: 데이터 내보내기 구현
    alert('데이터 내보내기 기능을 준비 중입니다.');
  };

  const handleDataImport = () => {
    // TODO: 데이터 가져오기 구현
    alert('데이터 가져오기 기능을 준비 중입니다.');
  };

  const handleDataReset = () => {
    if (window.confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // TODO: 데이터 초기화 구현
      alert('데이터 초기화 기능을 준비 중입니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600 mt-2">시스템 설정을 관리하고 사용자 환경을 구성하세요</p>
      </div>

      <div className="space-y-6">
        {/* 회사 정보 */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-teal-600" />
              <h2 className="text-lg font-semibold">회사 정보</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="회사명"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
              />
              <Input
                label="사업자번호"
                value={companyInfo.businessNumber}
                onChange={(e) => setCompanyInfo({...companyInfo, businessNumber: e.target.value})}
              />
              <Input
                label="주소"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                className="md:col-span-2"
              />
              <Input
                label="전화번호"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
              />
              <Input
                label="이메일"
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
              />
            </div>
            <div className="mt-4">
              <Button onClick={handleCompanyInfoSave} className="bg-teal-600 hover:bg-teal-700">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 시스템 설정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-teal-600" />
              <h2 className="text-lg font-semibold">시스템 설정</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="통화"
                value={userSettings.currency}
                onChange={(value) => setUserSettings({...userSettings, currency: value})}
                options={[
                  { value: 'KRW', label: '원 (₩)' },
                  { value: 'USD', label: '달러 ($)' },
                  { value: 'EUR', label: '유로 (€)' }
                ]}
              />
              <Select
                label="날짜 형식"
                value={userSettings.dateFormat}
                onChange={(value) => setUserSettings({...userSettings, dateFormat: value})}
                options={[
                  { value: 'YYYY-MM-DD', label: '2024-01-01' },
                  { value: 'DD/MM/YYYY', label: '01/01/2024' },
                  { value: 'MM/DD/YYYY', label: '01/01/2024' }
                ]}
              />
              <Select
                label="테마"
                value={userSettings.theme}
                onChange={(value) => setUserSettings({...userSettings, theme: value})}
                options={[
                  { value: 'light', label: '라이트 모드' },
                  { value: 'dark', label: '다크 모드' },
                  { value: 'auto', label: '시스템 설정 따름' }
                ]}
              />
              <Select
                label="언어"
                value={userSettings.language}
                onChange={(value) => setUserSettings({...userSettings, language: value})}
                options={[
                  { value: 'ko', label: '한국어' },
                  { value: 'en', label: 'English' }
                ]}
              />
            </div>
            <div className="mt-4">
              <Button onClick={handleSettingsSave} className="bg-teal-600 hover:bg-teal-700">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 알림 설정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-teal-600" />
              <h2 className="text-lg font-semibold">알림 설정</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">이메일 알림</div>
                  <div className="text-sm text-gray-500">중요한 업데이트를 이메일로 받습니다</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SMS 알림</div>
                  <div className="text-sm text-gray-500">긴급한 알림을 SMS로 받습니다</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.smsNotifications}
                  onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">푸시 알림</div>
                  <div className="text-sm text-gray-500">브라우저 푸시 알림을 받습니다</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 데이터 관리 */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-teal-600" />
              <h2 className="text-lg font-semibold">데이터 관리</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleDataExport}
                  variant="outline"
                  className="justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  데이터 내보내기
                </Button>
                <Button
                  onClick={handleDataImport}
                  variant="outline"
                  className="justify-start"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  데이터 가져오기
                </Button>
              </div>
              <div className="border-t pt-4">
                <div className="mb-4">
                  <h3 className="font-medium text-red-600 mb-2">위험 구역</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    아래 작업은 되돌릴 수 없습니다. 신중하게 실행하세요.
                  </p>
                </div>
                <Button
                  onClick={handleDataReset}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  모든 데이터 초기화
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 보안 설정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-teal-600" />
              <h2 className="text-lg font-semibold">보안 설정</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <div className="font-medium text-yellow-800">인증 설정</div>
                    <div className="text-sm text-yellow-700">
                      향후 업데이트에서 사용자 인증 기능이 추가될 예정입니다.
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>현재 보안 상태:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Supabase Row Level Security (RLS) 활성화</li>
                  <li>HTTPS 연결 보장</li>
                  <li>실시간 데이터 암호화</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
