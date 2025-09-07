E-Commerce Inventory System - Setup Guide
This document provides a comprehensive, step-by-step guide to setting up and running the MERN stack E-Commerce Inventory System application locally.

1. Technology Stack
MongoDB: NoSQL database for storing application data.

Express.js: Backend framework for building the RESTful API.

React: Frontend library for building the user interface.

Node.js: JavaScript runtime for the backend server.

2. Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js: Version 22.19.0 or higher is recommended. You can download it from the official Node.js website. This will also install npm.

npm: Version 10.9.0 or higher.

Git: To clone the repository.

3. Setup Instructions
Step 1: Clone the Repository
First, download or clone the project repository to your local machine.

git clone <your-repository-url>
cd <your-repository-folder>

Step 2: Backend Configuration
Navigate to the Backend Directory:

cd ecom-backend

Install Dependencies:
The package.json file already contains all the necessary dependencies. Run the following single command to install them.

npm install

This will create a node_modules folder inside ecom-backend and install express, mongoose, cors, dotenv, bcryptjs, and nodemon.

Create the Environment File:
Create a new file named .env in the ecom-backend directory and add the following content. This file stores your secret credentials and should not be committed to Git.



Step 3: Frontend Configuration
The frontend uses serve, a simple package for serving static files.

Install serve Globally:
Open a new terminal and run this command. You only need to do this once on your machine.

npm install -g serve

Navigate to the Frontend Directory:
From the project's root folder, navigate into the frontend directory.

cd ecom-frontend

(Note: Based on your notes, your HTML files might be in a public subfolder. If so, you will run the start command from the ecom-frontend directory, as shown in the next section.)

4. Running the Application
To run the full application, you will need two separate terminals open at the same time.

Terminal 1: Start the Backend Server

# Make sure you are in the ecom-backend directory
cd ecom-backend
npm run dev

You should see a message confirming Server running on http://localhost:5000 and MongoDB connected successfully.

Terminal 2: Start the Frontend Server

# Make sure you are in the ecom-frontend directory
cd ecom-frontend
serve -s public

You should see a message confirming the server is running, typically at http://localhost:3000.

You can now open http://localhost:3000 in your web browser to use the application.

5. Troubleshooting
PowerShell Execution Policy (Windows): If you are unable to run npm scripts in the VS Code terminal, open PowerShell as an administrator and run the following command:

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

