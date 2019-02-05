const { createServer } = require('http');
const { createReadStream, statSync } = require('fs');
const { resolve } = require('path');

function filePath(paths) {
    if (paths.length === 1) {
        return resolve("test", "browser", paths[0]);
    }
    if (paths.length === 2 && paths[0] === "build") {
        return resolve("build", paths[1]);
    }
    const e = new Error("File not allowed");
    e.code = "ENOENT";
    throw e;
}

createServer((req, res) => {
    const method = (req.method || "").toUpperCase();
    const path = ((req.url || "").replace(/^https?:\/\/[^\/]+/, "").replace(/^\//, "").replace(/\?.*$/, "") || "es5.html").split("/");
    console.log("Answering to request: %s", path.join("/"));
    if (method !== "HEAD" && method !== "GET") { 
        res.statusCode = 405;
        res.setHeader("Allow", "GET, HEAD");
        res.end();
    }
    if (path.indexOf("/") !== -1) {
        res.statusCode = 404;
        res.end();
        return;
    }
    let sync;
    let fullpath;
    try {
        fullpath = filePath(path);
        sync = statSync(fullpath);
    } catch (e) {
        console.error(e);
        if (e.code === "ENOENT") {
            res.statusCode = 404;
            res.end();
            return;
        }
        res.statusCode = 500;
        res.write(e.message);
        res.end();
        return;
    }
    if (!sync.isFile()) {
        res.statusCode = 404;
        res.end();
        return;
    }
    const mime =
        fullpath.endsWith(".js") ? "text/javascript" :
        fullpath.endsWith(".html") ? "text/html" :
        fullpath.endsWith(".css") ? "text/css" :
        "application/octet-stream";
    res.setHeader("Content-Type", mime)
    res.setHeader("Content-Length", sync.size);

    if (method === "HEAD") {
        res.end();
    }

    const r = createReadStream(fullpath);
    r.pipe(res, { end: true });
}).listen(8080, (e) => {
    if (!e) {
        console.log("Started web server: http://127.0.0.1:8080/");
    } else {
        console.error(e);
    }
});

