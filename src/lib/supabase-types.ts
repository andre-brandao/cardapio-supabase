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
      pedidos: {
        Row: {
          cliente_id: string
          created_at: string
          id: number
          produto: number
          quantidade: number | null
          status: string
        }
        Insert: {
          cliente_id?: string
          created_at?: string
          id?: number
          produto?: number
          quantidade?: number | null
          status?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: number
          produto?: number
          quantidade?: number | null
          status?: string
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
          }
        ]
      }
      perms: {
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
            foreignKeyName: "perms_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
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
          image_url: string | null
          nome: string
          preco: number
          sub_categoria: string | null
          vegan: boolean
          visible: boolean | null
        }
        Insert: {
          categoria?: string
          created_at?: string
          descricao?: string
          id?: number
          image_url?: string | null
          nome?: string
          preco?: number
          sub_categoria?: string | null
          vegan?: boolean
          visible?: boolean | null
        }
        Update: {
          categoria?: string
          created_at?: string
          descricao?: string
          id?: number
          image_url?: string | null
          nome?: string
          preco?: number
          sub_categoria?: string | null
          vegan?: boolean
          visible?: boolean | null
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
