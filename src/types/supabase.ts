export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

import { Testimonial } from './testimonial.types';

export interface Database {
  public: {
    Tables: {
      testimonials: {
        Row: Testimonial;
        Insert: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_date: string
          status: 'not_started' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_date: string
          status?: 'not_started' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_date?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string | null
        }
      }
      schedules: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          course_id: string | null
          course_name: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          course_id?: string | null
          course_name?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          course_id?: string | null
          course_name?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      student_goals: {
        Row: {
          id: string
          user_id: string
          weekly_study_hours: number
          target_courses_completed: number
          target_weekly_streak: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          weekly_study_hours?: number
          target_courses_completed?: number
          target_weekly_streak?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          weekly_study_hours?: number
          target_courses_completed?: number
          target_weekly_streak?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          duration_minutes: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          duration_minutes: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          duration_minutes?: number
          notes?: string | null
          created_at?: string
        }
      }
      student_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          completion_percentage: number
          last_accessed: string
          is_completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          completion_percentage?: number
          last_accessed?: string
          is_completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          completion_percentage?: number
          last_accessed?: string
          is_completed?: boolean
          completed_at?: string | null
        }
      }
      study_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak_days: number
          longest_streak_days: number
          last_studied_date: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak_days?: number
          longest_streak_days?: number
          last_studied_date?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak_days?: number
          longest_streak_days?: number
          last_studied_date?: string
        }
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
