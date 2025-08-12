export type Database = {
    public: {
      Tables: {
        clients: {
          Row: {
            id: string
            name: string
            phone: string
            address: string
            notes: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            name: string
            phone: string
            address: string
            notes?: string | null
          }
          Update: {
            name?: string
            phone?: string
            address?: string
            notes?: string | null
          }
        }
        materials: {
          Row: {
            id: string
            category: string
            name: string
            brand: string
            material: string | null
            color: string | null
            price_per_unit: number
            unit: string
            image_url: string | null
            description: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            category: string
            name: string
            brand: string
            material?: string | null
            color?: string | null
            price_per_unit: number
            unit: string
            image_url?: string | null
            description?: string | null
          }
          Update: {
            category?: string
            name?: string
            brand?: string
            material?: string | null
            color?: string | null
            price_per_unit?: number
            unit?: string
            image_url?: string | null
            description?: string | null
          }
        }
        estimates: {
          Row: {
            id: string
            client_id: string
            client_name: string
            total_price: number
            budget: number | null
            status: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            client_id: string
            client_name: string
            total_price?: number
            budget?: number | null
            status?: string
          }
          Update: {
            client_id?: string
            client_name?: string
            total_price?: number
            budget?: number | null
            status?: string
          }
        }
        estimate_spaces: {
          Row: {
            id: string
            estimate_id: string
            space_type: string
            space_name: string
            selected: boolean
            created_at: string
          }
          Insert: {
            id?: string
            estimate_id: string
            space_type: string
            space_name: string
            selected?: boolean
          }
          Update: {
            estimate_id?: string
            space_type?: string
            space_name?: string
            selected?: boolean
          }
        }
        estimate_materials: {
          Row: {
            id: string
            estimate_id: string
            material_id: string
            quantity: number
            unit_price: number
            total_price: number
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            estimate_id: string
            material_id: string
            quantity: number
            unit_price: number
            total_price: number
          }
          Update: {
            estimate_id?: string
            material_id?: string
            quantity?: number
            unit_price?: number
            total_price?: number
          }
        }
      }
      Views: {
        estimates_with_details: {
          Row: {
            id: string
            client_id: string
            client_name: string
            total_price: number
            budget: number | null
            status: string
            created_at: string
            updated_at: string
            spaces: any[] | null
            materials: any[] | null
          }
        }
      }
    }
  }