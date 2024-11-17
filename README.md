# Expense Monitoring Dashboard

**<p align="center"><a href="https://fe-production-9e63.up.railway.app/register" target="_blank">Live Demo</a></p>**
This project is a web application for tracking and visualizing personal income and expenses.

## Features

- Transaction management (income and expenses)
- Data visualization through graphs:
  - Pie chart for category distribution
  - Line chart for monthly balance sheet
  - Bar chart for balance sheet
- Authentication system
- Transaction filtering by date, type and category
- Responsive interface built with Tailwind CSS

## Technologies

- React 18
- TypeScript
- Vite
- Chart.js & React-Chartjs-2
- Axios for HTTP requests
- Tailwind CSS for styling
- React Router for navigation

## Quick Start

1. Clone the repository
2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a .env.local file based on .env.example with your API URL:

   ```sh
   REACT_APP_API_URL=http://localhost:8000
   ```

4. Start the development server
   ```sh
   npm start
   ```

The application will be available at http://localhost:3000

## Project structure

```sh
src/
  ├── components/     # Reusable components
  ├── context/       # Authentication context
  ├── pages/         # Page components
  ├── services/      # API Configuration
  ├── styles/        # Global styles
  ├── types/         # Type definitions
  └── utils/         # Utilities
```
