import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Estimate, EstimateMaterial, Space } from '../types'

// Supabase 응답 타입 정의
interface SupabaseEstimate {
  id: string
  client_id: string
  client_name: string
  total_price: number
  budget: number | null
  status: string
  created_at: string
  updated_at: string
}

interface SupabaseEstimateSpace {
  id: string
  estimate_id: string
  space_type: string
  space_name: string
  selected: boolean
  created_at: string
}

interface SupabaseEstimateMaterial {
  id: string
  estimate_id: string
  material_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  updated_at: string
}

export const useSupabaseEstimates = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 견적 데이터 가져오기 (뷰 사용)
  const fetchEstimates = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: estimatesData, error: supabaseError } = await supabase
        .from('estimates_with_details')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        console.error('견적 로딩 에러:', supabaseError)
        setError(supabaseError.message)
        return
      }

      console.log('📊 견적 원본 데이터:', estimatesData)

      // Supabase 데이터를 앱 형식으로 변환
      const formattedEstimates: Estimate[] = (estimatesData || []).map(est => ({
        id: est.id,
        clientId: est.client_id,
        clientName: est.client_name,
        spaces: (est.spaces || []).map((space: any, index: number) => ({
          id: space.id || `${est.id}_space_${index}`,
          name: space.space_type,
          selected: space.selected
        })),
        materials: (est.materials || []).map((material: any, index: number) => ({
          id: material.material_id || `${est.id}_material_${index}`,
          category: material.material_category,
          name: material.material_name,
          brand: material.material_brand,
          material: '',
          color: '',
          price_per_unit: material.unit_price,
          unit: material.unit,
          image_url: '',
          description: '',
          created_at: '',
          updated_at: '',
          quantity: material.quantity,
          totalPrice: material.total_price
        })),
        totalPrice: est.total_price,
        budget: est.budget,
        createdAt: est.created_at,
        updatedAt: est.updated_at
      }))

      console.log('✅ 변환된 견적 데이터:', formattedEstimates)
      setEstimates(formattedEstimates)
    } catch (err) {
      console.error('견적 데이터 처리 에러:', err)
      setError('견적 데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 실시간 구독
  useEffect(() => {
    fetchEstimates()

    // estimates 테이블 변경 감지
    const estimatesSubscription = supabase
      .channel('estimates_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'estimates' },
        () => fetchEstimates()
      )
      .subscribe()

    // estimate_materials 테이블 변경 감지
    const materialsSubscription = supabase
      .channel('estimate_materials_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'estimate_materials' },
        () => fetchEstimates()
      )
      .subscribe()

    // estimate_spaces 테이블 변경 감지
    const spacesSubscription = supabase
      .channel('estimate_spaces_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'estimate_spaces' },
        () => fetchEstimates()
      )
      .subscribe()

    return () => {
      estimatesSubscription.unsubscribe()
      materialsSubscription.unsubscribe()
      spacesSubscription.unsubscribe()
    }
  }, [])

  // 견적 추가
  const addEstimate = async (estimateData: {
    clientId: string
    clientName: string
    spaces: Space[]
    materials: EstimateMaterial[]
    budget?: number
  }) => {
    try {
      // 1. 견적 기본 정보 생성
      const { data: estimate, error: estimateError } = await supabase
        .from('estimates')
        .insert([{
          client_id: estimateData.clientId,
          client_name: estimateData.clientName,
          total_price: estimateData.materials.reduce((sum, m) => sum + m.totalPrice, 0),
          budget: estimateData.budget || null,
          status: 'draft'
        }])
        .select()

      if (estimateError || !estimate?.[0]) {
        return { error: estimateError }
      }

      const estimateId = estimate[0].id

      // 2. 공간 데이터 삽입
      if (estimateData.spaces.length > 0) {
        const spacesData = estimateData.spaces
          .filter(space => space.selected)
          .map(space => ({
            estimate_id: estimateId,
            space_type: space.name,
            space_name: space.name, // TODO: 실제 공간명 매핑
            selected: space.selected
          }))

        const { error: spacesError } = await supabase
          .from('estimate_spaces')
          .insert(spacesData)

        if (spacesError) {
          return { error: spacesError }
        }
      }

      // 3. 자재 데이터 삽입
      if (estimateData.materials.length > 0) {
        const materialsData = estimateData.materials.map(material => ({
          estimate_id: estimateId,
          material_id: material.id,
          quantity: material.quantity,
          unit_price: material.price_per_unit,
          total_price: material.totalPrice
        }))

        const { error: materialsError } = await supabase
          .from('estimate_materials')
          .insert(materialsData)

        if (materialsError) {
          return { error: materialsError }
        }
      }

      // 4. 목록 새로고침
      await fetchEstimates()

      return { data: estimate[0], error: null }
    } catch (err) {
      console.error('견적 추가 에러:', err)
      return { error: { message: '견적 추가 중 오류가 발생했습니다.' } }
    }
  }

  // 견적 수정
  const updateEstimate = async (estimateId: string, updates: Partial<{
    clientName: string
    budget: number
    status: string
  }>) => {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .update(updates)
        .eq('id', estimateId)
        .select()

      if (!error) {
        await fetchEstimates()
      }

      return { data: data?.[0], error }
    } catch (err) {
      console.error('견적 수정 에러:', err)
      return { error: { message: '견적 수정 중 오류가 발생했습니다.' } }
    }
  }

  // 견적 삭제
  const deleteEstimate = async (estimateId: string) => {
    try {
      // CASCADE 설정으로 관련 데이터 자동 삭제
      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', estimateId)

      if (!error) {
        await fetchEstimates()
      }

      return { error }
    } catch (err) {
      console.error('견적 삭제 에러:', err)
      return { error: { message: '견적 삭제 중 오류가 발생했습니다.' } }
    }
  }

  // 견적에 자재 추가
  const addMaterialToEstimate = async (estimateId: string, material: EstimateMaterial) => {
    try {
      const { error } = await supabase
        .from('estimate_materials')
        .insert([{
          estimate_id: estimateId,
          material_id: material.id,
          quantity: material.quantity,
          unit_price: material.price_per_unit,
          total_price: material.totalPrice
        }])

      if (!error) {
        await fetchEstimates()
      }

      return { error }
    } catch (err) {
      console.error('자재 추가 에러:', err)
      return { error: { message: '자재 추가 중 오류가 발생했습니다.' } }
    }
  }

  // 견적 자재 수정
  const updateMaterialInEstimate = async (
    estimateId: string, 
    materialId: string, 
    updates: { quantity?: number; total_price?: number }
  ) => {
    try {
      const { error } = await supabase
        .from('estimate_materials')
        .update(updates)
        .eq('estimate_id', estimateId)
        .eq('material_id', materialId)

      if (!error) {
        await fetchEstimates()
      }

      return { error }
    } catch (err) {
      console.error('자재 수정 에러:', err)
      return { error: { message: '자재 수정 중 오류가 발생했습니다.' } }
    }
  }

  // 견적에서 자재 제거
  const removeMaterialFromEstimate = async (estimateId: string, materialId: string) => {
    try {
      const { error } = await supabase
        .from('estimate_materials')
        .delete()
        .eq('estimate_id', estimateId)
        .eq('material_id', materialId)

      if (!error) {
        await fetchEstimates()
      }

      return { error }
    } catch (err) {
      console.error('자재 제거 에러:', err)
      return { error: { message: '자재 제거 중 오류가 발생했습니다.' } }
    }
  }

  return {
    estimates,
    loading,
    error,
    addEstimate,
    updateEstimate,
    deleteEstimate,
    addMaterialToEstimate,
    updateMaterialInEstimate,
    removeMaterialFromEstimate,
    refetch: fetchEstimates
  }
}
