#!/bin/bash

# Apply migrations
RUN npm run pre-build-seed
RUN npx vitest run
RUN npm run build

exec "$@"