FROM node:lts-alpine as builder

WORKDIR /app
COPY . .

RUN ls -lah

RUN npm install
RUN npm run build


FROM nginx:stable
WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build .
