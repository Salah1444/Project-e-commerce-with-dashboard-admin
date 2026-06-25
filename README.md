# Ecommerce React + Express

This repository contains a full-stack e-commerce application built with React, Vite, and Express.

## Repository structure

- `BACK_END/` - Express server, API routes, controllers, models, middleware, and upload handling.
- `FRONT_END/` - React application using Vite, app components, pages, store slices, and services.

## Setup

### Backend
1. Open a terminal in `BACK_END/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run serve
   ```

### Frontend
1. Open a terminal in `FRONT_END/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run dev
   ```

## Notes

- Static uploads are stored under `BACK_END/uploads/`.
- API routes and controllers are organized by feature in the backend.
- The frontend uses Redux Toolkit slices for state management.

## Recommended workflow

- Run the backend server and frontend app concurrently in separate terminals.
- Use the React application to interact with the API and verify orders, cart, favorites, notifications, and user authentication.
