#-------------- -------------- -------------- -------------- stage 1
FROM node:20-alpine AS pre

WORKDIR /app
RUN npm install -g ts-node-dev
RUN npm install @rollup/rollup-linux-x64-musl --save-optional
RUN npm install -g vitest

COPY package*.json .
RUN npm install 
COPY . .


#-------------- stage 1 branch: dev
FROM pre AS dev

ENV NODE_ENV=development

CMD npm run dev

#-------------- stage 1 branch: dev
FROM pre AS seed-dev

ENV NODE_ENV=development

CMD npm run dev:migrate-n-seed && npm run dev
#CMD /bin/bash


#-------------- stage 1 branch: test
FROM seed-dev AS test

ENV NODE_ENV=test
RUN npm install @rollup/rollup-linux-x64-musl --save-optional

CMD npm run dev:migrate-n-seed && sleep 30 && npx vitest run

#-------------- stage 1 branch: test
FROM pre AS build

RUN npx prisma generate && npx prisma db push --force-reset && node ./dist/seeders/seeder-dev.js
RUN npx vitest run

RUN npm run build

#-------------- stage 1 branch: test
FROM node:20-alpine AS prod

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/.env ./.env

CMD npm run migrate-start


FROM prod as test-prod

CMD npx vitest run