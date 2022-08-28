import fetch from "node-fetch";

const regexBodyFinder = /<body>[^]+<\/body>/g
const regexTagFinder = /<\/?[^]+?>/g;
const regexContentFinder = /title="(?<named>[^]+?)"/g
const regexScriptFinder = /<script[^]*?>[^]*?<\/script>/g
const regexIsWord = /[a-zа-я]+/gi

async function siteScrabbler(request, reply) {
    const targets = request.query.sites;
    console.log(targets);

    let words = [];

    const response = await fetch("https://" + targets[1]);
    const html = await response.text();
    const body = html.match(regexBodyFinder)[0].replace(regexScriptFinder, "");

    for (let match of body.matchAll(regexContentFinder)) {
        words = words.concat(match.groups.named.match(regexIsWord));
        words = words.filter(n => n !== null);
    }

    words = words.concat(body.replace(regexTagFinder, " ").match(regexIsWord));
    console.log(words);

    return {
        status: 200,
        result: "ok",
        message: {
            wordsCounted: words
        }
    }
}

export const execHand = {
    method: "GET",
    path: "/api",
    options: {
        handler: siteScrabbler
    }
}