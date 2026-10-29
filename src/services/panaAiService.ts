import { buildSystemPrompt, PanaAiRoleContext } from './panaAiKnowledge';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SendMessageOptions {
  messages: { role: 'user' | 'assistant'; content: string }[];
  context: PanaAiRoleContext;
  onDelta?: (chunk: string) => void;
}

// Active high-performance Gemini endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';

/**
 * Sends conversation to Gemini via Edge Function or direct Gemini API with fallback
 */
export async function sendPanaAiMessage({
  messages,
  context,
  onDelta,
}: SendMessageOptions): Promise<string> {
  const systemPrompt = buildSystemPrompt(context);

  // 1. Direct Gemini API call if key is provided in client env
  const clientGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (clientGeminiKey) {
    try {
      const geminiPayload = {
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      };

      const res = await fetch(`${GEMINI_API_URL}?key=${clientGeminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      });

      if (res.ok) {
        const data = await res.json();
        const candidateText =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I'm sorry, I couldn't process that response. Please try again.";
        const cleaned = cleanPanaAiResponse(candidateText);
        if (onDelta) onDelta(cleaned);
        return cleaned;
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('Gemini API Error in client:', errData);
      }
    } catch (directErr) {
      console.error('Direct Gemini call failed:', directErr);
    }
  }

  // 2. Fallback to Supabase Edge Function if deployed
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/pana-ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          messages,
          context,
          systemPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          const cleaned = cleanPanaAiResponse(data.text);
          if (onDelta) onDelta(cleaned);
          return cleaned;
        }
      }
    } catch (err) {
      console.warn('Supabase edge function pana-ai-chat call fallback:', err);
    }
  }


  // 3. Graceful offline intelligent rule-based responder (ensures zero crashes and immediate assistance)
  return cleanPanaAiResponse(getOfflineSmartResponse(messages[messages.length - 1]?.content || '', context));
}

/**
 * Sanitizes response to eliminate raw ### headings and course calendar links
 */
export function cleanPanaAiResponse(text: string): string {
  if (!text) return '';
  return text
    // Convert markdown heading lines like "### Heading" or "## Heading" to "**Heading**"
    .replace(/^#{1,6}\s+(.+)$/gm, '**$1**')
    // Remove any remaining stray ### markers
    .replace(/#{2,6}\s*/g, '')
    // Replace any course/training calendar links or mentions with course catalog
    .replace(/\[([^\]]*(?:training|course)\s*calendar[^\]]*)\]\([^)]+\)/gi, '[Browse Courses](/courses)')
    .replace(/\/training-calendar/gi, '/courses');
}

/**
 * Intelligent local responder for common inquiries when API key is not yet configured
 */
function getOfflineSmartResponse(query: string, context: PanaAiRoleContext): string {
  const lower = query.toLowerCase();

  if (lower.includes('syllabus') || lower.includes('brochure') || lower.includes('curriculum') || lower.includes('outline')) {
    return `Here are the details for our specialized technical training curriculums. We would be pleased to email you the full syllabus, module schedule, and corporate pricing.

\`\`\`action:lead_capture
{
  "courseTitle": "PANA Technical Program Syllabus",
  "reason": "Official curriculum syllabus and brochure"
}
\`\`\``;
  }

  if (lower.includes('course') || lower.includes('program') || lower.includes('class') || lower.includes('training') || lower.includes('recommend')) {
    return `Welcome to **PANA Institute**! We offer world-class technical engineering programs across several specialized pillars:
- **Instrumentation & Process Automation** (PLC, SCADA, field transmitters, loop checks)
- **Valves & Actuation Systems** (sizing, calibration, diagnostics)
- **Power & Industrial Drives** (switchgear, motors, VFDs)
- **Safety & Process Hazard Analysis** (HAZOP, LOPA, SIL, functional safety)
- **Sustainability & Energy Transition** (decarbonization, carbon management, renewables)
- **Field & Marine Operations** (offshore asset integrity, maintenance)

👉 Explore our full syllabus and enroll at [Browse All Courses](/courses), or enter your email below to receive the official syllabus & brochure directly:

\`\`\`action:lead_capture
{
  "courseTitle": "Engineering Training Catalog",
  "reason": "Send official syllabus and corporate pricing brochure"
}
\`\`\``;
  }

  if (lower.includes('corporate') || lower.includes('company') || lower.includes('bespoke') || lower.includes('onsite') || lower.includes('team')) {
    return `**PANA Institute** designs tailored corporate technical training programs and asset integrity workshops for national & international energy organizations.
- We support **on-premise plant training**, **live instructor-led virtual sessions**, and **blended e-learning**.
- You can submit inquiries or request an RFP directly through our [Contact Page](/contact), or leave your corporate email below to receive our executive corporate training pack:

\`\`\`action:lead_capture
{
  "courseTitle": "Corporate Technical Training Package",
  "reason": "Corporate on-site and bespoke training prospectus"
}
\`\`\``;
  }

  if (lower.includes('about') && (lower.includes('pana') || lower.includes('institute') || lower.includes('academy') || lower.includes('company') || lower.includes('who are you') || lower.includes('what is pana'))) {
    return `**PANA Institute** (PANA Energy Services Ltd) is a premier center of excellence for technical engineering training, capacity building, consulting, research & development (R&D), and sustainability solutions across Energy, Oil & Gas, Power, and Industrial Automation.

**Our Core Pillars:**
- **Technical Competence & Certifications:** Practical hands-on training aligned with international engineering standards (API, ISO, IEC, IEEE, ASME, ISA) and local regulatory bodies (NCDMB).
- **Engineering Consultancy:** Asset integrity management, debottlenecking, instrumentation audits, and process optimization.
- **R&D & Innovation:** Industry-sponsored applied research, test-bench verification, and prototyping.
- **Sustainability & Energy Transition:** Carbon management, emissions reduction, and renewable energy integration.

👉 Explore our [Course Catalog](/courses), learn about [Consulting Services](/consulting-services), or read our full story on the [About Page](/about).`;
  }

  if (lower.includes('consult') || lower.includes('consulting') || lower.includes('engineering service')) {
    return `**PANA Institute Engineering Consultancy Services** delivers high-impact technical advisory, asset integrity assessments, and process safety solutions to energy operators and industrial plants:
- **Asset Integrity & Reliability:** FMECA, RCM audits, and lifecycle management.
- **Process Automation & Instrumentation Audits:** Control valve diagnostics, SCADA/PLC calibration, and loop health checks.
- **Process Safety & Risk Assessment:** HAZOP, LOPA, SIL calculations, and HSE regulatory compliance.
- **Facility Debottlenecking:** Flow assurance, energy efficiency, and emissions reduction.

👉 You can review our full consulting portfolio at [Consulting Services](/consulting-services), or submit an RFP through our [Contact Page](/contact).`;
  }

  if (lower.includes('certificate') || lower.includes('verify') || lower.includes('credential')) {
    return `Every credential issued by PANA Institute is cryptographically secured with a unique Certificate ID and QR code aligned with international standards (API, ISO, IEC, IEEE, NCDMB).
- **Public Verification:** Anyone, including employers or clients, can verify a credential instantly at the [Verify Certificate Portal](/verify-certificate).
- **For Enrolled Students:** View, download, or share your stamped PDF certificates on LinkedIn via [My Certificates](/student/certificates) (or [Dashboard Certificates](/dashboard/certificates)).`;
  }

  if (lower.includes('contact') || lower.includes('reach') || lower.includes('phone') || lower.includes('email') || lower.includes('location')) {
    return `You can reach the PANA Institute advisory and technical support team directly through our [Contact Page](/contact), or send an inquiry to our training coordinators for customized corporate workshops.`;
  }

  if (context.role === 'admin') {
    return `Hello Admin! As **PANA AI**, I can assist with platform operations:
- Manage enrolled accounts & roles in [User Management](/admin/users)
- Approve or publish courses in [Course Management](/admin/courses)
- Track revenue and transactions in [Payments](/admin/payments)
- Configure platform toggles in [Settings](/admin/settings)

How can I assist your workflow today?`;
  }

  if (context.role === 'student') {
    return `Hello! As your **PANA AI Co-Instructor**, I'm here to support your learning journey.
- Jump back into active lessons in [My Courses](/student/my-courses)
- Check upcoming deadlines and homework in [Assignments](/student/assignments)
- Track your completion scores in [Progress](/student/progress)

Feel free to ask me to explain any engineering concept from your lectures or guide you through your dashboard!`;
  }

  if (context.role === 'instructor') {
    return `Greetings Instructor! I am ready to help you:
- Structure modules and lesson descriptions
- Draft assessment quizzes and rubrics
- Manage student progress on your [Instructor Dashboard](/instructor/dashboard)

What course are you currently preparing?`;
  }

  return `Hello! I am **PANA AI**, your intelligent co-instructor and site guide at PANA Institute.

I can help you:
- 🎓 Discover specialized engineering and technical courses on our [Course Catalog](/courses)
- 📜 Learn about verified [Certificates](/verify-certificate)
- 🏢 Explore [Consulting Services](/consulting) & [Sustainability Solutions](/sustainability)
- 🧭 Navigate any part of your student, instructor, or admin dashboard

What would you like to explore today?`;
}
