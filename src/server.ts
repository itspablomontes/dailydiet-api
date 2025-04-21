import { app } from "./app";
import { setupRoutes } from "./routes/routes";

setupRoutes(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
