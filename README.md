# SocioPilot Lite

This is a Next.js application, SocioPilot Lite, an AI-powered tool for generating and scheduling social media content. It's built with Next.js (App Router), Tailwind CSS, Firebase (Firestore + Auth), and Genkit for AI capabilities.

## Getting Started

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up Firebase:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Enable Firestore and Firebase Authentication (Google Sign-In method).
    *   Get your Firebase project configuration credentials.
4.  **Configure Environment Variables:**
    *   Create a `.env.local` file in the root of your project.
    *   Add your Firebase configuration details to this file. See `src/lib/firebase/config.ts` for the required variables or copy the example below:

        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
        NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
        ```
    * Ensure your Genkit AI setup (e.g., Google AI API key for Gemini) is also configured as per Genkit's documentation, typically via environment variables that Genkit reads (e.g. `GOOGLE_API_KEY`). This might be in a global `.env` or system environment variables if you are running `genkit dev` separately.

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be available at `http://localhost:9002` (or the port specified in your `package.json` dev script).

6.  **Run Genkit (if needed for local AI flow development/testing):**
    If you are modifying or testing Genkit flows locally, you might need to run the Genkit development server:
    ```bash
    npm run genkit:dev
    ```

## Features

*   **Google Authentication**: Sign in using your Google account.
*   **AI Content Generation**: Provide a topic and get AI-generated captions, hashtags, and content ideas.
*   **Content Scheduling**: Schedule your generated content for various social media platforms.
*   **Dashboard**: View an overview of your scheduled, posted, and failed posts.
*   **Post History**: See a detailed history of all your posts.

## Tech Stack

*   **Frontend**: Next.js (App Router) with React and Tailwind CSS.
*   **Backend/Database/Auth**: Firebase (Firestore, Authentication).
*   **AI**: Google Gemini via Genkit.
*   **UI Components**: ShadCN UI.

## Automated Posting

The current version of SocioPilot Lite allows you to generate content and schedule it by saving it to Firestore. The actual automated posting to social media platforms (Instagram, Facebook, TikTok, YouTube Shorts, Twitter/X) requires additional backend implementation (e.g., Firebase Cloud Functions or Vercel Cron Jobs) to interact with each platform's API. This part is not included in the initial scaffold and needs to be developed separately.
