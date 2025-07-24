# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN rm -rf node_modules && npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
# Set REACT_APP_API_URL during build time for the production API endpoint
# Replace with your actual production backend URL if different
ARG REACT_APP_API_URL=http://localhost:5000/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built React app from the build stage to Nginx's public directory
COPY --from=build /app/build /usr/share/nginx/html

# Remove default Nginx configuration and copy custom one
# We will create this nginx.conf in the next step
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the frontend web server
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"] 