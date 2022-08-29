import fetch from "node-fetch";

const regexBodyFinder = /<body[^]*?>[^]+<\/body>/g
const regexTagFinder = /<\/?[^]+?>/g;
const regexContentFinder = /(title|aria-label)="(?<named>[^]+?)"/g
const regexScriptFinder = /<script[^]*?>[^]*?<\/script>/g
const regexStyleFinder = /<style[^]*?>[^]*?<\/style>/g
const regexIsWord = /[a-zа-я]+-?[a-zа-я]*/gi

function createPDF(...[counts, word]) {

}

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

    return wordCounter;
}

async function pageScraper(url) {
    let words = [];

    const response = await fetch(url);

    const html = await response.text();
    const body = html.match(regexBodyFinder)[0].replace(regexScriptFinder, "").replace(regexStyleFinder, "");

    for (let match of body.matchAll(regexContentFinder)) {
        words = words.concat(match.groups.named.match(regexIsWord));
        words = words.filter(n => n !== null);
    }

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

async function siteScraper(request, reply) {
    const targets = typeof request.query.sites === "string" ? [request.query.sites] : request.query.sites;
    if(targets === undefined) {
        return {
            status: 400,
            result: "Bad Request",
            message: "Arguments under key 'sites' are required"
        }
    }
    console.log(targets)
    let result = [];

    try {
        for (let target of targets) {
            console.log(target)
            const mostWritten = await pageScraper(target);
            result = result.concat(mostCommon(mostWritten));
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

    return {
        status: 200,
        result: "OK",
        message: result
    }
}

export const execHand = {
    method: "GET",
    path: "/api",
    options: {
        handler: siteScraper
    }
}