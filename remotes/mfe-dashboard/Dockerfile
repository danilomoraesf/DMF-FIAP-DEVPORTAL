# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# npm bundled with Node has a known arborist bug resolving this project's
# peer dependencies (see project memory) — pin a newer npm before installing.
RUN npm install -g npm@11.21.0

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build

# ---- Runtime stage ----
FROM nginx:alpine
COPY --from=build /app/dist/mfe-dashboard/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
