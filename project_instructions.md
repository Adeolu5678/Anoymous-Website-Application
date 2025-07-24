# Anonymous Messaging App for Classmates - Project Instructions

## Project Overview
**Title:** Anonymous Messaging App for Classmates
**Objective:** To build a web application allowing registered users to receive anonymous text and image messages via a unique, shareable link. The application will feature a modern UI, secure authentication, and a special cascading stack inbox for viewing messages.
**Constraints & Best Practices:**
*   **Frontend:** React
*   **Backend:** Node.js with Express.js
*   **Database:** PostgreSQL
*   **Image Storage:** AWS S3 (Note: Currently using local storage for development as per our recent work)
*   **Security:** Hash passwords with bcrypt. Use JWT for session management. All user input must be validated and sanitized. Enforce HTTPS.
*   **Architecture:** Maintain a strict separation of concerns. Create small, single-responsibility files for all components, services, utilities, routes, controllers, and models.

## Project Phases

### Phase 0: Project Setup & Initial Configuration
**Goal:** Establish the complete project structure, initialize package managers, and set up environment variables.
1.  Create the root project directory named `anonymous-messaging-app`.
2.  Inside the root, create two subdirectories: `backend` and `frontend`.
3.  **Backend Setup:**
    *   Navigate into the `backend` directory.
    *   Initialize a Node.js project: `npm init -y`.
    *   Install necessary production dependencies: `npm install express pg bcrypt jsonwebtoken cors dotenv uuid aws-sdk multer multer-s3`.
    *   Install necessary development dependencies: `npm install -D nodemon`.
    *   In `backend/package.json`, add a dev script: `"dev": "nodemon server.js"`.
    *   Create a file named `.env` for environment variables. Populate it with the following keys (values will be filled as needed):
        *   `PORT=5000`
        *   `DATABASE_URL=`
        *   `JWT_SECRET=`
        *   `AWS_BUCKET_NAME=`
        *   `AWS_BUCKET_REGION=`
        *   `AWS_ACCESS_KEY_ID=`
        *   `AWS_SECRET_ACCESS_KEY=`
    *   Create a file named `.gitignore` and add `node_modules` and `.env`.
4.  **Frontend Setup:**
    *   Navigate into the `frontend` directory.
    *   Initialize a new React project using Vite: `npm create vite@latest . -- --template react`.
    *   Install necessary dependencies: `npm install axios react-router-dom framer-motion`.
    *   Create the following directory structure inside `frontend/src`:
        *   `/src`
        *   ├── `/api`
        *   ├── `/components`
        *   │   └── `/common`
        *   ├── `/contexts`
        *   ├── `/hooks`
        *   ├── `/pages`
        *   ├── `/styles`
        *   └── `/utils`
5.  Confirm that the entire directory structure and all initial files have been created successfully.

### Phase 1: Backend Core Setup & Database
**Goal:** Set up the Express server, establish a database connection, and define the initial API routes and database schema.
1.  **Database Script:**
    *   Create `backend/db_init.sql`.
    *   Add the SQL statements to create the `users` and `messages` tables as per the specification. Use UUID for primary keys and ensure username is unique.
        *   `users` table: `user_id` (UUID, PK), `username` (VARCHAR, UNIQUE), `hashed_password` (VARCHAR), `share_link_id` (VARCHAR, UNIQUE), `profile_picture_url` (VARCHAR, NULL), `custom_name` (VARCHAR, NULL), `created_at` (TIMESTAMPTZ).
        *   `messages` table: `message_id` (UUID, PK), `recipient_user_id` (UUID, FK to users), `text_content` (TEXT, NULL), `image_url` (VARCHAR, NULL), `sender_device_model` (VARCHAR, NULL), `is_read` (BOOLEAN, DEFAULT false), `created_at` (TIMESTAMPTZ).
2.  **Database Connection:**
    *   Create `backend/config/db.js`.
    *   Implement a PostgreSQL connection pool using the `pg` library. The configuration should be read from the `.env` file (`DATABASE_URL`). Export the query function.
3.  **Server Entry Point:**
    *   Create `backend/server.js`.
    *   Set up a basic Express app. Import `cors` and `dotenv`.
    *   The server should listen on the `PORT` specified in your `.env` file.
    *   Add middleware for parsing JSON bodies: `express.json()`.
    *   Add middleware for CORS: `cors()`.
4.  **API Routes:**
    *   Create `backend/routes/authRoutes.js`. Define placeholder routes for `POST /register` and `POST /login`.
    *   Create `backend/routes/messageRoutes.js`. Define placeholder routes for `GET /`, `POST /:share_link_id`, and `PUT /:message_id/read`.
    *   Create `backend/routes/userRoutes.js`. Define a placeholder route for `GET /:share_link_id/profile`.
    *   In `backend/server.js`, import and mount these routers under the `/api/auth`, `/api/messages`, and `/api/users` paths respectively.
5.  Confirm completion of all steps in this phase.

### Phase 2: User Authentication & Database Models
**Goal:** Implement the full user registration and login logic, including password hashing, JWT generation, and database interaction.
1.  **User Model:**
    *   Create `backend/models/userModel.js`.
    *   Implement the following functions that interact with the database:
        *   `createUser(username, hashedPassword, shareLinkId)`: Inserts a new user.
        *   `findUserByUsername(username)`: Retrieves a user by their username.
        *   `findUserByShareLink(shareLinkId)`: Retrieves a user by their share link ID.
2.  **Utilities:**
    *   Create `backend/utils/authUtils.js`.
    *   Implement `hashPassword(password)` using `bcrypt.hash`.
    *   Implement `comparePassword(password, hash)` using `bcrypt.compare`.
    *   Implement `generateShareLinkId()` using the `uuid` library to create a unique, non-sequential ID.
3.  **Authentication Controller:**
    *   Create `backend/controllers/authController.js`.
    *   Implement `registerUser(req, res)`:
        *   Validate input (username, password).
        *   Check if the username already exists (implements FR-101).
        *   Hash the password using `hashPassword`.
        *   Generate a unique share link ID (`generateShareLinkId`) (FR-201).
        *   Call `createUser` to save the new user to the database.
        *   Respond with a success message.
    *   Implement `loginUser(req, res)`:
        *   Validate input (username, password).
        *   Find the user by username using `findUserByUsername`.
        *   If the user exists, compare the password using `comparePassword`.
        *   If the password is correct, generate a JWT containing the `user_id`. (implements FR-102, NFR-103).
        *   Respond with the JWT.
4.  **Update Routes:**
    *   In `backend/routes/authRoutes.js`, connect the `registerUser` and `loginUser` controller functions to the `POST /register` and `POST /login` routes.
5.  Confirm completion of all steps.

### Phase 3: Core Messaging Backend Logic
**Goal:** To build the endpoints for sending, retrieving, and viewing messages, including image upload handling.
1.  **S3 Configuration (Note: Currently using local storage for development):**
    *   Create `backend/config/s3.js`.
    *   Configure the AWS S3 client using credentials from the `.env` file.
2.  **Image Upload Middleware (Note: Currently using local storage for development):**
    *   Create `backend/middleware/uploadMiddleware.js`.
    *   Use `multer` and `multer-s3` to create middleware for handling single image file uploads (IS-101).
    *   Configure it to upload to the S3 bucket specified in `.env`.
    *   Enforce a file size limit of 5MB (IS-102).
    *   The key for the S3 object should be unique (e.g., using a timestamp and original filename).
3.  **Message Model:**
    *   Create `backend/models/messageModel.js`.
    *   Implement `createMessage(recipientUserId, textContent, imageUrl, senderDeviceModel)`: Inserts a new message.
    *   Implement `getMessagesByUserId(userId)`: Retrieves all messages for a user, ordered by `created_at` descending (FR-402).
4.  **Message Controller:**
    *   Create `backend/controllers/messageController.js`.
    *   Implement `sendMessage(req, res)`:
        *   Find the recipient user via the `share_link_id` from the URL parameter.
        *   Extract `text_content` from `req.body`.
        *   If a file is uploaded, get the image URL from `req.file.location`.
        *   Extract sender's device model from the User-Agent request header (FR-304).
        *   Call `createMessage` to save the message to the database.
        *   Respond with a success message. Implements FR-301, FR-302, FR-303.
    *   Implement `getMessages(req, res)`:
        *   This route must be protected. Create `backend/middleware/authMiddleware.js` that verifies the JWT from the `Authorization` header and attaches the user's `user_id` to the request object.
        *   Use the `user_id` from the verified token to call `getMessagesByUserId`.
        *   Respond with the list of messages (NFR-101).
5.  **User Profile Controller:**
    *   Create `backend/controllers/userController.js`.
    *   Implement `getUserProfile(req, res)`:
        *   Use the `share_link_id` from the URL to find the user.
        *   Return only public-safe information: `custom_name` and `profile_picture_url` (FR-301).
6.  **Update Routes:**
    *   In `backend/routes/messageRoutes.js`, protect the `GET /` route with your new `authMiddleware`. Wire up the `getMessages` and `sendMessage` controllers. The `sendMessage` route should also use the `uploadMiddleware`.
    *   In `backend/routes/userRoutes.js`, wire up the `getUserProfile` controller.
7.  Confirm completion of all steps.

### Phase 4: Frontend Core Setup & Authentication UI
**Goal:** Build the basic React application shell, routing, and the UI for user registration and login.
1.  **API Service:**
    *   Create `frontend/src/api/authService.js`.
    *   Implement functions to make API calls to your backend:
        *   `register(username, password)`: Sends a `POST` request to `/api/auth/register`.
        *   `login(username, password)`: Sends a `POST` request to `/api/auth/login`.
2.  **Routing:**
    *   In `frontend/src/App.jsx`, set up `react-router-dom`.
    *   Define routes for `/`, `/login`, `/register`, and `/dashboard`. The `/dashboard` route should be a protected route that redirects to `/login` if no JWT is present.
3.  **Authentication Pages:**
    *   Create `frontend/src/pages/RegisterPage.jsx`. Build a form with username and password fields and a "Register" button. On submit, call the register service function. Handle success and error states. This implements the UI for FR-101.
    *   Create `frontend/src/pages/LoginPage.jsx`. Build a form with username and password fields and a "Login" button. On submit, call the login service function. On successful login, save the JWT to local storage and redirect to `/dashboard`. This implements the UI for FR-102.
4.  **Dashboard Page:**
    *   Create `frontend/src/pages/DashboardPage.jsx`.
    *   For now, this page should be a simple placeholder that says "Welcome to your Dashboard". This is the target for a successful login (FR-103).
5.  **User Menu & Link Display:**
    *   Create `frontend/src/components/UserMenu.jsx`.
    *   This component should be displayed on the dashboard. It needs to fetch the authenticated user's details (including the `share_link_id`).
    *   Display the user's `share_link_id` prominently.
    *   Add a "Copy Link" button that copies the share link to the user's clipboard (FR-202). Note: You'll need a new authenticated endpoint, e.g., `GET /api/auth/me`, to fetch this data. Please implement this new endpoint in the backend first.
6.  Confirm completion of all steps.

### Phase 5: Frontend Message Sending UI
**Goal:** Build the public-facing page where anyone can send a message to a user.
1.  **API Service:**
    *   Create `frontend/src/api/messageService.js`.
    *   Implement `getRecipientProfile(shareLinkId)` to call `GET /api/users/{shareLinkId}/profile`.
    *   Implement `sendMessage(shareLinkId, formData)` to call `POST /api/messages/{shareLinkId}`. This must be a `multipart/form-data` request to handle the image.
2.  **Message Sending Page:**
    *   Create `frontend/src/pages/SendMessagePage.jsx`.
    *   This page's route will be `/send/:shareLinkId`. Add this to your router in `App.jsx`.
    *   On page load, use the `shareLinkId` from the URL to call `getRecipientProfile` and display the recipient's `custom_name` and `profile_picture_url` (UI-102).
3.  **Expanding Textarea Component:**
    *   Create `frontend/src/components/ExpandingTextarea.jsx`.
    *   This component should be a `<textarea>` that automatically grows in height as the user types, without showing a scrollbar, to fulfill FR-302.
4.  **Image Uploader Component:**
    *   Create `frontend/src/components/ImageUploader.jsx`.
    *   This component should provide a file input button allowing the user to select a single image file, fulfilling FR-303.
5.  **Integrate Components:**
    *   In `SendMessagePage.jsx`, use your `ExpandingTextarea` and `ImageUploader` components.
    *   Add a "Send" button. When clicked, it should package the text content and the selected image file into a `FormData` object and send it using your `sendMessage` service function (FR-304).
6.  Confirm completion of all steps.

### Phase 6: Frontend Inbox UI & Interaction
**Goal:** Implement the visually complex and interactive message inbox for the logged-in user.
1.  **Time Utility:**
    *   Create `frontend/src/utils/dateUtils.js`.
    *   Implement a function `formatToWAT(utcTimestamp)` that takes a UTC date string and formats it for display in West Africa Time (WAT) as per FR-404.
2.  **API Service Update:**
    *   In `frontend/src/api/messageService.js`, implement `getMessages()` which sends an authorized `GET` request to `/api/messages`.
3.  **Inbox Page:**
    *   Create `frontend/src/pages/InboxPage.jsx`. Add a route for it at `/inbox` accessible from the dashboard (FR-401).
    *   On load, call `getMessages()` and store the array of messages in the component's state.
4.  **Message Card Component:**
    *   Create `frontend/src/components/MessageCard.jsx`.
    *   This component will display the content of a single message. It should show the text and/or the image. It must also display the formatted timestamp using your `formatToWAT` utility.
5.  **Cascading Stack Component:**
    *   Create `frontend/src/components/CascadingStack.jsx`. This is the most critical UI component.
    *   It will receive the array of messages as a prop.
    *   Implement the cascading stack UI (FR-402, UI-103):
        *   Use `framer-motion` for animations.
        *   Render the messages as a stack of `MessageCard` components. The current message is at the front (`z-index: 10`, `scale: 1`).
        *   Older messages are rendered behind it, slightly offset, scaled down, and with lower `z-index` values (e.g., message `i+1` is at `z-index: 9`, `scale: 0.9`, `translateY: -20px`; message `i+2` is at `z-index: 8`, `scale: 0.8`, `translateY: -40px`, etc.).
        *   Implement the scroll/swipe interaction (FR-403). A swipe up on the stack should smoothly animate the current card to the back of the stack and the next card to the front. Use `useDrag` hook from `framer-motion`.
    *   The background of the entire inbox view must have a blurred, translucent effect as specified in UI-103.
6.  **Mark as Read:**
    *   Implement the `PUT /api/messages/{message_id}/read` endpoint in the backend.
    *   In `frontend/src/api/messageService.js`, create a corresponding `markMessageAsRead(messageId)` function.
    *   In `CascadingStack.jsx`, when a message card is brought to the front, call `markMessageAsRead` for that message's ID (FR-405).
7.  Confirm completion of all steps.

### Phase 7: Admin Panel Development
**Goal:** To create a secure, separate interface for administrators to view users and their messages.
1.  **Backend Admin Endpoints:**
    *   Create `backend/middleware/adminAuthMiddleware.js`. This should be similar to `authMiddleware` but also check if the user has an `isAdmin` role (you'll need to add an `is_admin` boolean column to your `users` table).
    *   Create `backend/routes/adminRoutes.js`.
    *   Create `backend/controllers/adminController.js`.
    *   Implement `getAllUsers(req, res)` to list all users (FR-501).
    *   Implement `getMessagesForUser(req, res)` to get all messages for a specific `user_id`, including the `sender_device_model` field (FR-502, FR-503).
    *   Protect all admin routes with your `adminAuthMiddleware`. Mount the router at `/api/admin`.
2.  **Frontend Admin API Service:**
    *   Create `frontend/src/api/adminService.js`.
    *   Implement functions to call the new admin endpoints: `adminLogin`, `getAllUsers`, `getMessagesForUser`.
3.  **Admin UI:**
    *   Create a new set of pages and components for the admin panel, separate from the main user flow. e.g., `frontend/src/pages/admin/AdminLoginPage.jsx`.
    *   Build the admin login page.
    *   Create `frontend/src/pages/admin/AdminDashboardPage.jsx`.
    *   On this page, fetch and display a list of all users from the `getAllUsers` endpoint.
    *   When an admin clicks on a user, navigate to a new page, `AdminUserMessagesPage.jsx`, passing the `user_id`.
    *   On this page, fetch and display all messages for that user, ensuring the `sender_device_model` is visible next to each message.
4.  Confirm completion of all steps.

### Phase 8: Deployment & Configuration
**Goal:** To prepare the application for production deployment using Docker.
1.  **Backend Dockerfile:**
    *   In the `backend` directory, create a `Dockerfile`.
    *   Use a `node:18-alpine` base image.
    *   Copy `package.json` and `package-lock.json`, run `npm install --omit=dev`.
    *   Copy the rest of the backend source code.
    *   Expose the `PORT` and define the `CMD` to run the server.
2.  **Frontend Dockerfile:**
    *   In the `frontend` directory, create a `Dockerfile`.
    *   Use a multi-stage build.
    *   **Stage 1 (Build):** Use a `node:18-alpine` image, copy `package.json`, run `npm install`, copy source code, and run `npm run build`.
    *   **Stage 2 (Serve):** Use an `nginx:stable-alpine` image. Copy the build output from the build stage into the Nginx HTML directory. Create a custom `nginx.conf` to correctly serve the React single-page application (i.e., redirect all 404s to `index.html`).
3.  **Docker Compose:**
    *   In the root directory, create a `docker-compose.yml` file.
    *   Define services for `backend`, `frontend`, and `postgres`.
    *   Configure networking so the frontend can communicate with the backend.
    *   Use the `.env` file to pass environment variables to the backend and database services.
4.  Provide a final confirmation that all Docker files and the docker-compose file have been created as specified. The project is now complete. 