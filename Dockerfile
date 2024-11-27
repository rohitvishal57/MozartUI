# Use Node.js to build the app
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app's source code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Use Nginx to serve the built app
FROM nginx:alpine

# Copy the built app to Nginx's web directory
COPY --from=build /app/dist/angular-dev /usr/share/nginx/html

# Expose port 80 for the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
