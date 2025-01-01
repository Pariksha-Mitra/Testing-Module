# Pariksha Mitra

This repository contains the source code for the Testing Module of Pariksha Mitra, an educational application designed for Marathi medium students from grades 5th to 10th.

## Features

### For Students
- Access to practice tests and exercises
- Chapter-wise question selection
- Interactive learning games for each chapter
- Personalized performance analysis
- Student-specific dashboard

### For Teachers
- Secure authentication system
- Easy test creation and management
- In-depth class performance analytics
- Identification of focus areas
- Teacher-specific dashboard

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for local development)

## Getting Started

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/your-repo.git
    cd your-repo
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Development

### Environment Setup
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/parikshamitra
NEXTAUTH_SECRET=your-secret-key
```

### Available Scripts
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
npm test        # Run test suite
```

## Troubleshooting

Common issues and solutions:

1. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure network connectivity

2. **Build Errors**
   - Clear cache: `rm -rf .next`
   - Reinstall dependencies: `npm ci`