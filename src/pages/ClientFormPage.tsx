import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Card, { CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Save, ArrowLeft, Trash } from 'lucide-react';

import { ClientFormData } from '../types';

const ClientFormPage: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useAppContext();
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', message: '' });
  
  const isEditMode = clientId !== undefined && clientId !== 'new';
  
  useEffect(() => {
    if (isEditMode) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setFormData({
          name: client.name,
          phone: client.phone,
          address: client.address,
          notes: client.notes,
        });
      } else {
        navigate('/clients');
      }
    }
  }, [clientId, clients, isEditMode, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is changed
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {
      name: '',
      phone: '',
      address: '',
    };
    
    if (!formData.name.trim()) {
      newErrors.name = '고객명을 입력해주세요';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요';
    } else if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 연락처 형식이 아닙니다 (예: 010-1234-5678)';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', message: '' });
    
    try {
      if (isEditMode) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
          // Supabase로 업데이트
          const result = await updateClient(clientId, formData);
          if (result.error) {
            setSubmitMessage({ type: 'error', message: result.error.message || '업데이트 중 오류가 발생했습니다.' });
          } else {
            setSubmitMessage({ type: 'success', message: '고객 정보가 성공적으로 업데이트되었습니다.' });
            
            // 3초 후 리다이렉트
            setTimeout(() => {
              navigate('/');
            }, 2000);
          }
        }
      } else {
        // Supabase로 저장
        const result = await addClient(formData);
        if (result.error) {
          setSubmitMessage({ type: 'error', message: result.error.message || '등록 중 오류가 발생했습니다.' });
        } else {
          setSubmitMessage({ type: 'success', message: '새 고객이 성공적으로 등록되었습니다.' });
          
          // 폼 초기화
          setFormData({ name: '', phone: '', address: '', notes: '' });
          
          // 3초 후 리다이렉트
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Client submission error:', error);
      setSubmitMessage({ type: 'error', message: '서버 통신 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (isEditMode && confirm('정말 삭제하시겠습니까? 관련된 모든 견적 정보도 삭제됩니다.')) {
      setIsSubmitting(true);
      try {
        // Supabase로 삭제
        const result = await deleteClient(clientId as string);
        if (result.error) {
          setSubmitMessage({ type: 'error', message: result.error.message || '삭제 중 오류가 발생했습니다.' });
        } else {
          setSubmitMessage({ type: 'success', message: '고객 정보가 성공적으로 삭제되었습니다.' });
          
          // 3초 후 리다이렉트
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        console.error('Client deletion error:', error);
        setSubmitMessage({ type: 'error', message: '서버 통신 중 오류가 발생했습니다.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <Button
        variant="text"
        icon={<ArrowLeft size={16} />}
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        돌아가기
      </Button>
      
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold text-gray-800">
            {isEditMode ? '고객 정보 수정' : '신규 고객 등록'}
          </h1>
        </CardHeader>
        
        {submitMessage.message && (
          <div className={`mx-6 mb-4 p-3 rounded-md ${
            submitMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {submitMessage.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              label="고객명"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              disabled={isSubmitting}
            />
            
            <Input
              label="연락처"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              error={errors.phone}
              required
              disabled={isSubmitting}
            />
            
            <Input
              label="시공 주소"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
              disabled={isSubmitting}
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                요청사항
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md shadow-sm border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                placeholder="고객의 특별 요청사항이나 메모를 입력하세요"
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                icon={<Trash size={16} />}
                onClick={handleDelete}
                className="text-red-600 border-red-600 hover:bg-red-50"
                disabled={isSubmitting}
              >
                삭제
              </Button>
            )}
            
            <div className={`${isEditMode ? '' : 'ml-auto'}`}>
              <Button
                type="submit"
                variant="primary"
                icon={<Save size={16} />}
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? '처리 중...' 
                  : isEditMode 
                    ? '수정 완료' 
                    : '등록 완료'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ClientFormPage;