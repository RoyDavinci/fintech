import express from "express";
import { logger } from "./utils/logger";
import http from "http";
import debug from "debug";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { limiter } from "./utils/rateLimit";
import apiV1Router from "./routes/routes";
import "./prototype";
import passport from "passport";
import passportService from "./helpers/passport";

const app = express();

const port = process.env.PORT || 3100;

dotenv.config();
const serverDebugger = debug("ringo:server");
// app.set("trust", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(limiter);
app.use(cors());
app.use(helmet());
passportService(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1", apiV1Router);
const server: http.Server = http.createServer(app);

process.on("unhandledRejection", (reason, p) => logger.error("Unhandled Rejection at: Promise ", p, reason));

server.listen(port, () => {
    if (process.env.NODE_ENVIRONMENT === "development") logger.info(`server port: http://localhost:${port}`);
});

server.on("error", onError);
server.on("listening", onListening);

// function normalizePort(val: string) {
//     const port = parseInt(val, 10);
//     if (Number.isNaN(port)) {
//         return val;
//     }
//     if (port >= 0) {
//         // port number
//         return port;
//     }
//     return false;
// }

function onError(error: { syscall: string; code: string }) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.error(`${bind} is already in use`);
            process.exit(1);
            break;
        case "ELIFECYCLE":
            logger.error(`${bind}this happened instaed`);
            process.exit(1);
            break;
        default:
            logger.info("this happened instead");
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
    serverDebugger(`Listening on ${bind}`);
}
