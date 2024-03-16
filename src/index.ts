import { config } from "dotenv";
config();

// import repo from "./repo";
import app from "./app";

app.listen(process.env.PORT, () => console.log(`Listening on port ${ process.env.PORT }.`));