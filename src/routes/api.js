import fetch from "node-fetch";
import createPdf from "../templates/main_template.js";

const regexBodyFinder = /<body[^]*?>[^]+<\/body>/g
const regexTagFinder = /<\/?[^]+?>/g;
const regexScriptFinder = /<script[^]*?>[^]*?<\/script>/g
const regexStyleFinder = /<style[^]*?>[^]*?<\/style>/g
const regexIsWord = /[a-zа-я]+-?[a-zа-я]*/gi

function mostCommon(wordMap) {
    const wordCounter = [[0, ""], [0, ""], [0, ""]]

    wordMap.forEach((val, key) => {
        if(val > wordCounter[0][0]) {
            wordCounter[2] = wordCounter[1];
            wordCounter[1] = wordCounter[0];
            wordCounter[0] = [val, key];
        } else if(val > wordCounter[1][0]) {
            wordCounter[2] = wordCounter[1];
            wordCounter[1] = [val, key];
        } else if(val > wordCounter[2][0]) {
            wordCounter[2] = [val, key];
        }
    })

    return `${wordCounter[0][1]} | ${wordCounter[1][1]} | ${wordCounter[2][1]}`;
}

async function pageScraper(url) {
    let words = [];

    const response = await fetch(url);

    const html = await response.text();
    const body = html.match(regexBodyFinder)[0].replace(regexScriptFinder, "").replace(regexStyleFinder, "");

    words = words.concat(body.replace(regexTagFinder, " ").match(regexIsWord));

    const wordCounter = new Map();

    for (let word of words) {
        if(word.length > 4) {
            let tmpKey = word.toLocaleString();
            wordCounter.set(tmpKey, wordCounter.has(tmpKey) ? wordCounter.get(tmpKey) + 1 : 0);
        }
    }

    return wordCounter;
}

async function siteScraper(request, h) {
    const targets = typeof request.query.sites === "string" ? [request.query.sites] : request.query.sites;
    if(targets === undefined) {
        return {
            status: 400,
            result: "Bad Request",
            message: "Arguments under key 'sites' are required"
        }
    }
    let result = [];

    try {
        for (let target of targets) {
            const mostWritten = await pageScraper(target);
            result.push({
                name: target,
                words: mostCommon(mostWritten)
            });
        }
    } catch (err) {
        if(err.code === "ERR_INVALID_URL") {
            return {
                status: 400,
                result: "Bad Request",
                message: "Incorrect URL in arguments"
            }
        }
    }

    const options = { format: "A4" };
    const document = {
        data: {
            parsed: result
        },
        type: "buffer"
    }

    let pdfRes;
    try {
        pdfRes = await createPdf(document, options);
    } catch (err) {
        console.error(err);
        return {
            status: 500,
            result: "Internal server error"
        }
    }

    return h.pdf(pdfRes);
}

export const execHand = {
    method: "GET",
    path: "/api",
    options: {
        handler: siteScraper
    }
}