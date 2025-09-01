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

export interface InsertTestimonial extends Omit<Testimonial, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateTestimonial extends Partial<Omit<Testimonial, 'id' | 'created_at'>> {
  updated_at?: string;
}
