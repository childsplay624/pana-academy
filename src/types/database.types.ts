// Type definitions for the payments table
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentProvider = 'paystack' | 'flutterwave';

// Base types for the database tables

export interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  provider: PaymentProvider;
  reference: string;
  status: PaymentStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface InsertPayment extends Omit<Payment, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdatePayment extends Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>> {
  updated_at?: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image_initials: string | null;
  avatar_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface InsertTestimonial extends Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'avatar_url' | 'is_active' | 'display_order'> {
  id?: string;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string | null;
}

export interface UpdateTestimonial extends Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>> {
  updated_at?: string;
}

// Extend the Window interface for Flutterwave
declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

// Database schema types
export interface Database {
  public: {
    Tables: {
      payments: {
        Row: Payment;
        Insert: InsertPayment;
        Update: UpdatePayment;
      };
      testimonials: {
        Row: Testimonial;
        Insert: InsertTestimonial;
        Update: UpdateTestimonial;
      };
      // Add other tables as needed
    };
    // Add other schema types as needed
  };
}
