# SportsRk - Main

<br/>
<div align="center">
  <img align="center" width="280" src="https://i.imgur.com/DGs32ad.png"/>
  <img align="center" width="280" src="https://i.imgur.com/gS1l9rw.png"/>
</div>
<br/>

An irl football matchmaking system where games are arranged based on players' MMR once a week. This is the main app of the project, which glues everything together. Other projects:

- [MatchMaker](https://github.com/amthreis/sportsrk-matchmaker "Match Maker") arranges games with all the players that joined next weekend's queue, based on their MMR (Godot, ASP.NET, C#).
- [MatchSim](https://github.com/amthreis/sportsrk-matchsim "Match Simulator") simulates games (Godot, ASP.NET, C#).
- [Webpage](https://github.com/amthreis/sportsrk-webpage "Webpage") webpage (Next/shadcnUI).
- [App](https://github.com/amthreis/sportsrk-app "Mobile App") mobile app (React Native).

## Installation

Clone it and do an `npm install`. You're gonna need a .env file (root folder) containing the following:

```
PORT= #listen on this port

#matchsim service host and port
MATCH_SIM_HOST= 
MATCH_SIM_PORT=

#db host, port is 5432
POSTGRES_HOST=

#matchmaker service host and port
MATCH_MAKER_HOST=
MATCH_MAKER_PORT=

#redis db host and port
REDIS_HOST=
REDIS_PORT=

DATABASE_URL= #db url, includes ${POSTGRES_HOST}
JWT_SECRET= 

MATCHMAKE_CRON = #cron job, for making matches, example: "15 * * * * *"
MATCHSIM_CRON  = #cron job, for simulating matches, example: "45 * * * * *"

CORS_ORIGIN = #array with cors origins
```

Run `npm run dev` to start the server.