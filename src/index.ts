import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3010);

createApp().listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
