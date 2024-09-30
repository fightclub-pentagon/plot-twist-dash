# Plot Twist

Plot Twist is a Next.js application where every mystery has a twist, and it's yours to create. This project is built with Next.js, React, and Firebase, offering a modern web development experience with server-side rendering and easy authentication.

## Features

- Next.js 14 with App Router
- React 18
- TypeScript support
- Firebase Authentication (Email/Password, Google, and Microsoft)
- Tailwind CSS for styling
- Shadcn UI components
- Responsive design

## Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://your-repository-url.git
cd plot-twist-dash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Contains the main application pages and layouts
- `components/`: Reusable React components
- `lib/`: Utility functions and server actions
- `public/`: Static assets
- `styles/`: Global styles and Tailwind CSS configuration

## Key Components

### Landing Page

The landing page (`components/page.tsx`) showcases the main features of Plot Twist and provides a link to sign in.

### Authentication

The sign-in page (`app/signin/page.tsx`) offers multiple authentication methods:
- Email/Password
- Google Sign-In
- Microsoft Sign-In

### Firebase Integration

Firebase is used for authentication. The configuration can be found in `firebase.ts`.

## Styling

This project uses Tailwind CSS for styling. The main configuration can be found in `tailwind.config.ts`.

## Environment Variables

To run this project, you need to set up the following environment variables in a `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [React Documentation](https://reactjs.org/) - learn about React.
- [Tailwind CSS](https://tailwindcss.com/) - a utility-first CSS framework.
- [Firebase Documentation](https://firebase.google.com/docs) - learn about Firebase services.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
