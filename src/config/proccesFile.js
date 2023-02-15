const Multer = require("multer");
const util = require("util");
const maxSize = 2 * 1024 * 1024 * 1024; // 2 Gb
let processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize },
}).single("file");
let processFileMiddleware = util.promisify(processFile);
module.exports = async (req, res) => {
    await processFileMiddleware(req, res);
    return req.file;
};