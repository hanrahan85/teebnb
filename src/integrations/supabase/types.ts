export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      email_verifications: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          token: string
          user_id: string | null
          verified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          token: string
          user_id?: string | null
          verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          token?: string
          user_id?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      property_listings: {
        Row: {
          amenities: Json | null
          bathrooms: number
          bedrooms: number
          beds: number
          can_host_groups: boolean | null
          cancellation_policy: string | null
          checkin_time: string | null
          checkout_time: string | null
          cleaning_fee: number | null
          cover_image: string | null
          created_at: string | null
          distance_to_course: number | null
          distance_unit: string | null
          full_address: string
          golf_bag_storage: boolean | null
          host_bio: string | null
          host_email: string | null
          host_name: string
          host_phone: string | null
          host_photo: string | null
          house_rules: string | null
          id: string
          instant_booking: boolean | null
          languages_spoken: string[] | null
          latitude: number | null
          longitude: number | null
          max_guests: number
          maximum_stay: number | null
          minimum_stay: number | null
          nearby_golf_courses: string[] | null
          nightly_price: number
          parking_availability: string | null
          partner_course_name: string | null
          partnered_with_course: boolean | null
          photos: string[] | null
          property_privacy: string
          property_title: string
          property_type: string
          security_deposit: number | null
          status: string | null
          tournament_discounts: boolean | null
          tournament_pricing: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amenities?: Json | null
          bathrooms: number
          bedrooms: number
          beds: number
          can_host_groups?: boolean | null
          cancellation_policy?: string | null
          checkin_time?: string | null
          checkout_time?: string | null
          cleaning_fee?: number | null
          cover_image?: string | null
          created_at?: string | null
          distance_to_course?: number | null
          distance_unit?: string | null
          full_address: string
          golf_bag_storage?: boolean | null
          host_bio?: string | null
          host_email?: string | null
          host_name: string
          host_phone?: string | null
          host_photo?: string | null
          house_rules?: string | null
          id?: string
          instant_booking?: boolean | null
          languages_spoken?: string[] | null
          latitude?: number | null
          longitude?: number | null
          max_guests: number
          maximum_stay?: number | null
          minimum_stay?: number | null
          nearby_golf_courses?: string[] | null
          nightly_price: number
          parking_availability?: string | null
          partner_course_name?: string | null
          partnered_with_course?: boolean | null
          photos?: string[] | null
          property_privacy: string
          property_title: string
          property_type: string
          security_deposit?: number | null
          status?: string | null
          tournament_discounts?: boolean | null
          tournament_pricing?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amenities?: Json | null
          bathrooms?: number
          bedrooms?: number
          beds?: number
          can_host_groups?: boolean | null
          cancellation_policy?: string | null
          checkin_time?: string | null
          checkout_time?: string | null
          cleaning_fee?: number | null
          cover_image?: string | null
          created_at?: string | null
          distance_to_course?: number | null
          distance_unit?: string | null
          full_address?: string
          golf_bag_storage?: boolean | null
          host_bio?: string | null
          host_email?: string | null
          host_name?: string
          host_phone?: string | null
          host_photo?: string | null
          house_rules?: string | null
          id?: string
          instant_booking?: boolean | null
          languages_spoken?: string[] | null
          latitude?: number | null
          longitude?: number | null
          max_guests?: number
          maximum_stay?: number | null
          minimum_stay?: number | null
          nearby_golf_courses?: string[] | null
          nightly_price?: number
          parking_availability?: string | null
          partner_course_name?: string | null
          partnered_with_course?: boolean | null
          photos?: string[] | null
          property_privacy?: string
          property_title?: string
          property_type?: string
          security_deposit?: number | null
          status?: string | null
          tournament_discounts?: boolean | null
          tournament_pricing?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      travel_recommendations: {
        Row: {
          created_at: string | null
          destinations: Json
          id: string
          itinerary: Json
          practical_info: Json
          submission_id: string | null
          summary: string
          title: string
        }
        Insert: {
          created_at?: string | null
          destinations: Json
          id?: string
          itinerary: Json
          practical_info: Json
          submission_id?: string | null
          summary: string
          title: string
        }
        Update: {
          created_at?: string | null
          destinations?: Json
          id?: string
          itinerary?: Json
          practical_info?: Json
          submission_id?: string | null
          summary?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_recommendations_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "travel_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_submissions: {
        Row: {
          accommodation: string | null
          budget: string
          course_type: string | null
          created_at: string | null
          duration: string | null
          email: string
          group_size: string | null
          handicap: string | null
          id: string
          preferred_region: string
          special_requests: string | null
          travel_dates: string | null
          traveler_name: string
          user_id: string
        }
        Insert: {
          accommodation?: string | null
          budget: string
          course_type?: string | null
          created_at?: string | null
          duration?: string | null
          email: string
          group_size?: string | null
          handicap?: string | null
          id?: string
          preferred_region: string
          special_requests?: string | null
          travel_dates?: string | null
          traveler_name: string
          user_id: string
        }
        Update: {
          accommodation?: string | null
          budget?: string
          course_type?: string | null
          created_at?: string | null
          duration?: string | null
          email?: string
          group_size?: string | null
          handicap?: string | null
          id?: string
          preferred_region?: string
          special_requests?: string | null
          travel_dates?: string | null
          traveler_name?: string
          user_id?: string
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
