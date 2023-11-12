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
      adicional: {
        Row: {
          created_at: string
          id: number
          nome: string
          preco_in_cents: number
          produto_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          nome?: string
          preco_in_cents: number
          produto_id: number
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string
          preco_in_cents?: number
          produto_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "adicional_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          }
        ]
      }
      clientes: {
        Row: {
          checkout_by: string | null
          checkout_date: string | null
          created_at: string
          id: string
          mesa: string
          nome: string
          telefone: string
        }
        Insert: {
          checkout_by?: string | null
          checkout_date?: string | null
          created_at?: string
          id?: string
          mesa?: string
          nome?: string
          telefone?: string
        }
        Update: {
          checkout_by?: string | null
          checkout_date?: string | null
          created_at?: string
          id?: string
          mesa?: string
          nome?: string
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_checkout_by_fkey"
            columns: ["checkout_by"]
            isOneToOne: false
            referencedRelation: "info_admin"
            referencedColumns: ["id"]
          }
        ]
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
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pedido_adicional: {
        Row: {
          adicional_id: number
          created_at: string
          id: number
          pedido_id: number
        }
        Insert: {
          adicional_id: number
          created_at?: string
          id?: number
          pedido_id: number
        }
        Update: {
          adicional_id?: number
          created_at?: string
          id?: number
          pedido_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_adicional_adicional_id_fkey"
            columns: ["adicional_id"]
            isOneToOne: false
            referencedRelation: "adicional"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_adicional_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
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
          pago: string
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
          pago?: string
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
          pago?: string
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
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_produto_fkey"
            columns: ["produto"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
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
