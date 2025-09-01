export type GenerateCertificateParams = {
  _user_id: string;
  _course_id: string;
  _enrollment_id: string;
  _title: string;
  _course_title: string;
  _instructor_name: string;
  _course_duration_hours: number;
  _completion_date?: string;
  _score?: number;
  _grade?: string;
};

export type GenerateCertificateResponse = {
  success: boolean;
  certificate_id?: string;
  error?: string;
};
