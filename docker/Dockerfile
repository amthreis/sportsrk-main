#-------------- -------------- -------------- -------------- stage 1
FROM node:20-alpine AS pre

WORKDIR /app
COPY package*.json .
RUN npm install 
RUN npm install -g ts-node-dev
RUN npm install -g vitest
RUN npm install @rollup/rollup-linux-x64-musl --save-optional
COPY . .


#-------------- stage 1 branch: dev
FROM pre AS dev

ENV NODE_ENV=development

CMD npm run dev

#-------------- stage 1 branch: dev
FROM pre AS seed-dev

ENV NODE_ENV=development

CMD npm run pre-build-seed && npm run dev
#CMD /bin/bash


#-------------- stage 1 branch: test
FROM seed-dev AS test

ENV NODE_ENV=test

CMD npm run pre-build-seed && npx vitest run