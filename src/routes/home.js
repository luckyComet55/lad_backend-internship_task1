async function response() {
    return {
        status: 200,
        result: "ok",
        message: "Successfully connected to API"
    }
}

export const homeHand = {
    method: "GET",
    path: "/",
    options: {
        handler: response
    }
}