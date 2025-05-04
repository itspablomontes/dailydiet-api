import { app } from "./app";
import { setupRoutes } from "./routes/routes";
import dotenv from "dotenv";
dotenv.config();

setupRoutes(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
