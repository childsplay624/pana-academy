-- ============================================================
-- RLS Policies for the courses table
-- Enforces that instructors can only SELECT/UPDATE/DELETE
-- their own courses. Admins can do everything.
-- ============================================================

-- Enable RLS (safe to run even if already enabled)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- ── SELECT ──────────────────────────────────────────────────
-- Public can read published courses (needed for course catalog)
DROP POLICY IF EXISTS "Public can view published courses" ON public.courses;
CREATE POLICY "Public can view published courses"
  ON public.courses FOR SELECT
  TO public
  USING (status = 'published');

-- Authenticated users can view all their own courses regardless of status
DROP POLICY IF EXISTS "Instructors can view own courses" ON public.courses;
CREATE POLICY "Instructors can view own courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());

-- Admins can view ALL courses
DROP POLICY IF EXISTS "Admins can view all courses" ON public.courses;
CREATE POLICY "Admins can view all courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── INSERT ──────────────────────────────────────────────────
-- Instructors and admins can create courses (must set themselves as instructor)
DROP POLICY IF EXISTS "Instructors can create courses" ON public.courses;
CREATE POLICY "Instructors can create courses"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (
    instructor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

-- ── UPDATE ──────────────────────────────────────────────────
-- Instructors can only update THEIR OWN courses
DROP POLICY IF EXISTS "Instructors can update own courses" ON public.courses;
CREATE POLICY "Instructors can update own courses"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

-- Admins can update ANY course
DROP POLICY IF EXISTS "Admins can update all courses" ON public.courses;
CREATE POLICY "Admins can update all courses"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── DELETE ──────────────────────────────────────────────────
-- Only admins can delete courses (instructors cannot delete)
DROP POLICY IF EXISTS "Only admins can delete courses" ON public.courses;
CREATE POLICY "Only admins can delete courses"
  ON public.courses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
