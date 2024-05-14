import { config } from "dotenv";
config();

// import repo from "./repo";
import app from "./app";
import { scheduleJobs } from "./utils/sch-job";
import { getInfo } from "./services/svc-football";

scheduleJobs();

app.listen(process.env.PORT, async () => {
    console.log(`Listening on port ${process.env.PORT}.`);
    console.log(await getInfo());
});