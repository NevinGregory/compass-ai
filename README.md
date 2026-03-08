## Video 
https://youtu.be/fWLzEembqGI

## Candidate Name
Nevin Gregory

## Scenario Chosen
2. Skill-Bridge Career Navigator

## Estimated Time Spent
4.5 hours

## Quick Start
1. Clone this repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your OpenAI API key
4. Run the development server: `npm run dev`
5. Open http://localhost:5173 to view the app

## AI Disclosure

1. Did you use an AI assistant and which?
   Yes - Claude Opus 4.6 via Claude Code CLI

2. How did you verify the suggestions?
   - Reviewed all generated code for technical correctness and also readability
   - Tested each component as it was built
   - Ran TypeScript type checking to catch errors
   - Had test suites to validate functionality
   - Manually tested the application flow in the browser

3. Give one example of a suggestion you rejected or changed.
   - Claude suggested using PostCSS/Autoprefixer for Tailwind CSS, but I rejected this to keep the build configuration simpler. The project uses Tailwind v4 via the @tailwindcss/vite plugin instead, which handles CSS processing without needing separate PostCSS configuration.

## Tradeoffs & Prioritization

1. What did you cut out to stay within the 4-6 hour limit?
   - Mock Interview Helper: I originally planned to add a feature where users could practice interview questions related to their missing skills with AI-generated prompts and feedback
   - Comprehensive Testing: I would like to have had more tests that are more comprehensive.
   - OCR: Allow users to directly upload their resume in their desired format and extract text.

2. What would you build next if you had more time?
   - Mock Interview Helper: Implement AI-powered interview practice based on missing skills, with question generation and answer feedback to help users prepare for role-specific interviews
   - Career tree visualizer: Let users see possible career paths given their starting point including skills and age.

3. Known Limitations:
   - No Progress Persistence: User data is lost on browser refresh or session end
   - Limited AI Model: Uses GPT-4o-mini which may not extract skills as accurately as larger models
   - Basic Skill Matching: Keyword-based matching may miss context or related technologies
   - No Authentication: Single-user application with no login/authorization
   - Fixed Role Templates: Limited to 4 predefined roles in the current implementation
   - Simplified Roadmap: Learning recommendations are generic rather than personalized
   - Browser-Only: OpenAI API calls are made from the browser (should use backend in production)
