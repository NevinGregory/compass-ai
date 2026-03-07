📄 Project Blueprint: Compass AI
1. App Overview

Compass AI bridge the gap between academic knowledge and industry requirements. It allows users to upload a synthetic resume, compare it against industry-standard job roles, and receive a structured learning roadmap.
Target Audience

    Recent Graduates: To identify high-value certifications.

    Career Switchers: To find transferable skills.

    Mentors: To provide data-backed advice.

2. Core User Flow (The "End-to-End" Path)

    Onboarding (Create): User selects a "Target Role" (from a dropdown) and pastes synthetic resume text into a professional-grade editor.

    The Analysis (View): The system runs the AI extraction. The user sees a dashboard with:

        Match Score (%)

        Skills Found (Pills marked green)

        Missing Skills (Pills marked red)

    The Roadmap (View): A 3-step timeline suggesting specific courses/projects to bridge the "Red" skills.

    The Pivot (Update): User clicks "Add to Profile" on a missing skill they recently learned. The Match Score and Roadmap update dynamically.

    Search/Filter: A library page where users can search through different Role Templates (e.g., "DevOps," "UX Designer") to see requirements.

3. Visual Interface & UX

    Theme: Professional "SaaS" aesthetic. Clean typography (Inter), dark-mode friendly, using Slate and Indigo accents.

    Dashboard Layout:

        Left Sidebar: Navigation (Analyze, Library, My Profile).

        Main Panel: Two-column layout. Left column shows the "Extracted Profile"; Right column shows the "Gap Analysis" and "Learning Path."

    Feedback Loops: Loading skeletons while AI processes; Toast notifications for successful profile updates.

4. Technical Architecture
Tech Stack

    Framework: Next.js 14 (App Router) or React + Vite.

    Styling: Tailwind CSS + Shadcn/UI (for clean components).

    State Management: React Context API or Zustand (to handle the "Profile" state).

    AI Integration: OpenAI API (GPT-4o-mini) or Gemini Pro.

    Testing: Vitest + React Testing Library.

AI Implementation & Fallback

    Primary AI Task (Extract & Categorize):

        Prompt: "Analyze the following resume text. Extract technical skills and categorize them into 'Languages', 'Tools', and 'Frameworks'. Compare them against the [Target Role] requirements."

    Rule-Based Fallback:

        If the API key is missing, or the rate limit is hit, the system switches to a Keyword Matcher.

        Logic: A local dictionary.json contains arrays of keywords per role. The system uses a Case-Insensitive Regex to scan the resume text for these specific strings.

5. Data Schema (Synthetic)

The app will use two primary local JSON files to simulate a database.
data/job_templates.json
code JSON

[
  {
    "id": "role_frontend_01",
    "role_title": "Frontend Developer",
    "required_skills": ["React", "TypeScript", "Tailwind CSS", "Next.js", "Testing Library"],
    "description": "Building modern, responsive user interfaces..."
  }
]

data/synthetic_resumes.json
code JSON

[
  {
    "id": "res_001",
    "name": "Jordan Smith",
    "raw_text": "Recent CS grad with experience in Java, HTML, and basic CSS. Built a weather app using Vanilla JS.",
    "current_skills": ["Java", "HTML", "CSS", "JavaScript"]
  }
]

6. Directory Structure
code Text

/Compass-ai
├── /data
│   ├── job_templates.json      # Synthetic Job Data
│   └── synthetic_resumes.json  # Synthetic User Data
├── /src
│   ├── /components
│   │   ├── Dashboard.tsx       # Main analysis view
│   │   ├── SkillPill.tsx       # Reusable UI tag
│   │   └── Roadmap.tsx         # Visual timeline
│   ├── /services
│   │   ├── aiService.ts        # OpenAI Integration
│   │   └── fallbackService.ts  # Regex-based matching logic
│   ├── /tests
│   │   ├── analyze.test.ts     # Happy path: Successful AI/Fallback match
│   │   └── validation.test.ts  # Edge case: Empty input handling
│   └── App.tsx
├── .env.example                # Template for API keys
├── .gitignore                  # Ensuring .env is never committed
└── README.md

7. Security & Quality Assurance

    Input Validation: The resume input field will have a minimum character count (e.g., 50 chars) and a maximum (e.g., 5000 chars) to prevent API abuse.

    Environment Variables: Use process.env.NEXT_PUBLIC_AI_KEY. The app will check for the existence of this key; if undefined, it defaults to fallbackService.ts and alerts the user: "Running in Offline Mode (Keyword Matching only)."

    Testing Strategy:

        Test 1 (Happy Path): Given a synthetic resume containing "Python" and a "Data Science" role, ensure the match score is calculated correctly.

        Test 2 (Edge Case): Submit a resume containing only emojis or random numbers. Ensure the system returns a "No skills identified" message rather than crashing.