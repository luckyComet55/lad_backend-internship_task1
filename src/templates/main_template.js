import pdf from "html-pdf";
import Handlebars from "handlebars";
import fs from "fs";
import {URL} from "url";
const __dirname = (new URL(".", import.meta.url).pathname).slice(1);

export default function createPdfSync(document, options) {
    const html = fs.readFileSync(__dirname + "template.html", "utf8");
    return new Promise((resolve, reject) => {
        console.log(document.data);
        const htmlCompiled = Handlebars.compile(html)(document.data);
        const pdfRes = pdf.create(htmlCompiled, options);

        switch (document.type) {
            case "buffer":
                pdfRes.toBuffer((err, res) => {
                    if(err) {
                        reject(err);
                    }
                    resolve(res);
                })
                break;
            case "file":
                pdfRes.toFile(document.filename, (err, res) => {
                    if(err) {
                        reject(err);
                    }
                    resolve(res);
                })
                break;
            case "stream":
                pdfRes.toStream((err, res) => {
                    if(err) {
                        reject(err);
                    }
                    resolve(res);
                })
                break;
            default:
                reject("Incorrect parameters");
                break;
        }
    })
}
