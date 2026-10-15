export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      accounting_entries: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string
          entry_date: string | null
          entry_type: string
          id: string
          label: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string
          entry_date?: string | null
          entry_type?: string
          id?: string
          label: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string
          entry_date?: string | null
          entry_type?: string
          id?: string
          label?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          hire_date: string | null
          id: string
          notes: string | null
          phone: string | null
          role: string | null
          status: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          status?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      interventions: {
        Row: {
          address: string
          city: string | null
          client: string | null
          created_at: string
          id: string
          intervention_date: string | null
          latitude: number | null
          longitude: number | null
          notes: string | null
          service: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          city?: string | null
          client?: string | null
          created_at?: string
          id?: string
          intervention_date?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string | null
          client?: string | null
          created_at?: string
          id?: string
          intervention_date?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number | null
          client: string
          created_at: string
          id: string
          invoice_date: string | null
          method: string | null
          notes: string | null
          number: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          client: string
          created_at?: string
          id?: string
          invoice_date?: string | null
          method?: string | null
          notes?: string | null
          number: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          client?: string
          created_at?: string
          id?: string
          invoice_date?: string | null
          method?: string | null
          notes?: string | null
          number?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string | null
          channel: string | null
          created_at: string
          id: string
          recipient: string | null
          send_date: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          channel?: string | null
          created_at?: string
          id?: string
          recipient?: string | null
          send_date?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          channel?: string | null
          created_at?: string
          id?: string
          recipient?: string | null
          send_date?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channel: string | null
          created_at: string
          id: string
          message: string | null
          recipient: string | null
          send_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          channel?: string | null
          created_at?: string
          id?: string
          message?: string | null
          recipient?: string | null
          send_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          channel?: string | null
          created_at?: string
          id?: string
          message?: string | null
          recipient?: string | null
          send_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          city: string | null
          client_id: string | null
          created_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          notes: string | null
          photo_urls: string[]
          scheduled_at: string
          service_id: string | null
          service_label: string | null
          status: string
          team_id: string | null
          total_price: number
          updated_at: string
        }
        Insert: {
          address: string
          city?: string | null
          client_id?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          photo_urls?: string[]
          scheduled_at: string
          service_id?: string | null
          service_label?: string | null
          status?: string
          team_id?: string | null
          total_price: number
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string | null
          client_id?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          photo_urls?: string[]
          scheduled_at?: string
          service_id?: string | null
          service_label?: string | null
          status?: string
          team_id?: string | null
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_services: {
        Row: {
          created_at: string
          id: string
          pack_id: string
          service_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pack_id: string
          service_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pack_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_services_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      packs: {
        Row: {
          badge: string | null
          created_at: string
          description: string | null
          features: Json
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          popular: boolean
          price: number
          slug: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          badge?: string | null
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          popular?: boolean
          price?: number
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          badge?: string | null
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          popular?: boolean
          price?: number
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      pricing_overrides: {
        Row: {
          created_at: string
          id: string
          item_slug: string
          label: string | null
          price: number
          service_slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_slug: string
          label?: string | null
          price?: number
          service_slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_slug?: string
          label?: string | null
          price?: number
          service_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          notes: string | null
          purchase_date: string | null
          reference: string
          status: string
          supplier: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          purchase_date?: string | null
          reference: string
          status?: string
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          purchase_date?: string | null
          reference?: string
          status?: string
          supplier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          interventions_count: number | null
          notes: string | null
          period: string | null
          report_date: string | null
          revenue: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          interventions_count?: number | null
          notes?: string | null
          period?: string | null
          report_date?: string | null
          revenue?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          interventions_count?: number | null
          notes?: string | null
          period?: string | null
          report_date?: string | null
          revenue?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client: string
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          review_date: string | null
          service: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          review_date?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          review_date?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      stock_items: {
        Row: {
          category: string | null
          created_at: string
          id: string
          product: string
          quantity: number
          supplier_id: string | null
          threshold: number | null
          unit: string | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          product: string
          quantity?: number
          supplier_id?: string | null
          threshold?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          product?: string
          quantity?: number
          supplier_id?: string | null
          threshold?: number | null
          unit?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          category: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_module_permissions: {
        Row: {
          created_at: string
          id: string
          module: string
          team_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          module: string
          team_id: string
        }
        Update: {
          created_at?: string
          id?: string
          module?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_module_permissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          zone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          zone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          zone?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string | null
          created_at: string
          driver: string | null
          id: string
          mileage: number | null
          notes: string | null
          plate: string
          status: string
          type: string | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          driver?: string | null
          id?: string
          mileage?: number | null
          notes?: string | null
          plate: string
          status?: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          driver?: string | null
          id?: string
          mileage?: number | null
          notes?: string | null
          plate?: string
          status?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client", "employee"],
    },
  },
} as const
