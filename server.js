import "dotenv/config";
import dbConfig from "./config.js";
import expressApp from "./app.js";
const app = expressApp;

const port = process.env.SERVERPORT || 8000;

try {
  await dbConfig.Sequelize.authenticate();
  dbConfig.Sequelize.sync();
  console.log("Connection has been established successfully.");
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
