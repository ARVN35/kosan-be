// const uuid = require("uuid");
// const bucket = require("./bucket");

// module.exports = {
//     uploadFile: async (file, path) => {
//         // Fungsi ini Belum Menyimpan data Ke database
//         if (typeof file !== "object") {
//             console.error(
//                 cliYellow("[!] ") +
//                     cliRed("file not difine, file require object file parsing with proccesFile"),
//             );
//             return { error: "file not difine", data: null };
//         };

      
//         const name = (path ? path + "/": "") + uuid.v4() + "-" + file.originalname;

//         const blob = bucket.file(name);
//         const blobStream = blob.createWriteStream({
//             resumable: false,
//         });
//         blobStream.on("error", (err) => {
//             return { error: err.message, data: null };
//         });
//         blobStream.on("finish", async (data) => {
//             try {
//                 await bucket.file(name).makePublic();
//             } catch {
//                 return {
//                     error: `Uploaded the file successfully: ${name}, but public access is denied!`,
//                     data: null,
//                 };
//             }
//         });
//         blobStream.end(file.buffer);
//         return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//     },
// }