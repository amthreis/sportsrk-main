# SportsRk - Main

This is the main service of the SportsRk, which glues everything together, made with Node/TS.

## Installation

Clone it and do an `npm install`. You're gonna need a .env file (root folder) containing the following:

```
PORT=... #port this service will be listening on

#matchsim service host/port
MATCH_SIM_HOST="localhost"
MATCH_SIM_PORT=...

#db host:5432
POSTGRES_HOST="db-postgres"

#matchmaker service host/port
MATCH_MAKER_HOST="localhost"
MATCH_MAKER_PORT=...

#redis host/port
REDIS_HOST=...
REDIS_PORT=...

#database url, used by prisma
DATABASE_URL="..."

JWT_SECRET="..."

#matchmaker will be notified by arrange games based on this cron job
MATCHMAKE_CRON = "15 * * * * *"
MATCHSIM_CRON  = "45 * * * * *"

CORS_ORIGIN = [...]
```

Run `npm run dev` to start the server.