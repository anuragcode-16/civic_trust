# CivicChain

CivicChain is a decentralized application for community governance and civic engagement. It combines blockchain technology with social features to empower communities to participate in local governance.

## Features

- Community map for identifying local issues and projects
- Governance system for decentralized decision-making
- Project proposal and management
- Issue reporting and tracking
- User authentication and privacy-preserving profiles
- Integration with MetaMask for blockchain transactions

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB
- **Blockchain**: Ethereum, Polygon (Mumbai Testnet)
- **AI Integration**: Google Gemini API for assistance and data analysis

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Gemini API key for AI features
- MetaMask extension for blockchain features

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/civic-chain.git
   cd civic-chain
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy environment variables:
   ```
   cp .env.local.example .env.local
   ```

4. Update the `.env.local` file with your API keys and configuration.

5. Run the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
  - Body: `{ "name": "User Name", "email": "user@example.com", "password": "password" }`
  - Response: User data and JWT token

- **POST /api/auth/login** - Log in existing user
  - Body: `{ "email": "user@example.com", "password": "password" }`
  - Response: User data and JWT token

- **GET /api/user/profile** - Get current user profile (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: User profile data

- **PATCH /api/user/profile** - Update user profile (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: Updated profile fields
  - Response: Success message and updated data

### Projects

- **GET /api/projects** - Get all projects
  - Response: Array of projects

- **POST /api/projects** - Create a new project (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: Project data
  - Response: Created project ID

- **GET /api/projects/:id** - Get a specific project
  - Response: Project data

- **PATCH /api/projects/:id** - Update a project (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: Updated project fields
  - Response: Success message

- **DELETE /api/projects/:id** - Delete a project (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

### Issues

- **GET /api/issues** - Get all issues
  - Response: Array of issues

- **POST /api/issues** - Create a new issue (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: Issue data
  - Response: Created issue ID

- **GET /api/issues/:id** - Get a specific issue
  - Response: Issue data

- **PATCH /api/issues/:id** - Update an issue (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: Updated issue fields
  - Response: Success message

- **DELETE /api/issues/:id** - Delete an issue (protected, admin only)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

### AI Integration

- **POST /api/gemini** - Generate AI responses using Gemini
  - Body: `{ "prompt": "Your prompt here" }`
  - Response: Generated text from Gemini

## License

This project is licensed under the MIT License - see the LICENSE file for details. 