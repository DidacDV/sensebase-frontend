# Sensebase Frontend

This project uses a lightweight, modern stack to build fast and elegant interfaces.

**Tech stack**
- **React** for UI components  
- **TypeScript** for type-safe development  
- **Vite** for blazing-fast dev and build  
- **Tailwind CSS** for utility-first styling  

**Other Libraries**
- **Nivo** for charts
- **Motion** for animations
- **React router** for routing
---

## Getting started

Clone the repository and install dependencies:
```sh
npm install
```

Before running the application, you must configure the environment variables.

Create a `.env` file in the root directory of the project.

Add the `VITE_API_URL` variable to define the backend endpoint.

Default development configuration:
```env
VITE_API_URL=http://localhost:8000/api
```

Run the development server:
```sh
npm run dev
```