const fs = require("node:fs");

const root = "./src";

function walkDir(dirPath) {
    const dirContent = fs.readdirSync(dirPath);
    dirContent.forEach(entry => {
        if (entry.indexOf(".") > -1) {
            if (entry.endsWith(".js")) {
                fs.renameSync(dirPath + "/" + entry, dirPath + "/" + entry.replace(".js", ".ts"));
            } else if (entry.endsWith(".jsx")) {
                fs.renameSync(dirPath + "/" + entry, dirPath + "/" + entry.replace(".jsx", ".tsx"));
            }
        } else {
            walkDir(dirPath + "/" + entry);
        }
    });
}

walkDir(root);
