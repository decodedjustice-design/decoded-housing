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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      properties: {
        Row: {
          address: string | null
          affordable_units: number | null
          ami: string[]
          city: string | null
          created_at: string
          id: string
          image_url: string | null
          insider: string | null
          name: string
          program_type: string | null
          source: string | null
          status: string | null
          total_units: number | null
          transit_distance: number | null
          types: string[]
          units: string[]
          updated_days: number | null
          verified: boolean
          voucher: boolean
          year: number | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          affordable_units?: number | null
          ami?: string[]
          city?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          insider?: string | null
          name: string
          program_type?: string | null
          source?: string | null
          status?: string | null
          total_units?: number | null
          transit_distance?: number | null
          types?: string[]
          units?: string[]
          updated_days?: number | null
          verified?: boolean
          voucher?: boolean
          year?: number | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          affordable_units?: number | null
          ami?: string[]
          city?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          insider?: string | null
          name?: string
          program_type?: string | null
          source?: string | null
          status?: string | null
          total_units?: number | null
          transit_distance?: number | null
          types?: string[]
          units?: string[]
          updated_days?: number | null
          verified?: boolean
          voucher?: boolean
          year?: number | null
          zip?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          address: string | null
          category: string
          city: string | null
          created_at: string
          description: string | null
          eligibility: string | null
          hours: string | null
          id: string
          name: string
          phone: string | null
          priority_level: number
          subcategory: string | null
          verified: boolean
          website: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          category: string
          city?: string | null
          created_at?: string
          description?: string | null
          eligibility?: string | null
          hours?: string | null
          id?: string
          name: string
          phone?: string | null
          priority_level?: number
          subcategory?: string | null
          verified?: boolean
          website?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          city?: string | null
          created_at?: string
          description?: string | null
          eligibility?: string | null
          hours?: string | null
          id?: string
          name?: string
          phone?: string | null
          priority_level?: number
          subcategory?: string | null
          verified?: boolean
          website?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      shelters: {
        Row: {
          access_notes: string | null
          access_speed: string | null
          address: string | null
          backup_option: string | null
          barrier_level: string | null
          city: string | null
          created_at: string
          external_id: string | null
          id: string
          intake: string | null
          name: string
          organization: string | null
          phone: string | null
          population: string[]
          realistic_availability: string | null
          source: string[]
          type: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          access_notes?: string | null
          access_speed?: string | null
          address?: string | null
          backup_option?: string | null
          barrier_level?: string | null
          city?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          intake?: string | null
          name: string
          organization?: string | null
          phone?: string | null
          population?: string[]
          realistic_availability?: string | null
          source?: string[]
          type?: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          access_notes?: string | null
          access_speed?: string | null
          address?: string | null
          backup_option?: string | null
          barrier_level?: string | null
          city?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          intake?: string | null
          name?: string
          organization?: string | null
          phone?: string | null
          population?: string[]
          realistic_availability?: string | null
          source?: string[]
          type?: string
          updated_at?: string
          verified?: boolean
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
