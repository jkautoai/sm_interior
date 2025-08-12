import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Material } from '../types'

export const useSupabaseMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 데이터 가져오기
  const fetchMaterials = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error: supabaseError } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false })

    if (supabaseError) {
      console.error('자재 로딩 에러:', supabaseError)
      setError(supabaseError.message)
    } else {
      setMaterials(data || [])
    }
    setLoading(false)
  }

  // 실시간 구독
  useEffect(() => {
    fetchMaterials()

    const subscription = supabase
      .channel('materials_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'materials' },
        () => {
          fetchMaterials()
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  // 자재 추가
  const addMaterial = async (materialData: Omit<Material, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('materials')
      .insert([materialData])
      .select()

    // 성공하면 목록 새로고침
    if (!error) {
      await fetchMaterials()
    }

    return { data: data?.[0], error }
  }

  // 자재 수정
  const updateMaterial = async (id: string, materialData: Partial<Material>) => {
    const { data, error } = await supabase
      .from('materials')
      .update(materialData)
      .eq('id', id)
      .select()

    // 성공하면 목록 새로고침
    if (!error) {
      await fetchMaterials()
    }

    return { data: data?.[0], error }
  }

  // 자재 삭제
  const deleteMaterial = async (id: string) => {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id)

    // 성공하면 목록 새로고침
    if (!error) {
      await fetchMaterials()
    }

    return { error }
  }

  return {
    materials,
    loading,
    error,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    refetch: fetchMaterials
  }
}