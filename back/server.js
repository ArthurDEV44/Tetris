import Koa from "koa";
import http from "http";
import bodyParser from "koa-bodyparser";
import koaJwt from "koa-jwt";
import fs from "fs";
import { koaCors, socketIoCors } from "./middleware.js";
import authRoutes from "./auth.js";
import generalRoutes from "./routes.js";
import WebSocketManager from "./websocket/WebSocketManager.js"; // Assurez-vous que le chemin est correct

// Chargement de la configuration à partir de config.json
const rawConfig = fs.readFileSync(new URL("./config.json", import.meta.url));
const config = JSON.parse(rawConfig);
const app = new Koa();
const server = http.createServer(app.callback());

app.use(bodyParser());

// Middleware pour gérer les erreurs de manière globale
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message };
    console.error("Erreur capturée: ", err.message);
  }
});

app.use(koaCors);
app.use(
  koaJwt({ secret: config.jwt_secret }).unless({
    path: [/^\/public/, /^\/login/, /^\/signup/],
  }),
);

app.use(authRoutes.routes());
app.use(generalRoutes.routes());

// Export l'instance de l'application Koa
export default app;

// Importation dynamique de socket.io et initialisation de WebSocketManager
socketIoCors(server).then((socketIoInstance) => {
  WebSocketManager.initialize(socketIoInstance);

  const PORT = 8180;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
