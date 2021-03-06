import express from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import app from "./api/api";
import { responseMessage } from "./controller/DefaultResponseMessage";
import { mongoConnect } from "./database/mongo";
import logger from "./utils/Logger";

const PORT = process.env.SERVER_PORT || 3500;
export const imagesPath = __dirname + "/../images/";

const start = async () => {
    await mongoConnect();

    // setup client path
    app.use("/", express.static(path.join(__dirname, "..")));
    app.use(express.static(__dirname + "/public/"));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    app.all("*", (req, res) => {
        return res.status(StatusCodes.NOT_FOUND)
            .send(responseMessage("The url you're looking for doesn't exist",
                StatusCodes.NOT_FOUND));
    });

    app.use((err, req, res, next) => {
        logger.error("Error", err.stack);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(responseMessage("Something went terribly wrong here",
                StatusCodes.INTERNAL_SERVER_ERROR,
                { error: err, details: err.stack }));
    })

    app.listen(PORT, () => {
        return logger.info(`Express is listening at http://localhost:${PORT}`);
    });
}

start().then(undefined);