# GitHub Scanner – Fullstack Application

This is a fullstack application that scans GitHub repositories and displays relevant data using a GraphQL backend and a React frontend.

## Monorepo Structure

```
.
├── client/      # Frontend (React)
├── server/      # Backend (GraphQL, Node.js)
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites

* Node.js (v18+)
* npm (v9+) or Yarn
* Git

---

## ⚙️ Backend Setup (`server/`)

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment variables

Create an `.env` file based on the provided example:

```bash
cp .env.example .env
```

Set your required environment variables such as:

```
GITHUB_API_URL=https://api.github.com
GITHUB_USER_NAME=your-github-username
```

### 3. Run the development server

```bash
npm run start
```

This will start the GraphQL server on a random available port (or default, if configured).

---

## 🧪 Running Tests

```bash
npm test
```

> ⚠️ Note: Some tests might still be under development or excluded from CI/CD setup.

---

## 💻 Frontend Setup (`client/`)

### 1. Install dependencies

```bash
cd ../client
npm install
```

### 2. Run the frontend app

```bash
npm start
```

The frontend app should be available at: [http://localhost:3000](http://localhost:3000)

Make sure the backend server is running and configured properly to connect.

---

## 📆 Build Production Version

### Backend

```bash
cd server
npm run build
```

### Frontend

```bash
cd client
npm run build
```

---

## ✨ License

MIT License. See `LICENSE` file for details.

---

## ✈ Future Enhancements

* CI/CD pipeline with GitHub Actions
* AWS deployment via EC2 with CloudFormation
* Improve test coverage and enable automated test execution in CI

---

For any questions or issues, feel free to open an issue on the repository.
