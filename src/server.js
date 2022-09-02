"use strict";

import Hapi from "@hapi/hapi";
import fs from "fs";
import hapi_response_utilities from "hapi-response-utilities"

import {execHand} from "./routes/api.js";
import {homeHand} from "./routes/home.js";

export default async function createServer() {
    const server = Hapi.server({
        host: "localhost",
        port: "8000"
    })

    await server.register({
        plugin: hapi_response_utilities
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
