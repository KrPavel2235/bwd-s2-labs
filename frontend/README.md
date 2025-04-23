# Frontend Application

This is a React application built with TypeScript, Vite, and Yarn. It provides a user interface for managing events, including authentication and event listing.

## Features

- User authentication (login/register)
- Protected routes
- Event listing with card-based UI
- Responsive design
- Error handling

## Project Structure

```
src/
├── api/          # API service functions
├── components/   # Reusable UI components
├── pages/        # Page components
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── Events/
│   └── NotFound/
├── types/        # TypeScript type definitions
└── utils/        # Utility functions and hooks
```

## Prerequisites

- Node.js (v14 or higher)
- Yarn package manager

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   yarn install
   ```

## Development

To start the development server:

```
yarn dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To build the application for production:

```
yarn build
```

The built files will be in the `dist` directory.

## API Integration

The application is configured to proxy API requests to `http://localhost:3000`. Update the `vite.config.ts` file if your API is hosted at a different URL.

## Authentication

The application uses JWT tokens for authentication. Tokens are stored in localStorage and included in API requests.

## Error Handling

All API errors are displayed on the page with appropriate error messages. The application does not use alerts, prompts, or confirms for error handling. 