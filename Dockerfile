# Use the official Node.js image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY codigo/package.json codigo/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY codigo/ .

# Expose the port the server runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]