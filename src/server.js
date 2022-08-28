"use strict";

import Hapi from "@hapi/hapi";
import fs from "fs";
import {URL} from "url";
const __dirname = (new URL(".", import.meta.url).pathname).slice(1);

import {execHand} from "./routes/api.js";
import {homeHand} from "./routes/home.js";

export default async function createServer() {
    const server = Hapi.server({
        host: "localhost",
        port: "8000"
    })

    server.route([
        execHand,
        homeHand
    ])

    try {
        await server.start();
        console.log(`Server started at: ${server.info.uri}`);
    } catch (err) {
        console.log(JSON.stringify(err));
    }

    return server;
}
