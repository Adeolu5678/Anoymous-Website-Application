# Use the official Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install build dependencies for native Node.js modules like bcrypt
RUN apk add --no-cache build-base python3

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the backend server runs on
EXPOSE 5000

# Define the command to run the application
CMD ["node", "server.js"] 