export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessments: {
        Row: {
          assessment_type: string
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
            foreignKeyName: "assessments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          badge_type: string
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
        Relationships: []
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
          category: string | null
          created_at: string
          description: string | null
          id: string
          level: string
          title: string
          total_duration_hours: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level: string
          title: string
          total_duration_hours?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level?: string
          title?: string
          total_duration_hours?: number | null
          updated_at?: string
        }
        Relationships: []
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
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
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
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          manager_id: string | null
          position: string | null
          sso_provider: string | null
          sso_provider_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          manager_id?: string | null
          position?: string | null
          sso_provider?: string | null
          sso_provider_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          manager_id?: string | null
          position?: string | null
          sso_provider?: string | null
          sso_provider_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      program_sessions: {
        Row: {
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
        Relationships: []
      }
      sso_configurations: {
        Row: {
          client_id: string | null
          client_secret_encrypted: string | null
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
          created_at?: string | null
          domain?: string
          id?: string
          is_active?: boolean | null
          issuer_url?: string | null
          metadata_url?: string | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_lti_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
