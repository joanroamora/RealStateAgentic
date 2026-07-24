# Multi-stage Dockerfile for DevSecOps compliant Frontend Deployment
FROM nginx:1.25-alpine AS production

# Security: Remove default nginx configuration and create non-root user directory permissions
RUN rm -rf /usr/share/nginx/html/* && \
    mkdir -p /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /var/run/nginx.pid /usr/share/nginx/html

# Copy application assets
COPY src/ /usr/share/nginx/html/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set permissions for static assets
RUN chown -R nginx:nginx /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
