export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  title: string;
  subtitle: string | null;
  description: string;
  full_bio: string | null;
  experience: string[] | any; // JSONB can be string array
  image_key: string | null;
  category: 'board' | 'advisory' | 'governing' | string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InsertTeamMember extends Omit<TeamMember, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateTeamMember extends Partial<Omit<TeamMember, 'id' | 'created_at'>> {
  updated_at?: string;
}
