FROM node:24-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npm_ca \
    if [ -s /run/secrets/npm_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/npm_ca; fi \
    && npm ci --omit=dev \
    && mkdir /app/data \
    && chown node:node /app/data
COPY server.mjs catalog.mjs ./
COPY public ./public
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "server.mjs"]
