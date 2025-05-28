# **App Name**: ChartVisionAI

## Core Features:

- Secure Authentication: Google Sign-In using Firebase Authentication for secure, fast user access.
- Image Capture/Upload: Capture or upload trading chart images. Options for using the device camera or selecting a local file. Images stored in Firebase Storage.
- Capture Instructions: Step-by-step guide for best results: Ensure good lighting. Keep the chart flat, centered, and legible. Avoid glare, blur, or cropped areas.
- Detect Trend: Uses OpenAI Vision or GPT-4 to identify chart patterns (e.g., uptrend, downtrend, consolidation), using a LLM to act as an analysis tool.
- Explain Chart: Natural language explanation of the chart type (candlestick, line, bar) and technical indicators. Beginner-friendly tone with definitions, using a LLM to act as an analysis tool.
- Buy/Sell Suggestion: AI-powered buy/sell/hold suggestion based on pattern recognition and chart context, using a LLM to act as an analysis tool.
- Results Display: Clean UI cards to show AI analysis results. Features include copy, share, and download options. Each card includes chart thumbnail + timestamp.
- History: Save previous analyses for each user (chart image, selected option, result, timestamp). Uses Firebase Firestore. Accessible from 'My History' tab.
- Usage Limits & Stripe Integration: Limit: 5 free analyses per day. Add Stripe for subscriptions/unlocks. Upgrade button and pricing modal UI.
- Retry / New Analysis Flow: After viewing results, user can click “Try Another Chart” to restart. Smooth user experience with animated transitions.
- Error Handling & Feedback: AI fails or bad image? Show toast with retry/help option. Show loader animations during API processing.

## Style Guidelines:

- Primary Color: Electric Blue `#7DF9FF` – Highlights, interactive elements
- Accent Color: Vibrant Magenta `#E040FB` – CTAs, alerts
- Background Color: Dark Charcoal `#222233` – Modern, easy on eyes
- Typography: Clean, modern sans-serif (e.g., Inter or Roboto)
- Layout: Minimalist grid with clear hierarchy
- Icons: Minimal and intuitive (e.g., Feather, Material Icons)
- Animations: Smooth transitions, feedback on click/upload
- Theme: Consistent dark mode with neon-style contrast highlights