FROM node:18-alpine AS build

WORKDIR /app

# Install deps (use package-lock if present)
COPY package.json package-lock.json ./
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production image: serve static build with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]