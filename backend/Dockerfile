FROM node:20-alpine

WORKDIR /app

# Install build dependencies if needed
RUN apk add --no-cache openssl

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy prisma and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY . .

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
