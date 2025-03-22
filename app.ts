import server from "./src/server";
import connectDB from "./src/config/db";
import { config } from "./src/config/config";
import { Platform } from "./src/dashboard/games/gameModel";


const startServer = async () => {

  await connectDB();

  server.listen(config.port, () => {
    console.log("Listening on port : ", config.port);
  });
};

startServer();
