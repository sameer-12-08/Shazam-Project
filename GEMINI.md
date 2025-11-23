# Project Overview

This project, "Shazam," is a full-stack file sharing application. It consists of a Spring Boot backend and a React frontend. The application allows users to upload one or more files, which are then made available for download via a unique, time-sensitive link.

## Architecture

The project is divided into two main components:

*   **`Shazam-backend`**: A Java-based Spring Boot application that handles file uploads, storage, and retrieval.
    *   **`FileTransferController`**: Exposes REST endpoints for uploading and downloading files.
    *   **`FileStorageService`**: Manages the storage of uploaded files. It saves files to a local `uploads` directory, organizes them by a unique transfer ID, and cleans up expired files. For transfers with multiple files, it dynamically creates a zip archive.
*   **`shazam-frontend`**: A React-based single-page application that provides the user interface for uploading files.
    *   **`App.js`**: The main component that handles the entire user interface, including file selection (drag-and-drop or browsing), upload progress, and displaying the generated download link and a corresponding QR code.

## Building and Running

### Backend (Spring Boot)

To run the backend, navigate to the `Shazam-backend` directory and use the Maven wrapper:

```bash
cd Shazam-backend
./mvnw spring-boot:run
```

The backend server will start on port `8080` by default.

### Frontend (React)

To run the frontend, navigate to the `shazam-frontend` directory, install the dependencies, and start the development server:

```bash
cd shazam-frontend
npm install
npm start
```

The frontend development server will start on port `3000` by default and will proxy API requests to the backend.

## Development Conventions

*   **Backend**: The backend follows standard Spring Boot conventions. It uses Maven for dependency management and includes `spring-boot-devtools` for automatic restarting during development.
*   **Frontend**: The frontend is a standard Create React App project. It uses `npm` for package management and includes scripts for starting the development server, building for production, and running tests.
*   **API**: The API is defined in the `FileTransferController`. The base path is `/api`, and it includes endpoints for `/upload` (POST) and `/d/{transferId}` (GET). The frontend communicates with the backend via these endpoints.
