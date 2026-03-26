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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_recommendations: {
        Row: {
          confidence_score: number
          created_at: string
          description: string | null
          id: string
          implementation_notes: string | null
          priority: string
          recommendation_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          supporting_data: Json | null
          title: string
        }
        Insert: {
          confidence_score?: number
          created_at?: string
          description?: string | null
          id?: string
          implementation_notes?: string | null
          priority?: string
          recommendation_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          supporting_data?: Json | null
          title: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          description?: string | null
          id?: string
          implementation_notes?: string | null
          priority?: string
          recommendation_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          supporting_data?: Json | null
          title?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          also_email: boolean | null
          audience: string
          audience_company_ids: string[] | null
          body: string
          created_at: string
          created_by: string | null
          id: string
          priority: string
          show_from: string | null
          show_until: string | null
          status: string
          title: string
          type: string
          updated_at: string
          views: number
        }
        Insert: {
          also_email?: boolean | null
          audience?: string
          audience_company_ids?: string[] | null
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          priority?: string
          show_from?: string | null
          show_until?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
          views?: number
        }
        Update: {
          also_email?: boolean | null
          audience?: string
          audience_company_ids?: string[] | null
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          priority?: string
          show_from?: string | null
          show_until?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          created_at: string | null
          id: string
          points: number | null
          question_id: string
          question_order: number
          randomize_options: boolean | null
        }
        Insert: {
          assessment_id: string
          created_at?: string | null
          id?: string
          points?: number | null
          question_id: string
          question_order: number
          randomize_options?: boolean | null
        }
        Update: {
          assessment_id?: string
          created_at?: string | null
          id?: string
          points?: number | null
          question_id?: string
          question_order?: number
          randomize_options?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_results: {
        Row: {
          answers: Json | null
          assessment_id: string
          attempt_number: number | null
          completed_at: string | null
          created_at: string
          id: string
          passing_score: number | null
          score: number | null
          started_at: string | null
          status: string | null
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          assessment_id: string
          attempt_number?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          passing_score?: number | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          assessment_id?: string
          attempt_number?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          passing_score?: number | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          assessment_type: string
          company_id: string | null
          created_at: string | null
          due_date: string | null
          id: string
          max_attempts: number | null
          passing_score: number
          program_id: string | null
          time_limit_minutes: number | null
          title: string
        }
        Insert: {
          assessment_type: string
          company_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          max_attempts?: number | null
          passing_score: number
          program_id?: string | null
          time_limit_minutes?: number | null
          title: string
        }
        Update: {
          assessment_type?: string
          company_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          max_attempts?: number | null
          passing_score?: number
          program_id?: string | null
          time_limit_minutes?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          employee_id: string
          event_id: string
          id: string
          marked_by: string | null
          notes: string | null
          session_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          employee_id: string
          event_id: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          employee_id?: string
          event_id?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "event_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          action_description: string | null
          changed_fields: string[] | null
          created_at: string
          id: string
          integrity_hash: string
          ip_address: unknown
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          session_id: string | null
          table_name: string | null
          user_agent: string | null
          user_email: string | null
          user_full_name: string | null
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          action_description?: string | null
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          integrity_hash?: string
          ip_address?: unknown
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_full_name?: string | null
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          action_description?: string | null
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          integrity_hash?: string
          ip_address?: unknown
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_full_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          badge_type: string
          company_id: string | null
          created_at: string | null
          criteria: string | null
          description: string | null
          external_badge_id: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          points_value: number | null
          provider: string | null
          updated_at: string | null
        }
        Insert: {
          badge_type: string
          company_id?: string | null
          created_at?: string | null
          criteria?: string | null
          description?: string | null
          external_badge_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          points_value?: number | null
          provider?: string | null
          updated_at?: string | null
        }
        Update: {
          badge_type?: string
          company_id?: string | null
          created_at?: string | null
          criteria?: string | null
          description?: string | null
          external_badge_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          points_value?: number | null
          provider?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "badges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_operations: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          error_details: Json | null
          failed_items: number
          id: string
          metadata: Json | null
          operation_type: string
          processed_items: number
          status: string
          total_items: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_details?: Json | null
          failed_items?: number
          id?: string
          metadata?: Json | null
          operation_type: string
          processed_items?: number
          status?: string
          total_items?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_details?: Json | null
          failed_items?: number
          id?: string
          metadata?: Json | null
          operation_type?: string
          processed_items?: number
          status?: string
          total_items?: number
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          calendar_sync_id: string
          created_at: string | null
          description: string | null
          end_time: string
          external_event_id: string
          id: string
          is_synced: boolean | null
          location: string | null
          start_time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calendar_sync_id: string
          created_at?: string | null
          description?: string | null
          end_time: string
          external_event_id: string
          id?: string
          is_synced?: boolean | null
          location?: string | null
          start_time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calendar_sync_id?: string
          created_at?: string | null
          description?: string | null
          end_time?: string
          external_event_id?: string
          id?: string
          is_synced?: boolean | null
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_calendar_sync_id_fkey"
            columns: ["calendar_sync_id"]
            isOneToOne: false
            referencedRelation: "calendar_sync"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_sync: {
        Row: {
          access_token: string | null
          calendar_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          provider: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          category: string | null
          company_id: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          issuer: string
          level: string
          max_attempts: number | null
          passing_score: number | null
          prerequisites: string[] | null
          price: number | null
          skills_covered: string[] | null
          title: string
          updated_at: string
          validity_months: number | null
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          issuer: string
          level: string
          max_attempts?: number | null
          passing_score?: number | null
          prerequisites?: string[] | null
          price?: number | null
          skills_covered?: string[] | null
          title: string
          updated_at?: string
          validity_months?: number | null
        }
        Update: {
          category?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          issuer?: string
          level?: string
          max_attempts?: number | null
          passing_score?: number | null
          prerequisites?: string[] | null
          price?: number | null
          skills_covered?: string[] | null
          title?: string
          updated_at?: string
          validity_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          address_line_3: string | null
          billing_contact_designation: string | null
          billing_contact_email: string | null
          billing_contact_name: string | null
          billing_contact_phone: string | null
          city: string | null
          company_size: string | null
          contact_person_email: string | null
          contact_person_name: string | null
          contact_person_phone: string | null
          created_at: string
          created_by: string | null
          csm_assigned: string | null
          gstin: string | null
          id: string
          industry: string | null
          is_active: boolean
          logo_url: string | null
          name: string
          pin_code: string | null
          primary_domain: string | null
          slug: string
          state: string | null
          subdomain: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          address_line_3?: string | null
          billing_contact_designation?: string | null
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_contact_phone?: string | null
          city?: string | null
          company_size?: string | null
          contact_person_email?: string | null
          contact_person_name?: string | null
          contact_person_phone?: string | null
          created_at?: string
          created_by?: string | null
          csm_assigned?: string | null
          gstin?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          logo_url?: string | null
          name: string
          pin_code?: string | null
          primary_domain?: string | null
          slug: string
          state?: string | null
          subdomain?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          address_line_3?: string | null
          billing_contact_designation?: string | null
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_contact_phone?: string | null
          city?: string | null
          company_size?: string | null
          contact_person_email?: string | null
          contact_person_name?: string | null
          contact_person_phone?: string | null
          created_at?: string
          created_by?: string | null
          csm_assigned?: string | null
          gstin?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          logo_url?: string | null
          name?: string
          pin_code?: string | null
          primary_domain?: string | null
          slug?: string
          state?: string | null
          subdomain?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_activity_log: {
        Row: {
          action: string
          actor_email: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "company_activity_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_bandwidth: {
        Row: {
          bandwidth_api_gb: number | null
          bandwidth_docs_gb: number | null
          bandwidth_img_gb: number | null
          bandwidth_quota_gb: number | null
          bandwidth_scorm_gb: number | null
          bandwidth_used_gb: number | null
          bandwidth_video_gb: number | null
          company_id: string
          created_at: string | null
          id: string
          month_year: string
          updated_at: string | null
        }
        Insert: {
          bandwidth_api_gb?: number | null
          bandwidth_docs_gb?: number | null
          bandwidth_img_gb?: number | null
          bandwidth_quota_gb?: number | null
          bandwidth_scorm_gb?: number | null
          bandwidth_used_gb?: number | null
          bandwidth_video_gb?: number | null
          company_id: string
          created_at?: string | null
          id?: string
          month_year: string
          updated_at?: string | null
        }
        Update: {
          bandwidth_api_gb?: number | null
          bandwidth_docs_gb?: number | null
          bandwidth_img_gb?: number | null
          bandwidth_quota_gb?: number | null
          bandwidth_scorm_gb?: number | null
          bandwidth_used_gb?: number | null
          bandwidth_video_gb?: number | null
          company_id?: string
          created_at?: string | null
          id?: string
          month_year?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_bandwidth_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_content_pool: {
        Row: {
          company_id: string
          completion_pct: number | null
          content_id: string
          created_at: string | null
          id: string
          pool_type: string
          pushed_by: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          completion_pct?: number | null
          content_id: string
          created_at?: string | null
          id?: string
          pool_type: string
          pushed_by?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          completion_pct?: number | null
          content_id?: string
          created_at?: string | null
          id?: string
          pool_type?: string
          pushed_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_content_pool_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_content_pool_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      company_customizations: {
        Row: {
          ai_affected_modules: string[] | null
          ai_analysis_notes: string | null
          ai_estimated_hours: number | null
          ai_impact_score: number | null
          ai_risk_level: string | null
          approved_at: string | null
          approved_by: string | null
          change_type: string
          company_id: string
          completed_at: string | null
          created_at: string
          description: string
          id: string
          notes: string | null
          priority: string
          requested_at: string
          requested_by: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_affected_modules?: string[] | null
          ai_analysis_notes?: string | null
          ai_estimated_hours?: number | null
          ai_impact_score?: number | null
          ai_risk_level?: string | null
          approved_at?: string | null
          approved_by?: string | null
          change_type?: string
          company_id: string
          completed_at?: string | null
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          priority?: string
          requested_at?: string
          requested_by?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_affected_modules?: string[] | null
          ai_analysis_notes?: string | null
          ai_estimated_hours?: number | null
          ai_impact_score?: number | null
          ai_risk_level?: string | null
          approved_at?: string | null
          approved_by?: string | null
          change_type?: string
          company_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          priority?: string
          requested_at?: string
          requested_by?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_customizations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_discounts: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          discount_percent: number
          discount_target: string
          id: string
          notes: string | null
          reason: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          discount_percent?: number
          discount_target?: string
          id?: string
          notes?: string | null
          reason?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          discount_percent?: number
          discount_target?: string
          id?: string
          notes?: string | null
          reason?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_discounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_features: {
        Row: {
          company_id: string
          feature_key: string
          id: string
          is_addon: boolean
          is_enabled: boolean
          updated_at: string
        }
        Insert: {
          company_id: string
          feature_key: string
          id?: string
          is_addon?: boolean
          is_enabled?: boolean
          updated_at?: string
        }
        Update: {
          company_id?: string
          feature_key?: string
          id?: string
          is_addon?: boolean
          is_enabled?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_features_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_notes: {
        Row: {
          author_id: string
          company_id: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          note_type: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          company_id: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          note_type?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          note_type?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_notes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_payments: {
        Row: {
          active_users: number | null
          amount: number | null
          billing_cycle: string | null
          block_id: string | null
          block_seats: number | null
          change_reason: string | null
          company_id: string
          contract_end_date: string | null
          contract_start_date: string | null
          contract_value: number | null
          created_at: string
          currency: string | null
          discount_percent: number | null
          discount_reason: string | null
          discount_target: string | null
          discount_valid_until: string | null
          end_date: string | null
          id: string
          incremental_rate: number | null
          incremental_seats: number | null
          last_payment_date: string | null
          notes: string | null
          payment_method: string | null
          plan_name: string
          plan_status: string
          po_number: string | null
          renewal_date: string | null
          seats_included: number | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          active_users?: number | null
          amount?: number | null
          billing_cycle?: string | null
          block_id?: string | null
          block_seats?: number | null
          change_reason?: string | null
          company_id: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          contract_value?: number | null
          created_at?: string
          currency?: string | null
          discount_percent?: number | null
          discount_reason?: string | null
          discount_target?: string | null
          discount_valid_until?: string | null
          end_date?: string | null
          id?: string
          incremental_rate?: number | null
          incremental_seats?: number | null
          last_payment_date?: string | null
          notes?: string | null
          payment_method?: string | null
          plan_name?: string
          plan_status?: string
          po_number?: string | null
          renewal_date?: string | null
          seats_included?: number | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          active_users?: number | null
          amount?: number | null
          billing_cycle?: string | null
          block_id?: string | null
          block_seats?: number | null
          change_reason?: string | null
          company_id?: string
          contract_end_date?: string | null
          contract_start_date?: string | null
          contract_value?: number | null
          created_at?: string
          currency?: string | null
          discount_percent?: number | null
          discount_reason?: string | null
          discount_target?: string | null
          discount_valid_until?: string | null
          end_date?: string | null
          id?: string
          incremental_rate?: number | null
          incremental_seats?: number | null
          last_payment_date?: string | null
          notes?: string | null
          payment_method?: string | null
          plan_name?: string
          plan_status?: string
          po_number?: string | null
          renewal_date?: string | null
          seats_included?: number | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      competencies: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competencies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      content_analytics: {
        Row: {
          action_type: string
          completion_percentage: number | null
          content_id: string
          created_at: string
          feedback: string | null
          id: string
          metadata: Json | null
          rating: number | null
          session_duration_seconds: number | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          completion_percentage?: number | null
          content_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          metadata?: Json | null
          rating?: number | null
          session_duration_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          completion_percentage?: number | null
          content_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          metadata?: Json | null
          rating?: number | null
          session_duration_seconds?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          color: string | null
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          category_id: string | null
          company_id: string | null
          content_type: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          file_format: string | null
          file_path: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_active: boolean | null
          language: string | null
          page_count: number | null
          slide_count: number | null
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category_id?: string | null
          company_id?: string | null
          content_type: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          file_format?: string | null
          file_path?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          page_count?: number | null
          slide_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category_id?: string | null
          company_id?: string | null
          content_type?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          file_format?: string | null
          file_path?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          page_count?: number | null
          slide_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      content_media: {
        Row: {
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          external_id: string | null
          file_size: number | null
          id: string
          is_active: boolean | null
          media_type: string
          provider: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          external_id?: string | null
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          media_type: string
          provider?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          external_id?: string | null
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          media_type?: string
          provider?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      content_tag_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          content_id: string
          id: string
          tag_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          content_id: string
          id?: string
          tag_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          content_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "content_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      content_tags: {
        Row: {
          category: string
          color: string | null
          company_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          category: string
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          category?: string
          color?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          change_notes: string | null
          content_id: string
          content_type: string
          created_at: string
          created_by: string | null
          description: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          quality_score: number | null
          title: string
          version_number: number
        }
        Insert: {
          change_notes?: string | null
          content_id: string
          content_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          quality_score?: number | null
          title: string
          version_number?: number
        }
        Update: {
          change_notes?: string | null
          content_id?: string
          content_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          quality_score?: number | null
          title?: string
          version_number?: number
        }
        Relationships: []
      }
      departments: {
        Row: {
          company_id: string | null
          created_at: string
          employee_count: number | null
          id: string
          is_active: boolean | null
          location: string | null
          manager_name: string | null
          name: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          employee_count?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          manager_name?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          employee_count?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          manager_name?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          audience: string
          audience_company_ids: string[] | null
          body: string
          created_at: string
          created_by: string | null
          id: string
          open_rate: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          template: string | null
          updated_at: string
        }
        Insert: {
          audience?: string
          audience_company_ids?: string[] | null
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          open_rate?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template?: string | null
          updated_at?: string
        }
        Update: {
          audience?: string
          audience_company_ids?: string[] | null
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          open_rate?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          default_body: string | null
          default_subject: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          default_body?: string | null
          default_subject?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          default_body?: string | null
          default_subject?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      employee_details: {
        Row: {
          aadhar_number: string | null
          address: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          esi_number: string | null
          experience: string | null
          id: string
          marital_status: string | null
          nationality: string | null
          pan_number: string | null
          pf_number: string | null
          profile_id: string
          qualification: string | null
          salary: string | null
          shift_timing: string | null
          skills: string | null
          updated_at: string
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          esi_number?: string | null
          experience?: string | null
          id?: string
          marital_status?: string | null
          nationality?: string | null
          pan_number?: string | null
          pf_number?: string | null
          profile_id: string
          qualification?: string | null
          salary?: string | null
          shift_timing?: string | null
          skills?: string | null
          updated_at?: string
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          esi_number?: string | null
          experience?: string | null
          id?: string
          marital_status?: string | null
          nationality?: string | null
          pan_number?: string | null
          pf_number?: string | null
          profile_id?: string
          qualification?: string | null
          salary?: string | null
          shift_timing?: string | null
          skills?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_assessments: {
        Row: {
          assessment_id: string
          assessment_purpose: string
          created_at: string | null
          event_id: string
          id: string
          is_mandatory: boolean | null
          session_id: string | null
        }
        Insert: {
          assessment_id: string
          assessment_purpose: string
          created_at?: string | null
          event_id: string
          id?: string
          is_mandatory?: boolean | null
          session_id?: string | null
        }
        Update: {
          assessment_id?: string
          assessment_purpose?: string
          created_at?: string | null
          event_id?: string
          id?: string
          is_mandatory?: boolean | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_assessments_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_assessments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_assessments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "event_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_enrollments: {
        Row: {
          completed_at: string | null
          employee_id: string
          enrolled_at: string | null
          enrolled_by: string | null
          enrollment_status: string | null
          event_id: string
          id: string
        }
        Insert: {
          completed_at?: string | null
          employee_id: string
          enrolled_at?: string | null
          enrolled_by?: string | null
          enrollment_status?: string | null
          event_id: string
          id?: string
        }
        Update: {
          completed_at?: string | null
          employee_id?: string
          enrolled_at?: string | null
          enrolled_by?: string | null
          enrollment_status?: string | null
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_enrollments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_enrollments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string | null
          event_id: string
          id: string
          is_active: boolean | null
          session_date: string
          session_order: number | null
          start_time: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_id: string
          id?: string
          is_active?: boolean | null
          session_date: string
          session_order?: number | null
          start_time?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_id?: string
          id?: string
          is_active?: boolean | null
          session_date?: string
          session_order?: number | null
          start_time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_trainers: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          role: string | null
          trainer_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          role?: string | null
          trainer_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          role?: string | null
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_trainers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_trainers_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          budget_allocated: number | null
          budget_spent: number | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          end_time: string | null
          event_type: string
          id: string
          is_active: boolean | null
          location_id: string | null
          max_participants: number | null
          meeting_link: string | null
          program_id: string | null
          start_date: string
          start_time: string | null
          status: string | null
          title: string
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          budget_allocated?: number | null
          budget_spent?: number | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          end_time?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          program_id?: string | null
          start_date: string
          start_time?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          budget_allocated?: number | null
          budget_spent?: number | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          end_time?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          max_participants?: number | null
          meeting_link?: string | null
          program_id?: string | null
          start_date?: string
          start_time?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      job_roles: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string | null
          id: string
          is_active: boolean | null
          level: string
          skill_requirements: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level: string
          skill_requirements?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: string
          skill_requirements?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "organizational_units"
            referencedColumns: ["id"]
          },
        ]
      }
      kirkpatrick_evaluations: {
        Row: {
          created_at: string
          enrollment_id: string
          evaluation_date: string
          id: string
          level: string
          metric_name: string
          notes: string | null
          score: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          enrollment_id: string
          evaluation_date?: string
          id?: string
          level: string
          metric_name: string
          notes?: string | null
          score: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          enrollment_id?: string
          evaluation_date?: string
          id?: string
          level?: string
          metric_name?: string
          notes?: string | null
          score?: number
          updated_at?: string
        }
        Relationships: []
      }
      laser_action_tasks: {
        Row: {
          assigned_by: string | null
          checklist: Json | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          employee_id: string
          id: string
          intervention_id: string | null
          status: string
          supervisor_notes: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          checklist?: Json | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          employee_id: string
          id?: string
          intervention_id?: string | null
          status?: string
          supervisor_notes?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          checklist?: Json | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          employee_id?: string
          id?: string
          intervention_id?: string | null
          status?: string
          supervisor_notes?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "laser_action_tasks_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_action_tasks_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_action_tasks_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "laser_assigned_interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_assigned_interventions: {
        Row: {
          assigned_at: string
          cause_intervention_id: string | null
          completed_at: string | null
          created_at: string
          deviation_id: string
          employee_id: string
          id: string
          intervention_type: string
          learning_path_id: string | null
          micro_intervention_content: string | null
          micro_intervention_title: string | null
          program_id: string | null
          rca_result_id: string
          started_at: string | null
          status: string
        }
        Insert: {
          assigned_at?: string
          cause_intervention_id?: string | null
          completed_at?: string | null
          created_at?: string
          deviation_id: string
          employee_id: string
          id?: string
          intervention_type: string
          learning_path_id?: string | null
          micro_intervention_content?: string | null
          micro_intervention_title?: string | null
          program_id?: string | null
          rca_result_id: string
          started_at?: string | null
          status?: string
        }
        Update: {
          assigned_at?: string
          cause_intervention_id?: string | null
          completed_at?: string | null
          created_at?: string
          deviation_id?: string
          employee_id?: string
          id?: string
          intervention_type?: string
          learning_path_id?: string | null
          micro_intervention_content?: string | null
          micro_intervention_title?: string | null
          program_id?: string | null
          rca_result_id?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "laser_assigned_interventions_cause_intervention_id_fkey"
            columns: ["cause_intervention_id"]
            isOneToOne: false
            referencedRelation: "laser_cause_interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_assigned_interventions_deviation_id_fkey"
            columns: ["deviation_id"]
            isOneToOne: false
            referencedRelation: "laser_deviations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_assigned_interventions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_assigned_interventions_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_assigned_interventions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_assigned_interventions_rca_result_id_fkey"
            columns: ["rca_result_id"]
            isOneToOne: false
            referencedRelation: "laser_rca_results"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_cause_definitions: {
        Row: {
          cause_category: string
          cause_name: string
          created_at: string
          default_weight: number
          description: string | null
          escalation_target: string | null
          id: string
          is_active: boolean | null
          kpi_id: string
          requires_training: boolean | null
          updated_at: string
        }
        Insert: {
          cause_category?: string
          cause_name: string
          created_at?: string
          default_weight?: number
          description?: string | null
          escalation_target?: string | null
          id?: string
          is_active?: boolean | null
          kpi_id: string
          requires_training?: boolean | null
          updated_at?: string
        }
        Update: {
          cause_category?: string
          cause_name?: string
          created_at?: string
          default_weight?: number
          description?: string | null
          escalation_target?: string | null
          id?: string
          is_active?: boolean | null
          kpi_id?: string
          requires_training?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "laser_cause_definitions_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "laser_kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_cause_interventions: {
        Row: {
          cause_id: string
          created_at: string
          id: string
          intervention_type: string
          is_active: boolean | null
          learning_path_id: string | null
          micro_intervention_content: string | null
          micro_intervention_title: string | null
          micro_intervention_type: string | null
          priority: number | null
          program_id: string | null
        }
        Insert: {
          cause_id: string
          created_at?: string
          id?: string
          intervention_type?: string
          is_active?: boolean | null
          learning_path_id?: string | null
          micro_intervention_content?: string | null
          micro_intervention_title?: string | null
          micro_intervention_type?: string | null
          priority?: number | null
          program_id?: string | null
        }
        Update: {
          cause_id?: string
          created_at?: string
          id?: string
          intervention_type?: string
          is_active?: boolean | null
          learning_path_id?: string | null
          micro_intervention_content?: string | null
          micro_intervention_title?: string | null
          micro_intervention_type?: string | null
          priority?: number | null
          program_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laser_cause_interventions_cause_id_fkey"
            columns: ["cause_id"]
            isOneToOne: false
            referencedRelation: "laser_cause_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_cause_interventions_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_cause_interventions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_data_sources: {
        Row: {
          api_endpoint: string | null
          api_key_encrypted: string | null
          config_data: Json | null
          created_at: string
          created_by: string | null
          id: string
          last_sync_at: string | null
          name: string
          source_type: string
          status: string | null
          sync_frequency: string | null
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          config_data?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_sync_at?: string | null
          name: string
          source_type?: string
          status?: string | null
          sync_frequency?: string | null
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          api_key_encrypted?: string | null
          config_data?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_sync_at?: string | null
          name?: string
          source_type?: string
          status?: string | null
          sync_frequency?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      laser_deviations: {
        Row: {
          actual_value: number
          created_at: string
          detected_at: string
          deviation_percentage: number
          employee_id: string
          id: string
          kpi_id: string
          resolved_at: string | null
          role_kpi_mapping_id: string
          severity: string
          status: string
          target_value: number
        }
        Insert: {
          actual_value: number
          created_at?: string
          detected_at?: string
          deviation_percentage: number
          employee_id: string
          id?: string
          kpi_id: string
          resolved_at?: string | null
          role_kpi_mapping_id: string
          severity?: string
          status?: string
          target_value: number
        }
        Update: {
          actual_value?: number
          created_at?: string
          detected_at?: string
          deviation_percentage?: number
          employee_id?: string
          id?: string
          kpi_id?: string
          resolved_at?: string | null
          role_kpi_mapping_id?: string
          severity?: string
          status?: string
          target_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "laser_deviations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_deviations_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "laser_kpi_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_deviations_role_kpi_mapping_id_fkey"
            columns: ["role_kpi_mapping_id"]
            isOneToOne: false
            referencedRelation: "laser_role_kpi_mappings"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_impact_validations: {
        Row: {
          created_at: string
          id: string
          improvement_percentage: number | null
          intervention_id: string
          kpi_id: string
          measurement_date: string | null
          notes: string | null
          post_intervention_value: number | null
          pre_intervention_value: number
          updated_at: string
          validation_status: string
        }
        Insert: {
          created_at?: string
          id?: string
          improvement_percentage?: number | null
          intervention_id: string
          kpi_id: string
          measurement_date?: string | null
          notes?: string | null
          post_intervention_value?: number | null
          pre_intervention_value: number
          updated_at?: string
          validation_status?: string
        }
        Update: {
          created_at?: string
          id?: string
          improvement_percentage?: number | null
          intervention_id?: string
          kpi_id?: string
          measurement_date?: string | null
          notes?: string | null
          post_intervention_value?: number | null
          pre_intervention_value?: number
          updated_at?: string
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "laser_impact_validations_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "laser_assigned_interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_impact_validations_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "laser_kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_kpi_definitions: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          measurement_frequency: string
          name: string
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          measurement_frequency?: string
          name: string
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          measurement_frequency?: string
          name?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      laser_learning_diary: {
        Row: {
          created_at: string
          description: string | null
          employee_id: string
          entry_type: string
          id: string
          performance_improvement_note: string | null
          related_intervention_id: string | null
          related_kpi_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employee_id: string
          entry_type?: string
          id?: string
          performance_improvement_note?: string | null
          related_intervention_id?: string | null
          related_kpi_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employee_id?: string
          entry_type?: string
          id?: string
          performance_improvement_note?: string | null
          related_intervention_id?: string | null
          related_kpi_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "laser_learning_diary_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_learning_diary_related_intervention_id_fkey"
            columns: ["related_intervention_id"]
            isOneToOne: false
            referencedRelation: "laser_assigned_interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_learning_diary_related_kpi_id_fkey"
            columns: ["related_kpi_id"]
            isOneToOne: false
            referencedRelation: "laser_kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_manager_feedback: {
        Row: {
          created_at: string
          employee_id: string
          feedback_type: string
          id: string
          is_read: boolean
          manager_id: string
          message: string
          related_intervention_id: string | null
        }
        Insert: {
          created_at?: string
          employee_id: string
          feedback_type?: string
          id?: string
          is_read?: boolean
          manager_id: string
          message: string
          related_intervention_id?: string | null
        }
        Update: {
          created_at?: string
          employee_id?: string
          feedback_type?: string
          id?: string
          is_read?: boolean
          manager_id?: string
          message?: string
          related_intervention_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laser_manager_feedback_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_manager_feedback_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_manager_feedback_related_intervention_id_fkey"
            columns: ["related_intervention_id"]
            isOneToOne: false
            referencedRelation: "laser_assigned_interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_pattern_repository: {
        Row: {
          avg_improvement_percentage: number | null
          cause_id: string
          created_at: string
          failure_count: number | null
          id: string
          kpi_id: string
          last_updated_at: string
          refined_weight: number | null
          success_count: number | null
        }
        Insert: {
          avg_improvement_percentage?: number | null
          cause_id: string
          created_at?: string
          failure_count?: number | null
          id?: string
          kpi_id: string
          last_updated_at?: string
          refined_weight?: number | null
          success_count?: number | null
        }
        Update: {
          avg_improvement_percentage?: number | null
          cause_id?: string
          created_at?: string
          failure_count?: number | null
          id?: string
          kpi_id?: string
          last_updated_at?: string
          refined_weight?: number | null
          success_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "laser_pattern_repository_cause_id_fkey"
            columns: ["cause_id"]
            isOneToOne: false
            referencedRelation: "laser_cause_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_pattern_repository_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "laser_kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_performance_signals: {
        Row: {
          batch_id: string | null
          created_at: string
          employee_id: string
          id: string
          kpi_id: string
          kpi_value: number
          measurement_date: string
          operational_context: Json | null
          source: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          employee_id: string
          id?: string
          kpi_id: string
          kpi_value: number
          measurement_date?: string
          operational_context?: Json | null
          source?: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          kpi_id?: string
          kpi_value?: number
          measurement_date?: string
          operational_context?: Json | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "laser_performance_signals_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_performance_signals_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "laser_kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_rca_results: {
        Row: {
          analysis_data: Json | null
          cause_id: string
          created_at: string
          deviation_id: string
          id: string
          is_primary_cause: boolean | null
          probability_score: number
        }
        Insert: {
          analysis_data?: Json | null
          cause_id: string
          created_at?: string
          deviation_id: string
          id?: string
          is_primary_cause?: boolean | null
          probability_score?: number
        }
        Update: {
          analysis_data?: Json | null
          cause_id?: string
          created_at?: string
          deviation_id?: string
          id?: string
          is_primary_cause?: boolean | null
          probability_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "laser_rca_results_cause_id_fkey"
            columns: ["cause_id"]
            isOneToOne: false
            referencedRelation: "laser_cause_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_rca_results_deviation_id_fkey"
            columns: ["deviation_id"]
            isOneToOne: false
            referencedRelation: "laser_deviations"
            referencedColumns: ["id"]
          },
        ]
      }
      laser_role_kpi_mappings: {
        Row: {
          comparison_operator: string
          created_at: string
          id: string
          is_active: boolean | null
          job_role_id: string
          kpi_id: string
          target_value: number
          threshold_critical: number
          threshold_warning: number
          updated_at: string
        }
        Insert: {
          comparison_operator?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          job_role_id: string
          kpi_id: string
          target_value: number
          threshold_critical: number
          threshold_warning: number
          updated_at?: string
        }
        Update: {
          comparison_operator?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          job_role_id?: string
          kpi_id?: string
          target_value?: number
          threshold_critical?: number
          threshold_warning?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "laser_role_kpi_mappings_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laser_role_kpi_mappings_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "laser_kpi_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_path_modules: {
        Row: {
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          is_required: boolean | null
          learning_path_id: string
          order_index: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_required?: boolean | null
          learning_path_id: string
          order_index: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_required?: boolean | null
          learning_path_id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_modules_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          assessment_enabled: boolean | null
          category: string | null
          certification_enabled: boolean | null
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          level: string
          prerequisites: Json | null
          required_experience_level: string | null
          title: string
          total_duration_hours: number | null
          updated_at: string
        }
        Insert: {
          assessment_enabled?: boolean | null
          category?: string | null
          certification_enabled?: boolean | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level: string
          prerequisites?: Json | null
          required_experience_level?: string | null
          title: string
          total_duration_hours?: number | null
          updated_at?: string
        }
        Update: {
          assessment_enabled?: boolean | null
          category?: string | null
          certification_enabled?: boolean | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level?: string
          prerequisites?: Json | null
          required_experience_level?: string | null
          title?: string
          total_duration_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_preferences: {
        Row: {
          career_goals: string[] | null
          created_at: string | null
          difficulty_preference: string | null
          id: string
          job_role: string | null
          learning_schedule: Json | null
          preferred_duration_minutes: number | null
          preferred_learning_style: string | null
          timezone: string | null
          topics_of_interest: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          career_goals?: string[] | null
          created_at?: string | null
          difficulty_preference?: string | null
          id?: string
          job_role?: string | null
          learning_schedule?: Json | null
          preferred_duration_minutes?: number | null
          preferred_learning_style?: string | null
          timezone?: string | null
          topics_of_interest?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          career_goals?: string[] | null
          created_at?: string | null
          difficulty_preference?: string | null
          id?: string
          job_role?: string | null
          learning_schedule?: Json | null
          preferred_duration_minutes?: number | null
          preferred_learning_style?: string | null
          timezone?: string | null
          topics_of_interest?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      library_books: {
        Row: {
          author: string
          availability: string
          category: string | null
          company_id: string | null
          condition: string | null
          created_at: string
          id: string
          isbn: string | null
          location: string | null
          notes: string | null
          purchase_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          availability?: string
          category?: string | null
          company_id?: string | null
          condition?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          location?: string | null
          notes?: string | null
          purchase_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          availability?: string
          category?: string | null
          company_id?: string | null
          condition?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          location?: string | null
          notes?: string | null
          purchase_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_books_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      library_checkout_records: {
        Row: {
          book_id: string
          checkout_date: string
          created_at: string
          due_date: string | null
          id: string
          notes: string | null
          renewal_count: number | null
          return_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          checkout_date?: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          renewal_count?: number | null
          return_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          checkout_date?: string
          created_at?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          renewal_count?: number | null
          return_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_checkout_records_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_checkout_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      library_reservations: {
        Row: {
          book_id: string
          created_at: string
          expiry_date: string
          id: string
          notification_sent: boolean | null
          reservation_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          expiry_date?: string
          id?: string
          notification_sent?: boolean | null
          reservation_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          expiry_date?: string
          id?: string
          notification_sent?: boolean | null
          reservation_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_reservations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      library_resources: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          is_active: boolean
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_active?: boolean
          resource_type: string
          tags?: string[] | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_active?: boolean
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_resources_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      location_types: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          company_id: string | null
          created_at: string
          department_count: number | null
          employee_count: number | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          type: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_id?: string | null
          created_at?: string
          department_count?: number | null
          employee_count?: number | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_id?: string | null
          created_at?: string
          department_count?: number | null
          employee_count?: number | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      lti_content_items: {
        Row: {
          created_at: string
          custom_parameters: Json | null
          id: string
          iframe_height: number | null
          iframe_width: number | null
          is_active: boolean | null
          media_type: string | null
          text: string | null
          thumbnail_url: string | null
          title: string
          tool_id: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          custom_parameters?: Json | null
          id?: string
          iframe_height?: number | null
          iframe_width?: number | null
          is_active?: boolean | null
          media_type?: string | null
          text?: string | null
          thumbnail_url?: string | null
          title: string
          tool_id: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          custom_parameters?: Json | null
          id?: string
          iframe_height?: number | null
          iframe_width?: number | null
          is_active?: boolean | null
          media_type?: string | null
          text?: string | null
          thumbnail_url?: string | null
          title?: string
          tool_id?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lti_content_items_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "lti_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      lti_grade_passback: {
        Row: {
          attempted_at: string
          error_message: string | null
          grade_scale: string | null
          grade_value: number | null
          id: string
          launch_id: string
          passback_url: string
          response_body: string | null
          response_code: number | null
          result_status: string | null
          source_did: string
          succeeded_at: string | null
        }
        Insert: {
          attempted_at?: string
          error_message?: string | null
          grade_scale?: string | null
          grade_value?: number | null
          id?: string
          launch_id: string
          passback_url: string
          response_body?: string | null
          response_code?: number | null
          result_status?: string | null
          source_did: string
          succeeded_at?: string | null
        }
        Update: {
          attempted_at?: string
          error_message?: string | null
          grade_scale?: string | null
          grade_value?: number | null
          id?: string
          launch_id?: string
          passback_url?: string
          response_body?: string | null
          response_code?: number | null
          result_status?: string | null
          source_did?: string
          succeeded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lti_grade_passback_launch_id_fkey"
            columns: ["launch_id"]
            isOneToOne: false
            referencedRelation: "lti_launches"
            referencedColumns: ["id"]
          },
        ]
      }
      lti_jwks: {
        Row: {
          algorithm: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_id: string
          key_type: string
          private_key_encrypted: string | null
          public_key: string
          use_type: string | null
        }
        Insert: {
          algorithm: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_id: string
          key_type: string
          private_key_encrypted?: string | null
          public_key: string
          use_type?: string | null
        }
        Update: {
          algorithm?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_id?: string
          key_type?: string
          private_key_encrypted?: string | null
          public_key?: string
          use_type?: string | null
        }
        Relationships: []
      }
      lti_launches: {
        Row: {
          completed_at: string | null
          context_id: string | null
          context_label: string | null
          context_title: string | null
          context_type: string | null
          custom_parameters: Json | null
          grade_passback_url: string | null
          grade_received: number | null
          id: string
          id_token: string | null
          ip_address: unknown
          last_accessed_at: string | null
          launch_parameters: Json | null
          launch_url: string
          launched_at: string
          lis_outcome_service_url: string | null
          lis_person_contact_email_primary: string | null
          lis_person_name_family: string | null
          lis_person_name_full: string | null
          lis_person_name_given: string | null
          lis_result_sourcedid: string | null
          lti_message_type: string | null
          lti_version: string | null
          nonce_parameter: string | null
          oauth_consumer_key: string | null
          oauth_nonce: string | null
          oauth_signature: string | null
          oauth_signature_method: string | null
          oauth_timestamp: number | null
          oauth_version: string | null
          resource_link_description: string | null
          resource_link_id: string | null
          resource_link_title: string | null
          return_url: string | null
          state_parameter: string | null
          status: string | null
          tool_consumer_instance_contact_email: string | null
          tool_consumer_instance_description: string | null
          tool_consumer_instance_guid: string | null
          tool_consumer_instance_name: string | null
          tool_consumer_instance_url: string | null
          tool_id: string
          user_agent: string | null
          user_email: string | null
          user_id: string
          user_roles: string | null
        }
        Insert: {
          completed_at?: string | null
          context_id?: string | null
          context_label?: string | null
          context_title?: string | null
          context_type?: string | null
          custom_parameters?: Json | null
          grade_passback_url?: string | null
          grade_received?: number | null
          id?: string
          id_token?: string | null
          ip_address?: unknown
          last_accessed_at?: string | null
          launch_parameters?: Json | null
          launch_url: string
          launched_at?: string
          lis_outcome_service_url?: string | null
          lis_person_contact_email_primary?: string | null
          lis_person_name_family?: string | null
          lis_person_name_full?: string | null
          lis_person_name_given?: string | null
          lis_result_sourcedid?: string | null
          lti_message_type?: string | null
          lti_version?: string | null
          nonce_parameter?: string | null
          oauth_consumer_key?: string | null
          oauth_nonce?: string | null
          oauth_signature?: string | null
          oauth_signature_method?: string | null
          oauth_timestamp?: number | null
          oauth_version?: string | null
          resource_link_description?: string | null
          resource_link_id?: string | null
          resource_link_title?: string | null
          return_url?: string | null
          state_parameter?: string | null
          status?: string | null
          tool_consumer_instance_contact_email?: string | null
          tool_consumer_instance_description?: string | null
          tool_consumer_instance_guid?: string | null
          tool_consumer_instance_name?: string | null
          tool_consumer_instance_url?: string | null
          tool_id: string
          user_agent?: string | null
          user_email?: string | null
          user_id: string
          user_roles?: string | null
        }
        Update: {
          completed_at?: string | null
          context_id?: string | null
          context_label?: string | null
          context_title?: string | null
          context_type?: string | null
          custom_parameters?: Json | null
          grade_passback_url?: string | null
          grade_received?: number | null
          id?: string
          id_token?: string | null
          ip_address?: unknown
          last_accessed_at?: string | null
          launch_parameters?: Json | null
          launch_url?: string
          launched_at?: string
          lis_outcome_service_url?: string | null
          lis_person_contact_email_primary?: string | null
          lis_person_name_family?: string | null
          lis_person_name_full?: string | null
          lis_person_name_given?: string | null
          lis_result_sourcedid?: string | null
          lti_message_type?: string | null
          lti_version?: string | null
          nonce_parameter?: string | null
          oauth_consumer_key?: string | null
          oauth_nonce?: string | null
          oauth_signature?: string | null
          oauth_signature_method?: string | null
          oauth_timestamp?: number | null
          oauth_version?: string | null
          resource_link_description?: string | null
          resource_link_id?: string | null
          resource_link_title?: string | null
          return_url?: string | null
          state_parameter?: string | null
          status?: string | null
          tool_consumer_instance_contact_email?: string | null
          tool_consumer_instance_description?: string | null
          tool_consumer_instance_guid?: string | null
          tool_consumer_instance_name?: string | null
          tool_consumer_instance_url?: string | null
          tool_id?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string
          user_roles?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lti_launches_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "lti_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      lti_providers: {
        Row: {
          auth_login_url: string | null
          auth_token_url: string | null
          created_at: string
          custom_parameters: Json | null
          deployment_id: string | null
          id: string
          is_active: boolean | null
          issuer: string | null
          key_set_url: string | null
          lti_version: string
          name: string
          platform_id: string | null
          privacy_level: string | null
          updated_at: string
        }
        Insert: {
          auth_login_url?: string | null
          auth_token_url?: string | null
          created_at?: string
          custom_parameters?: Json | null
          deployment_id?: string | null
          id?: string
          is_active?: boolean | null
          issuer?: string | null
          key_set_url?: string | null
          lti_version?: string
          name: string
          platform_id?: string | null
          privacy_level?: string | null
          updated_at?: string
        }
        Update: {
          auth_login_url?: string | null
          auth_token_url?: string | null
          created_at?: string
          custom_parameters?: Json | null
          deployment_id?: string | null
          id?: string
          is_active?: boolean | null
          issuer?: string | null
          key_set_url?: string | null
          lti_version?: string
          name?: string
          platform_id?: string | null
          privacy_level?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lti_sessions: {
        Row: {
          created_at: string
          csrf_token: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          last_activity_at: string | null
          launch_id: string
          session_token: string
        }
        Insert: {
          created_at?: string
          csrf_token?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          last_activity_at?: string | null
          launch_id: string
          session_token: string
        }
        Update: {
          created_at?: string
          csrf_token?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          last_activity_at?: string | null
          launch_id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "lti_sessions_launch_id_fkey"
            columns: ["launch_id"]
            isOneToOne: false
            referencedRelation: "lti_launches"
            referencedColumns: ["id"]
          },
        ]
      }
      lti_tools: {
        Row: {
          assignments_grades_service_enabled: boolean | null
          category: string | null
          client_id: string | null
          consumer_key: string | null
          consumer_secret_encrypted: string | null
          content_item_selection_enabled: boolean | null
          created_at: string
          custom_parameters: Json | null
          deep_linking_enabled: boolean | null
          description: string | null
          grade_passback_enabled: boolean | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          launch_url: string
          name: string
          names_roles_service_enabled: boolean | null
          privacy_level: string | null
          provider_id: string
          public_key: string | null
          public_key_set_url: string | null
          tool_url: string
          updated_at: string
        }
        Insert: {
          assignments_grades_service_enabled?: boolean | null
          category?: string | null
          client_id?: string | null
          consumer_key?: string | null
          consumer_secret_encrypted?: string | null
          content_item_selection_enabled?: boolean | null
          created_at?: string
          custom_parameters?: Json | null
          deep_linking_enabled?: boolean | null
          description?: string | null
          grade_passback_enabled?: boolean | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          launch_url: string
          name: string
          names_roles_service_enabled?: boolean | null
          privacy_level?: string | null
          provider_id: string
          public_key?: string | null
          public_key_set_url?: string | null
          tool_url: string
          updated_at?: string
        }
        Update: {
          assignments_grades_service_enabled?: boolean | null
          category?: string | null
          client_id?: string | null
          consumer_key?: string | null
          consumer_secret_encrypted?: string | null
          content_item_selection_enabled?: boolean | null
          created_at?: string
          custom_parameters?: Json | null
          deep_linking_enabled?: boolean | null
          description?: string | null
          grade_passback_enabled?: boolean | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          launch_url?: string
          name?: string
          names_roles_service_enabled?: boolean | null
          privacy_level?: string | null
          provider_id?: string
          public_key?: string | null
          public_key_set_url?: string | null
          tool_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lti_tools_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "lti_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      mooc_courses: {
        Row: {
          category: string | null
          company_id: string | null
          course_url: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration_weeks: number | null
          external_course_id: string
          id: string
          image_url: string | null
          in_catalog: boolean | null
          instructor: string | null
          is_active: boolean | null
          level: string | null
          organization_enrollments: number | null
          prerequisites: string[] | null
          price: number | null
          provider_id: string
          provider_name: string
          rating: number | null
          skills_covered: string[] | null
          student_count: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          course_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_weeks?: number | null
          external_course_id: string
          id?: string
          image_url?: string | null
          in_catalog?: boolean | null
          instructor?: string | null
          is_active?: boolean | null
          level?: string | null
          organization_enrollments?: number | null
          prerequisites?: string[] | null
          price?: number | null
          provider_id: string
          provider_name: string
          rating?: number | null
          skills_covered?: string[] | null
          student_count?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string | null
          course_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_weeks?: number | null
          external_course_id?: string
          id?: string
          image_url?: string | null
          in_catalog?: boolean | null
          instructor?: string | null
          is_active?: boolean | null
          level?: string | null
          organization_enrollments?: number | null
          prerequisites?: string[] | null
          price?: number | null
          provider_id?: string
          provider_name?: string
          rating?: number | null
          skills_covered?: string[] | null
          student_count?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mooc_courses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mooc_courses_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "mooc_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      mooc_enrollments: {
        Row: {
          certificate_earned: boolean | null
          certificate_url: string | null
          completed_at: string | null
          course_id: string
          created_at: string | null
          due_date: string | null
          enrolled_at: string | null
          enrollment_type: string | null
          external_enrollment_id: string | null
          grade_received: string | null
          id: string
          progress_percentage: number | null
          provider_id: string
          started_at: string | null
          status: string | null
          time_spent_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_earned?: boolean | null
          certificate_url?: string | null
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          due_date?: string | null
          enrolled_at?: string | null
          enrollment_type?: string | null
          external_enrollment_id?: string | null
          grade_received?: string | null
          id?: string
          progress_percentage?: number | null
          provider_id: string
          started_at?: string | null
          status?: string | null
          time_spent_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_earned?: boolean | null
          certificate_url?: string | null
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          due_date?: string | null
          enrolled_at?: string | null
          enrollment_type?: string | null
          external_enrollment_id?: string | null
          grade_received?: string | null
          id?: string
          progress_percentage?: number | null
          provider_id?: string
          started_at?: string | null
          status?: string | null
          time_spent_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mooc_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "mooc_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mooc_enrollments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "mooc_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      mooc_providers: {
        Row: {
          active_enrollments: number | null
          annual_cost: number | null
          api_endpoint: string | null
          client_id: string | null
          client_secret_encrypted: string | null
          company_id: string | null
          config_data: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          monthly_cost: number | null
          name: string
          provider_type: string
          renewal_date: string | null
          seat_limit: number | null
          seats_used: number | null
          status: string | null
          sync_frequency: string | null
          total_courses: number | null
          updated_at: string | null
        }
        Insert: {
          active_enrollments?: number | null
          annual_cost?: number | null
          api_endpoint?: string | null
          client_id?: string | null
          client_secret_encrypted?: string | null
          company_id?: string | null
          config_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          monthly_cost?: number | null
          name: string
          provider_type: string
          renewal_date?: string | null
          seat_limit?: number | null
          seats_used?: number | null
          status?: string | null
          sync_frequency?: string | null
          total_courses?: number | null
          updated_at?: string | null
        }
        Update: {
          active_enrollments?: number | null
          annual_cost?: number | null
          api_endpoint?: string | null
          client_id?: string | null
          client_secret_encrypted?: string | null
          company_id?: string | null
          config_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          monthly_cost?: number | null
          name?: string
          provider_type?: string
          renewal_date?: string | null
          seat_limit?: number | null
          seats_used?: number | null
          status?: string | null
          sync_frequency?: string | null
          total_courses?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mooc_providers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      mooc_sync_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          provider_id: string
          records_created: number | null
          records_processed: number | null
          records_updated: number | null
          started_at: string | null
          status: string | null
          sync_data: Json | null
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          provider_id: string
          records_created?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string | null
          status?: string | null
          sync_data?: Json | null
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          provider_id?: string
          records_created?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string | null
          status?: string | null
          sync_data?: Json | null
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "mooc_sync_logs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "mooc_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          achievement_notifications: boolean | null
          created_at: string | null
          email_enabled: boolean | null
          id: string
          motivation_emails: boolean | null
          phone_number: string | null
          progress_updates: boolean | null
          sms_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_notifications?: boolean | null
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          motivation_emails?: boolean | null
          phone_number?: string | null
          progress_updates?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_notifications?: boolean | null
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          motivation_emails?: boolean | null
          phone_number?: string | null
          progress_updates?: boolean | null
          sms_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      onboarding_checklist: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_done: boolean
          label: string
          onboarding_id: string
          sort_order: number
          target_day: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_done?: boolean
          label: string
          onboarding_id: string
          sort_order?: number
          target_day?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_done?: boolean
          label?: string
          onboarding_id?: string
          sort_order?: number
          target_day?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_checklist_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "tenant_onboarding"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_checklist_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          target_days: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          target_days?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          target_days?: number | null
        }
        Relationships: []
      }
      onboarding_template_items: {
        Row: {
          id: string
          label: string
          sort_order: number
          target_day: string | null
          template_id: string
        }
        Insert: {
          id?: string
          label: string
          sort_order?: number
          target_day?: string | null
          template_id: string
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
          target_day?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "onboarding_checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      organizational_units: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          employee_count: number | null
          id: string
          is_active: boolean | null
          level: string
          manager_name: string | null
          name: string
          parent_id: string | null
          position_x: number | null
          position_y: number | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_count?: number | null
          id?: string
          is_active?: boolean | null
          level: string
          manager_name?: string | null
          name: string
          parent_id?: string | null
          position_x?: number | null
          position_y?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_count?: number | null
          id?: string
          is_active?: boolean | null
          level?: string
          manager_name?: string | null
          name?: string
          parent_id?: string | null
          position_x?: number | null
          position_y?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizational_units_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizational_units_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "organizational_units"
            referencedColumns: ["id"]
          },
        ]
      }
      path_recommendations: {
        Row: {
          clicked_at: string | null
          confidence_score: number
          created_at: string | null
          enrolled_at: string | null
          expires_at: string | null
          id: string
          is_clicked: boolean | null
          is_enrolled: boolean | null
          learning_path_id: string | null
          metadata: Json | null
          reasoning: string | null
          recommendation_type: string
          user_id: string
        }
        Insert: {
          clicked_at?: string | null
          confidence_score?: number
          created_at?: string | null
          enrolled_at?: string | null
          expires_at?: string | null
          id?: string
          is_clicked?: boolean | null
          is_enrolled?: boolean | null
          learning_path_id?: string | null
          metadata?: Json | null
          reasoning?: string | null
          recommendation_type: string
          user_id: string
        }
        Update: {
          clicked_at?: string | null
          confidence_score?: number
          created_at?: string | null
          enrolled_at?: string | null
          expires_at?: string | null
          id?: string
          is_clicked?: boolean | null
          is_enrolled?: boolean | null
          learning_path_id?: string | null
          metadata?: Json | null
          reasoning?: string | null
          recommendation_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "path_recommendations_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string | null
          date_of_joining: string | null
          department: string | null
          email: string | null
          employee_id: string | null
          full_name: string | null
          gender: string | null
          grade: string | null
          id: string
          location: string | null
          manager_id: string | null
          phone: string | null
          position: string | null
          rank: string | null
          sso_provider: string | null
          sso_provider_id: string | null
          updated_at: string | null
          work_type: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          date_of_joining?: string | null
          department?: string | null
          email?: string | null
          employee_id?: string | null
          full_name?: string | null
          gender?: string | null
          grade?: string | null
          id: string
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          position?: string | null
          rank?: string | null
          sso_provider?: string | null
          sso_provider_id?: string | null
          updated_at?: string | null
          work_type?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          date_of_joining?: string | null
          department?: string | null
          email?: string | null
          employee_id?: string | null
          full_name?: string | null
          gender?: string | null
          grade?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          position?: string | null
          rank?: string | null
          sso_provider?: string | null
          sso_provider_id?: string | null
          updated_at?: string | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      program_sessions: {
        Row: {
          company_id: string | null
          created_at: string | null
          current_participants: number | null
          end_date: string
          id: string
          max_participants: number | null
          program_id: string
          start_date: string
          status: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          current_participants?: number | null
          end_date: string
          id?: string
          max_participants?: number | null
          program_id: string
          start_date: string
          status?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          current_participants?: number | null
          end_date?: string
          id?: string
          max_participants?: number | null
          program_id?: string
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_sessions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          company_id: string | null
          created_at: string | null
          faculty: string | null
          icon: string | null
          id: string
          level: string
          multiple_batches: boolean | null
          outline: string
          pre_read_info: string | null
          pre_test_info: string | null
          program_type: string
          theme: string | null
          title: string
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          faculty?: string | null
          icon?: string | null
          id?: string
          level: string
          multiple_batches?: boolean | null
          outline: string
          pre_read_info?: string | null
          pre_test_info?: string | null
          program_type: string
          theme?: string | null
          title: string
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          faculty?: string | null
          icon?: string | null
          id?: string
          level?: string
          multiple_batches?: boolean | null
          outline?: string
          pre_read_info?: string | null
          pre_test_info?: string | null
          program_type?: string
          theme?: string | null
          title?: string
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      question_bank: {
        Row: {
          competency_id: string | null
          correct_answer: string | null
          created_at: string | null
          created_by: string | null
          difficulty_level: string
          explanation: string | null
          id: string
          is_active: boolean | null
          points: number | null
          program_id: string | null
          question_text: string
          question_type: string
          updated_at: string | null
        }
        Insert: {
          competency_id?: string | null
          correct_answer?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty_level: string
          explanation?: string | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          program_id?: string | null
          question_text: string
          question_type: string
          updated_at?: string | null
        }
        Update: {
          competency_id?: string | null
          correct_answer?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty_level?: string
          explanation?: string | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          program_id?: string | null
          question_text?: string
          question_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_bank_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean | null
          option_order: number
          option_text: string
          question_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          option_order: number
          option_text: string
          question_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          option_order?: number
          option_text?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_feedback: {
        Row: {
          comments: string | null
          created_at: string | null
          feedback_type: string
          id: string
          rating: number | null
          recommendation_id: string | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          feedback_type: string
          id?: string
          rating?: number | null
          recommendation_id?: string | null
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          feedback_type?: string
          id?: string
          rating?: number | null
          recommendation_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_feedback_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "path_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      roi_cost_entries: {
        Row: {
          actual: number
          budget: number
          category: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          period: string
          updated_at: string
        }
        Insert: {
          actual?: number
          budget?: number
          category: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          period?: string
          updated_at?: string
        }
        Update: {
          actual?: number
          budget?: number
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          period?: string
          updated_at?: string
        }
        Relationships: []
      }
      roi_impact_metrics: {
        Row: {
          after_value: number
          before_value: number
          created_at: string
          created_by: string | null
          employee_count: number | null
          id: string
          impact_level: string
          measurement_date: string
          metric_name: string
          notes: string | null
          program_id: string | null
          report_status: string
          report_title: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          after_value?: number
          before_value?: number
          created_at?: string
          created_by?: string | null
          employee_count?: number | null
          id?: string
          impact_level?: string
          measurement_date?: string
          metric_name: string
          notes?: string | null
          program_id?: string | null
          report_status?: string
          report_title?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          after_value?: number
          before_value?: number
          created_at?: string
          created_by?: string | null
          employee_count?: number | null
          id?: string
          impact_level?: string
          measurement_date?: string
          metric_name?: string
          notes?: string | null
          program_id?: string | null
          report_status?: string
          report_title?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roi_impact_metrics_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_blocks: {
        Row: {
          annual_rate_per_seat: number | null
          created_at: string
          id: string
          incremental_rate: number
          label: string
          name: string
          notes: string | null
          rate_per_seat: number
          seat_from: number
          seat_to: number
          updated_at: string
        }
        Insert: {
          annual_rate_per_seat?: number | null
          created_at?: string
          id: string
          incremental_rate?: number
          label: string
          name: string
          notes?: string | null
          rate_per_seat: number
          seat_from: number
          seat_to?: number
          updated_at?: string
        }
        Update: {
          annual_rate_per_seat?: number | null
          created_at?: string
          id?: string
          incremental_rate?: number
          label?: string
          name?: string
          notes?: string | null
          rate_per_seat?: number
          seat_from?: number
          seat_to?: number
          updated_at?: string
        }
        Relationships: []
      }
      seat_change_log: {
        Row: {
          change_type: string
          company_id: string
          created_at: string
          details: Json | null
          id: string
          performed_by: string | null
        }
        Insert: {
          change_type: string
          company_id: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
        }
        Update: {
          change_type?: string
          company_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seat_change_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      similar_users: {
        Row: {
          calculated_at: string | null
          id: string
          similar_user_id: string
          similarity_factors: string[] | null
          similarity_score: number
          user_id: string
        }
        Insert: {
          calculated_at?: string | null
          id?: string
          similar_user_id: string
          similarity_factors?: string[] | null
          similarity_score: number
          user_id: string
        }
        Update: {
          calculated_at?: string | null
          id?: string
          similar_user_id?: string
          similarity_factors?: string[] | null
          similarity_score?: number
          user_id?: string
        }
        Relationships: []
      }
      skill_templates: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          department: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          skills: Json
          target_roles: string[] | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          skills?: Json
          target_roles?: string[] | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          skills?: Json
          target_roles?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sso_configurations: {
        Row: {
          client_id: string | null
          client_secret_encrypted: string | null
          company_id: string | null
          created_at: string | null
          domain: string
          id: string
          is_active: boolean | null
          issuer_url: string | null
          metadata_url: string | null
          provider: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          client_secret_encrypted?: string | null
          company_id?: string | null
          created_at?: string | null
          domain: string
          id?: string
          is_active?: boolean | null
          issuer_url?: string | null
          metadata_url?: string | null
          provider: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          client_secret_encrypted?: string | null
          company_id?: string | null
          created_at?: string | null
          domain?: string
          id?: string
          is_active?: boolean | null
          issuer_url?: string | null
          metadata_url?: string | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sso_configurations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_invoices: {
        Row: {
          amount: number
          block_charge: number | null
          block_id: string | null
          company_id: string
          created_at: string
          currency: string
          discount_amount: number | null
          due_date: string
          id: string
          incremental_charge: number | null
          invoice_number: string
          notes: string | null
          payment_date: string | null
          payment_id: string | null
          plan_name: string
          status: string
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount?: number
          block_charge?: number | null
          block_id?: string | null
          company_id: string
          created_at?: string
          currency?: string
          discount_amount?: number | null
          due_date: string
          id?: string
          incremental_charge?: number | null
          invoice_number: string
          notes?: string | null
          payment_date?: string | null
          payment_id?: string | null
          plan_name?: string
          status?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          block_charge?: number | null
          block_id?: string | null
          company_id?: string
          created_at?: string
          currency?: string
          discount_amount?: number | null
          due_date?: string
          id?: string
          incremental_charge?: number | null
          invoice_number?: string
          notes?: string | null
          payment_date?: string | null
          payment_id?: string | null
          plan_name?: string
          status?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "company_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_onboarding: {
        Row: {
          add_to_pipeline: boolean | null
          admin_designation: string | null
          admin_email: string | null
          admin_name: string | null
          admin_role: string | null
          auto_configure: boolean | null
          billing_contact_email: string | null
          billing_contact_name: string | null
          billing_same_as_admin: boolean | null
          company_id: string
          content_template: string | null
          contract_start_date: string | null
          create_checklist: boolean | null
          created_at: string
          csm_assigned: string | null
          days_in_pipeline: number
          generate_invoice: boolean | null
          id: string
          internal_notes: string | null
          onboarded_at: string | null
          progress: number
          send_invite: boolean | null
          stage: string
          updated_at: string
          went_live_at: string | null
        }
        Insert: {
          add_to_pipeline?: boolean | null
          admin_designation?: string | null
          admin_email?: string | null
          admin_name?: string | null
          admin_role?: string | null
          auto_configure?: boolean | null
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_same_as_admin?: boolean | null
          company_id: string
          content_template?: string | null
          contract_start_date?: string | null
          create_checklist?: boolean | null
          created_at?: string
          csm_assigned?: string | null
          days_in_pipeline?: number
          generate_invoice?: boolean | null
          id?: string
          internal_notes?: string | null
          onboarded_at?: string | null
          progress?: number
          send_invite?: boolean | null
          stage?: string
          updated_at?: string
          went_live_at?: string | null
        }
        Update: {
          add_to_pipeline?: boolean | null
          admin_designation?: string | null
          admin_email?: string | null
          admin_name?: string | null
          admin_role?: string | null
          auto_configure?: boolean | null
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_same_as_admin?: boolean | null
          company_id?: string
          content_template?: string | null
          contract_start_date?: string | null
          create_checklist?: boolean | null
          created_at?: string
          csm_assigned?: string | null
          days_in_pipeline?: number
          generate_invoice?: boolean | null
          id?: string
          internal_notes?: string | null
          onboarded_at?: string | null
          progress?: number
          send_invite?: boolean | null
          stage?: string
          updated_at?: string
          went_live_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_onboarding_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tna_cycles: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          departments: string[] | null
          end_date: string
          id: string
          locations: string[]
          manager_ratification_required: boolean
          name: string
          roles: string[]
          start_date: string
          status: string
          updated_at: string | null
          workflow_type: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          departments?: string[] | null
          end_date: string
          id?: string
          locations?: string[]
          manager_ratification_required?: boolean
          name: string
          roles?: string[]
          start_date: string
          status?: string
          updated_at?: string | null
          workflow_type?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          departments?: string[] | null
          end_date?: string
          id?: string
          locations?: string[]
          manager_ratification_required?: boolean
          name?: string
          roles?: string[]
          start_date?: string
          status?: string
          updated_at?: string | null
          workflow_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tna_cycles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tni_submissions: {
        Row: {
          created_at: string | null
          cycle_id: string
          employee_comments: string | null
          employee_id: string
          id: string
          manager_approved_at: string | null
          manager_changes_count: number
          manager_comments: string | null
          manager_id: string | null
          manager_modifications: Json | null
          status: string
          submitted_at: string | null
          training_needs: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cycle_id: string
          employee_comments?: string | null
          employee_id: string
          id?: string
          manager_approved_at?: string | null
          manager_changes_count?: number
          manager_comments?: string | null
          manager_id?: string | null
          manager_modifications?: Json | null
          status?: string
          submitted_at?: string | null
          training_needs?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cycle_id?: string
          employee_comments?: string | null
          employee_id?: string
          id?: string
          manager_approved_at?: string | null
          manager_changes_count?: number
          manager_comments?: string | null
          manager_id?: string | null
          manager_modifications?: Json | null
          status?: string
          submitted_at?: string | null
          training_needs?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tni_submissions_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "tna_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_feedback: {
        Row: {
          areas_of_improvement: string | null
          created_at: string | null
          employee_id: string
          event_id: string
          feedback_text: string | null
          id: string
          rating: number | null
          session_id: string | null
          strengths: string | null
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          areas_of_improvement?: string | null
          created_at?: string | null
          employee_id: string
          event_id: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          session_id?: string | null
          strengths?: string | null
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          areas_of_improvement?: string | null
          created_at?: string | null
          employee_id?: string
          event_id?: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          session_id?: string | null
          strengths?: string | null
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_feedback_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_feedback_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "event_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_feedback_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          bio: string | null
          company_id: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          is_external: boolean | null
          location: string | null
          name: string
          phone: string | null
          programs_count: number | null
          rating: number | null
          specialization: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          location?: string | null
          name: string
          phone?: string | null
          programs_count?: number | null
          rating?: number | null
          specialization?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_external?: boolean | null
          location?: string | null
          name?: string
          phone?: string | null
          programs_count?: number | null
          rating?: number | null
          specialization?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programs: {
        Row: {
          category: string
          company_id: string | null
          created_at: string
          departments: string[] | null
          description: string | null
          duration_hours: number | null
          faculty: string | null
          id: string
          is_active: boolean | null
          level: string | null
          locations: string[] | null
          outline: string | null
          prerequisites: string[] | null
          roles: string[] | null
          skills_covered: string[] | null
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          category: string
          company_id?: string | null
          created_at?: string
          departments?: string[] | null
          description?: string | null
          duration_hours?: number | null
          faculty?: string | null
          id?: string
          is_active?: boolean | null
          level?: string | null
          locations?: string[] | null
          outline?: string | null
          prerequisites?: string[] | null
          roles?: string[] | null
          skills_covered?: string[] | null
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          category?: string
          company_id?: string | null
          created_at?: string
          departments?: string[] | null
          description?: string | null
          duration_hours?: number | null
          faculty?: string | null
          id?: string
          is_active?: boolean | null
          level?: string | null
          locations?: string[] | null
          outline?: string | null
          prerequisites?: string[] | null
          roles?: string[] | null
          skills_covered?: string[] | null
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_programs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_assessment_attempts: {
        Row: {
          assessment_id: string
          attempt_number: number
          completed_at: string | null
          created_at: string | null
          id: string
          score: number | null
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          assessment_id: string
          attempt_number: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          assessment_id?: string
          attempt_number?: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          external_credential_id: string | null
          id: string
          user_id: string
          verification_url: string | null
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          external_credential_id?: string | null
          id?: string
          user_id: string
          verification_url?: string | null
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          external_credential_id?: string | null
          id?: string
          user_id?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certification_attempts: {
        Row: {
          attempt_number: number
          certification_id: string
          completed_at: string | null
          created_at: string
          id: string
          passed: boolean | null
          score: number | null
          started_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          attempt_number: number
          certification_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean | null
          score?: number | null
          started_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          attempt_number?: number
          certification_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean | null
          score?: number | null
          started_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_certification_attempts_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certifications: {
        Row: {
          certificate_url: string | null
          certification_id: string
          created_at: string
          credential_id: string
          earned_date: string
          expiry_date: string | null
          id: string
          score: number | null
          status: string | null
          user_id: string
          verification_url: string | null
        }
        Insert: {
          certificate_url?: string | null
          certification_id: string
          created_at?: string
          credential_id: string
          earned_date: string
          expiry_date?: string | null
          id?: string
          score?: number | null
          status?: string | null
          user_id: string
          verification_url?: string | null
        }
        Update: {
          certificate_url?: string | null
          certification_id?: string
          created_at?: string
          credential_id?: string
          earned_date?: string
          expiry_date?: string | null
          id?: string
          score?: number | null
          status?: string | null
          user_id?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_certifications_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_analytics: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          engagement_score: number | null
          id: string
          interaction_count: number | null
          learning_path_id: string | null
          learning_velocity: number | null
          preferred_content_types: string[] | null
          session_end: string | null
          session_start: string | null
          total_time_minutes: number | null
          user_id: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          interaction_count?: number | null
          learning_path_id?: string | null
          learning_velocity?: number | null
          preferred_content_types?: string[] | null
          session_end?: string | null
          session_start?: string | null
          total_time_minutes?: number | null
          user_id: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          interaction_count?: number | null
          learning_path_id?: string | null
          learning_velocity?: number | null
          preferred_content_types?: string[] | null
          session_end?: string | null
          session_start?: string | null
          total_time_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_analytics_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_path_enrollments: {
        Row: {
          completed_at: string | null
          enrolled_at: string
          id: string
          learning_path_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          enrolled_at?: string
          id?: string
          learning_path_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          enrolled_at?: string
          id?: string
          learning_path_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_path_enrollments_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_progress: {
        Row: {
          completed_at: string | null
          id: string
          learning_path_id: string
          module_id: string
          status: string | null
          time_spent_hours: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          learning_path_id: string
          module_id: string
          status?: string | null
          time_spent_hours?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          learning_path_id?: string
          module_id?: string
          status?: string | null
          time_spent_hours?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_progress_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_path_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_program_enrollments: {
        Row: {
          attendance_confirmed: boolean | null
          completed_at: string | null
          date_change_requested: boolean | null
          enrolled_at: string | null
          enrollment_type: string
          id: string
          program_id: string
          requested_session_id: string | null
          session_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          attendance_confirmed?: boolean | null
          completed_at?: string | null
          date_change_requested?: boolean | null
          enrolled_at?: string | null
          enrollment_type: string
          id?: string
          program_id: string
          requested_session_id?: string | null
          session_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          attendance_confirmed?: boolean | null
          completed_at?: string | null
          date_change_requested?: boolean | null
          enrolled_at?: string | null
          enrollment_type?: string
          id?: string
          program_id?: string
          requested_session_id?: string | null
          session_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_program_enrollments_requested_session_id_fkey"
            columns: ["requested_session_id"]
            isOneToOne: false
            referencedRelation: "program_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_program_enrollments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "program_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          processed_at: string | null
          program_id: string | null
          request_type: string
          requested_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          processed_at?: string | null
          program_id?: string | null
          request_type: string
          requested_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          processed_at?: string | null
          program_id?: string | null
          request_type?: string
          requested_date?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_requests_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          scoped_unit_id: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          scoped_unit_id?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          scoped_unit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_scoped_unit_id_fkey"
            columns: ["scoped_unit_id"]
            isOneToOne: false
            referencedRelation: "organizational_units"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          competency_id: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          last_assessed_at: string | null
          proficiency_level: string
          skill_name: string
          source: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          competency_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          last_assessed_at?: string | null
          proficiency_level: string
          skill_name: string
          source?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          competency_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          last_assessed_at?: string | null
          proficiency_level?: string
          skill_name?: string
          source?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          capacity: number | null
          city: string | null
          company_id: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          facilities: string[] | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          location_id: string | null
          name: string
          notes: string | null
          updated_at: string | null
          venue_type: string
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          company_id?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          facilities?: string[] | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          name: string
          notes?: string | null
          updated_at?: string | null
          venue_type?: string
        }
        Update: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          company_id?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          facilities?: string[] | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          name?: string
          notes?: string | null
          updated_at?: string | null
          venue_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "venues_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      question_bank_safe: {
        Row: {
          competency_id: string | null
          created_at: string | null
          difficulty_level: string | null
          id: string | null
          is_active: boolean | null
          points: number | null
          program_id: string | null
          question_text: string | null
          question_type: string | null
        }
        Insert: {
          competency_id?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          id?: string | null
          is_active?: boolean | null
          points?: number | null
          program_id?: string | null
          question_text?: string | null
          question_type?: string | null
        }
        Update: {
          competency_id?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          id?: string | null
          is_active?: boolean | null
          points?: number | null
          program_id?: string | null
          question_text?: string | null
          question_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_bank_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_bank_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options_safe: {
        Row: {
          id: string | null
          option_order: number | null
          option_text: string | null
          question_id: string | null
        }
        Insert: {
          id?: string | null
          option_order?: number | null
          option_text?: string | null
          question_id?: string | null
        }
        Update: {
          id?: string | null
          option_order?: number | null
          option_text?: string | null
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_bank_safe"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_company: {
        Args: { target_company_id: string }
        Returns: boolean
      }
      cleanup_expired_lti_sessions: { Args: never; Returns: number }
      get_user_company_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      log_audit_event: {
        Args: {
          p_action: Database["public"]["Enums"]["audit_action"]
          p_action_description?: string
          p_changed_fields?: string[]
          p_metadata?: Json
          p_new_values?: Json
          p_old_values?: Json
          p_record_id?: string
          p_table_name?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "manager"
        | "trainer"
        | "location_admin"
        | "super_admin"
      audit_action:
        | "INSERT"
        | "UPDATE"
        | "DELETE"
        | "SELECT"
        | "LOGIN"
        | "LOGOUT"
        | "LOGIN_FAILED"
        | "PASSWORD_CHANGE"
        | "PERMISSION_CHANGE"
        | "SIGNATURE"
        | "EXPORT"
        | "IMPORT"
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
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "manager",
        "trainer",
        "location_admin",
        "super_admin",
      ],
      audit_action: [
        "INSERT",
        "UPDATE",
        "DELETE",
        "SELECT",
        "LOGIN",
        "LOGOUT",
        "LOGIN_FAILED",
        "PASSWORD_CHANGE",
        "PERMISSION_CHANGE",
        "SIGNATURE",
        "EXPORT",
        "IMPORT",
      ],
    },
  },
} as const
