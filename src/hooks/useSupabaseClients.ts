import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Client } from '../types'

export const useSupabaseClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 데이터 가져오기
  const fetchClients = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error: supabaseError } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (supabaseError) {
      setError(supabaseError.message)
    } else {
      setClients(data || [])
    }
    setLoading(false)
  }

  // 실시간 구독
  useEffect(() => {
    fetchClients()

    const subscription = supabase
      .channel('clients_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients' },
        (payload) => {
          console.log('실시간 업데이트 감지:', payload)
          fetchClients()
        }
      )
      .subscribe((status) => {
        console.log('Realtime 구독 상태:', status)
      })

    return () => subscription.unsubscribe()
  }, [])

  // 고객 추가
  const addClient = async (clientData: Omit<Client, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name: clientData.name,
        phone: clientData.phone,
        address: clientData.address,
        notes: clientData.notes
      }])
      .select()

    // 성공하면 목록 새로고침
    if (!error) {
      await fetchClients()
    }

    return { data: data?.[0], error }
  }

  // 고객 수정
  const updateClient = async (id: string, clientData: Partial<Client>) => {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: clientData.name,
        phone: clientData.phone,
        address: clientData.address,
        notes: clientData.notes
      })
      .eq('id', id)
      .select()

    // 성공하면 목록 새로고침
    if (!error) {
      await fetchClients()
    }

    return { data: data?.[0], error }
  }

  // 고객 삭제
  const deleteClient = async (id: string) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    // 성공하면 목록 새로고침
    if (!error) {
      await fetchClients()
    }

    return { error }
  }

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  }
}