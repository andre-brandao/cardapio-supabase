export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          created_at: string
          id: string
          mesa: string
          nome: string
          telefone: string
        }
        Insert: {
          created_at?: string
          id?: string
          mesa?: string
          nome?: string
          telefone?: string
        }
        Update: {
          created_at?: string
          id?: string
          mesa?: string
          nome?: string
          telefone?: string
        }
        Relationships: []
      }
      info_admin: {
        Row: {
          email: string
          id: string
          perm_editar_cardapio: boolean
          perm_editar_perms: boolean
          perm_estoque: boolean
        }
        Insert: {
          email?: string
          id: string
          perm_editar_cardapio?: boolean
          perm_editar_perms?: boolean
          perm_estoque?: boolean
        }
        Update: {
          email?: string
          id?: string
          perm_editar_cardapio?: boolean
          perm_editar_perms?: boolean
          perm_estoque?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "info_admin_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pedidos: {
        Row: {
          cliente_id: string
          created_at: string
          id: number
          observacao: string
          produto: number
          quantidade: number
          status: string
          total_in_cents: number
          updated_by: string | null
        }
        Insert: {
          cliente_id?: string
          created_at?: string
          id?: number
          observacao?: string
          produto?: number
          quantidade?: number
          status?: string
          total_in_cents?: number
          updated_by?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: number
          observacao?: string
          produto?: number
          quantidade?: number
          status?: string
          total_in_cents?: number
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_produto_fkey"
            columns: ["produto"]
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "info_admin"
            referencedColumns: ["id"]
          }
        ]
      }
      produtos: {
        Row: {
          categoria: string
          created_at: string
          descricao: string
          id: number
          image_url: string
          nome: string
          preco_in_cents: number
          sub_categoria: string
          vegan: boolean
          visible: boolean
        }
        Insert: {
          categoria?: string
          created_at?: string
          descricao?: string
          id?: number
          image_url?: string
          nome?: string
          preco_in_cents: number
          sub_categoria?: string
          vegan?: boolean
          visible?: boolean
        }
        Update: {
          categoria?: string
          created_at?: string
          descricao?: string
          id?: number
          image_url?: string
          nome?: string
          preco_in_cents?: number
          sub_categoria?: string
          vegan?: boolean
          visible?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
