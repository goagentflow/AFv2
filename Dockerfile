# Serves the assembled goagentflow.com site (static + React apps)
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy site content (assembled by Cloud Build into deploy/)
COPY deploy/ /usr/share/nginx/html/

# Copy nginx config separately — NOT from deploy/ (would be publicly accessible)
COPY nginx.conf /etc/nginx/nginx.conf

# Cloud Run requirement
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
