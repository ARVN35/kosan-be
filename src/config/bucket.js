const { Storage } = require("@google-cloud/storage");
const path = require("path")
const storage = new Storage({
  keyFilename: path.join(__dirname, './gcpKeys.json'),
});
const bucket = storage.bucket("arofin");
module.exports = bucket;