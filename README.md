# clearmind-frontend

A React-based demo frontend for the Tally Assistant, allowing users to ask questions and view responses, with a paginated history of previous interactions. This app communicates with a backend API for all question/answer functionality.

## Features

- **Ask Questions**: Users can submit questions and receive answers from the backend.
- **Paginated History**: View a paginated list of previous questions and answers.
- **Error Handling**: User-friendly error messages for failed requests.
- **Responsive UI**: Clean, modern interface styled with CSS.
- **Environment Configurable**: Backend URL is set via environment variable.

## Tech Stack

- **React** (with hooks)
- **Jest** and **React Testing Library** (for testing)
- **Create React App** (project scaffolding)
- **CSS** (for styling)

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (v6 or higher) or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd clearmind-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add your backend URL:
   ```
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
frontend/
  public/           # Static assets and HTML template
  src/
    hooks/
      useBackend.js # Custom hook for backend API calls
    App.js          # Main application component
    App.css         # App-specific styles
    index.js        # Entry point
    ...             # Other config and test files
  package.json      # Project metadata and scripts
  README.md         # Project documentation
```

## Available Scripts

- `npm start` – Runs the app in development mode.
- `npm test` – Launches the test runner.
- `npm run build` – Builds the app for production.
- `npm run eject` – Ejects the app (not recommended unless necessary).

## Backend API

The frontend expects a backend with the following endpoints:

- `GET /history` – Returns a list of previous questions and answers.
- `POST /ask` – Accepts a question and returns an answer.

The backend URL is configured via the `REACT_APP_BACKEND_URL` environment variable.

## Testing

Basic tests are included using React Testing Library and Jest. Run tests with:

```bash
npm test
```

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.