## Installation Requirements

To set up and run the server and client for the application, ensure you have the following prerequisites and dependencies installed.

### Prerequisites
- **Node.js**: Version 18.x or later.
- **npm or yarn**: For managing dependencies.
- **Neo4j Database**: For the graph-based backend.
- **MongoDB**: If used alongside Neo4j for hybrid data handling.

### Installation Steps

1. **Clone the Repository**
  ```bash
  git clone https://github.com/yourusername/yourproject.git
  cd yourproject
  ```

2. **Install Server Dependencies**
  Navigate to the server directory and install dependencies:
  ```bash
  cd server
  npm install
  ```

  **Server Dev Dependencies**
  - **TypeScript**: `typescript@^5.6.3`
  - **Type Definitions**: Types for various libraries (`@types/axios`, `@types/bcrypt`, etc.).
  - **ts-node-dev**: For running TypeScript code during development.

  **Server Main Dependencies**
  - **Neo4j Driver**: `neo4j-driver@^5.26.0` for database interactions.
  - **Mongoose**: `mongoose@^8.8.1` for MongoDB handling.
  - **Express.js**: `express@^4.21.1` for creating the server API.
  - **JSON Web Tokens**: `jsonwebtoken@^9.0.2` for authentication.
  - **Zod**: `zod@^3.23.8` for schema validation.

3. **Install Client Dependencies**
  Navigate to the client directory and install dependencies:
  ```bash
  cd ../client
  npm install
  ```

  **Client Dev Dependencies**
  - **Vite**: `vite@^5.4.10` for fast front-end development and bundling.
  - **ESLint**: `eslint@^9.13.0` for linting.
  - **Tailwind CSS**: `tailwindcss@^3.4.15` for styling.

  **Client Main Dependencies**
  - **React**: `react@^18.3.1` and `react-dom@^18.3.1` for building the front-end.
  - **React Router**: `react-router-dom@^6.28.0` for navigation.
  - **React Hook Form**: `react-hook-form@^7.53.2` for form handling.
  - **Zod**: `zod@^3.23.8` for client-side validation.

4. **Environment Configuration**
  Create `.env` files in both server and client directories with required configurations:
  - **Server**: Add database URIs, API keys, and secrets.
  - **Client**: Add any required public API keys.

5. **Running the Application**
  - **Server**:
    ```bash
    npm run dev
    ```
  - **Client**:
    ```bash
    npm run dev
    ```

  Open the client at `http://localhost:5173` (default Vite dev server port) and ensure the server is running to handle API requests.

### Summary of Commands

| Step            | Command                    |
|-----------------|----------------------------|
| Install Server  | `cd server && npm install` |
| Install Client  | `cd client && npm install` |
| Run Server      | `npm run dev`              |
| Run Client      | `npm run dev`              |
