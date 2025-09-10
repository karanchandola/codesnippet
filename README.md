# Code Snippet Manager (Your Project Name)

A full-stack web application designed to help developers save, manage, and share useful code snippets efficiently.

## Motivation

As computer science students, my team and I frequently found ourselves searching for the same useful code snippets online or losing track of elegant solutions we'd previously implemented. This repetitive process was inefficient and often broke our coding workflow.

We wanted to create a simple, centralized solution to this common problem. This platform was built to be a personal and collaborative library for code snippets, allowing users to quickly save, tag, search, and share code, ultimately saving time and boosting productivity.

## Key Features

- **User Authentication:** Secure user registration and login system.
- **CRUD Operations:** Users can Create, Read, Update, and Delete their own code snippets.
- **Tagging System:** Organize snippets with multiple tags for easy categorization.
- **Global Search:** Powerful search functionality to find snippets by title, language, or tag.
- **Voting and Comments:** Community features to vote on useful snippets and leave comments.
- **User Reputation:** A system to rank users based on the quality of their contributions.

## Tech Stack

- **Frontend:** Next.js, React.js, Tailwind CSS
- **Backend:** Node.js
- **Database:** MongoDB
- **API:** REST API

## How to Run Locally

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/codesnippet.git](https://github.com/karanchandola/codesnippet.git)
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file and add the necessary variables (e.g., database connection string).
    ```
    MONGO_URI='your_connection_string'
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```

    
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
