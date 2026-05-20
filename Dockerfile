FROM node:20-alpine
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application files
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY libs ./libs
COPY apps ./apps

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

CMD npm run start:dev -- --project $SERVICE_NAME