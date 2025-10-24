# Step 1: Base image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Step 4: Copy all files
COPY . .

# Step 5: Expose backend port
EXPOSE 5000

# Step 6: Default command
CMD ["npm", "run", "start:dev"]
