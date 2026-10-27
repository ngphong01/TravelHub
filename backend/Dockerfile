FROM node:20-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl

# Copy package files and prisma directory
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (runs postinstall prisma generate successfully)
RUN npm install

# Copy source code
COPY . .

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]

