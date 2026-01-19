export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  duration_seconds?: number;
  video_url?: string;
  order_in_module: number;
  is_preview?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  order_in_course: number;
  lessons: Lesson[];
  created_at: string;
  updated_at: string;
}

export type CourseType = 'online' | 'onsite' | 'hybrid';

export interface VenueInfo {
  name: string;
  address: string;
  city: string;
  country: string;
  capacity?: number;
  mapUrl?: string;
}

export interface OnSiteSession {
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  sessionTitle: string;
}

export interface CourseLogistics {
  requiresMaterials: boolean;
  materialsList?: string[];
  parkingInfo?: string;
  accommodationInfo?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  price: number;
  is_published: boolean;
  instructor_id: string;
  category_id?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  course_type: CourseType;
  start_date?: string; // ISO date string - course/event starts
  end_date?: string;   // ISO date string - course/event ends (for multi-day)
  is_free: boolean;

  // Online course fields
  total_lessons?: number;
  total_duration_seconds?: number;
  modules: Module[];
  learning_outcomes?: string[];
  requirements?: string[];

  // On-site course fields
  venue_name?: string;
  venue_address?: string;
  venue_city?: string;
  venue_country?: string;
  venue_capacity?: number;
  venue_map_url?: string;
  onsite_schedule?: OnSiteSession[];
  requires_materials?: boolean;
  materials_list?: string[];
  parking_info?: string;
  accommodation_info?: string;

  // Metadata
  students_count?: number;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string;
  lesson_id: string;
  completed: boolean;
  progress_percentage: number;
  time_spent_seconds: number;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  expires_at?: string;
  download_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  entity_type: string;
  entity_id: string;
  device_info?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}
