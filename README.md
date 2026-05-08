# LocalMart - Hyperlocal E-commerce Platform

LocalMart is a multi-vendor e-commerce platform that connects local shop owners with customers in their vicinity. It features Swiggy-style nearby shop discovery sorted by distance using geolocation.

## Features

- **Nearby Discovery**: Find shops and products sorted by distance from your current location.
- **Multi-vendor Support**: Separate dashboards for shop owners to manage products and orders.
- **Admin Approval**: Platform admins can approve or reject new shop owner applications.
- **Cart & Orders**: Persistent cart and full order tracking flow.
- **Premium UI**: Modern, responsive design built with React, Tailwind CSS, and Lucide icons.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios, Context API, React Router v6.
- **Backend**: Node.js, Express, MongoDB, JWT, Multer, Cloudinary.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB account (local or Atlas)
- Cloudinary account for image hosting

### Setup

1. **Backend**:
   - Navigate to `backend` directory.
   - Create a `.env` file based on the template provided.
   - Run `npm install`.
   - Run `npm start` or `npm run dev`.

2. **Frontend**:
   - Navigate to `frontend` directory.
   - Run `npm install`.
   - Run `npm run dev`.

### Geolocation

The app uses the browser's Geolocation API. Make sure to allow location permissions when prompted to see nearby shops sorted by distance.

## Folder Structure

- `backend/`: Express server, models, controllers, and routes.
- `frontend/`: React application, components, contexts, and hooks.
# local-mart
