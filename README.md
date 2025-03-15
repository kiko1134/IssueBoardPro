# Issue Tracker Web App

This repository contains a university project
for [Web Technologies 2025](https://github.com/kiko1134/Web_Technologies_2025): an issue tracker web application built
collaboratively using React with TypeScript (TSX) on the frontend, Express.js with TypeScript on the backend, and a
MySQL database.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Branching Strategy](#branching-strategy)
- [Installation](#installation)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)

## Features

- **Issue Management:** Create, update, and delete issues.
- **RESTful API:** Built with Express.js in TypeScript to handle all backend operations.
- **Responsive Frontend:** React application using TSX components for a modern, responsive UI.
- **MySQL Database:** Persistent storage for issues and related data.
- **Structured Git Workflow:** A branching strategy that uses `main`, `dev`, and feature branches to maintain code
  quality and simplify integration.

## Technologies

- **Frontend:** React, TypeScript, HTML, CSS
- **Backend:** Express.js, Node.js, TypeScript
- **Database:** MySQL
- **Tooling:** npm, ts-node, nodemon

## Project Structure

```plaintext
Web_Technologies_2025/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Controllers for handling request logic
│   │   ├── middlewares/         # Middleware functions (e.g., error handling)
│   │   ├── models/              # Database models or ORM configurations
│   │   ├── routes/              # Express routes for API endpoints
│   │   ├── services/            # Business logic for issue operations
│   │   ├── app.ts               # Express app configuration
│   │   └── server.ts            # Server startup script
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/        # Reusable React components (e.g., IssueForm, IssueList)
│   │   ├── pages/             # Page components (e.g., Home, IssueDetail)
│   │   ├── App.tsx            # Main application component
│   │   └── index.tsx          # React entry point
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── schema.sql             # SQL script for creating database tables
│   └── seed.sql               # SQL script for seeding initial data
├── .gitignore                 # Global gitignore file for both frontend and backend
└── README.md                  # Project documentation

```

## Branching Strategy

This project follows a structured Git workflow to maintain code quality and simplify collaboration:

- **Main Branch:**\
  Contains production-ready, stable code. Only thoroughly tested features are merged here.

- **Development Branch (dev):**\
  Serves as an integration branch where all feature/issue branches are merged first. This allows comprehensive testing
  before changes are promoted to the `main` branch.

- **Feature/Issue Branches:**\
  Each new feature or bug fix should be developed on its own branch created from `dev`. Once complete and tested, merge
  these branches back into `dev`.

## Installation

``` bash
 git clone
 ```

### Backend Setup

1. Clone the repository and navigate to the `backend` directory:

    ```bash
    cd Web_Technologies_2025/backend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. The server should now be running at `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `frontend` directory:

    ```bash
    cd Web_Technologies_2025/frontend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm start
    ```

4. The React application should now be running at `http://localhost:3000`.

## Development Workflow

- **Local Development:**\
  Develop new features or fix bugs in dedicated feature/issue branches created from the `dev` branch.

- **Code Reviews & Testing:**\
  Once a feature or fix is complete, open a pull request to merge the changes into `dev`. Ensure that your code is
  reviewed and thoroughly tested before merging.

- **Commit Best Practices:**

    - Write clear, descriptive commit messages.
    - Reference any related issues in your commit messages.
    - Keep commits focused.
- **Integration & Deployment:**\
  After merging feature branches into `dev` and completing testing, merge `dev` into `main` to deploy production-ready
  code.

## Contributing

1. Create a new branch for the feature you are working on:

    ```bash
    git checkout -b feature/new-feature
    ```

2. Make changes to the codebase and commit them:

    ```bash
    git add .
    git commit -m "Add new feature"
    ```

3. Push the changes to the remote repository:

    ```bash
    git push origin feature/new-feature
    ```

4. Create a pull request on GitHub and request a code review.

5. Once approved, merge the changes into the `dev` branch:

```bash
        git checkout dev
        git merge feature/new-feature
```

6. Delete the feature branch:

    ```bash
    git branch -d feature/new-feature
    ```

7. Repeat the process for each new feature or bug fix.
8. When ready to deploy, merge the `dev` branch into `main`.


