const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const fs = require("fs");
const uuid = require("uuid")
const proccesFile = require("./config/proccesFile");


const port = 5000;
const app = express();



app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// AUTH

app.use('/static/:name', (req, res) => {
    try {
        const name = req.params.name;
        const img = fs.readFileSync("./public/" + name);
        res.send(img).end()
    } catch (err) {
        console.log(err);
    }
});



app.get("/kosan", async (req, res) => {
    try {
        const data = [];
        const buffJson = fs.readFileSync("./data.json", "utf-8");
        const dats = JSON.parse(buffJson);
        const buff = fs.readFileSync("./dataFoto.json", "utf-8");
        const datasFoto = JSON.parse(buff);
        dats.map(item => {
            const foto = (datasFoto.filter(dafo => {
                if(dafo.idKosan === item.id) {
                    return dafo.link
                }
            })).map(it => { return it.link });
            data.push({ ...item, foto: foto });
        });
        res.status(200).send({ data: data }).end();
    } catch (err) {
        res.status(400).send({ error: err }).end();
    }
});


app.post("/kosan", async (req, res) => {
    try {
        const id = uuid.v4();
        const file = await proccesFile(req, res);
        const body = JSON.parse(JSON.parse(JSON.stringify(req.body)).body);
        const buff = fs.readFileSync("./dataFoto.json", "utf-8");
        const datas = JSON.parse(buff);
        const uriImg = Date.now() + "-" + file.originalname;
        fs.writeFileSync("./public/" + uriImg, file.buffer)
        datas.push({ idKosan: id, link: "http://localhost:5000/static/" + uriImg });
        fs.writeFileSync("./dataFoto.json", JSON.stringify(datas), "utf-8");
        const buffJson = fs.readFileSync("./data.json", "utf-8");
        const dats = JSON.parse(buffJson);
        const dataBaru = { ...body, id: id};
        dats.push(dataBaru);
        fs.writeFileSync("./data.json", JSON.stringify(dats), "utf-8")
        res.send({messege: "SUCCES CREATE FILE", data: dataBaru }).end();
    } catch (err) {
        res.status(400).send({messege: err }).end();
    }
});





app.delete("/kosan/:id", (req, res) => {
    try {
        const id = req.params["id"];
        const buffJson = fs.readFileSync("./data.json", "utf-8");
        const dats = JSON.parse(buffJson);
        const daada = dats.filter(item => { return item.id != id });
        fs.writeFileSync("./data.json", JSON.stringify(daada), "utf-8")
        res.status(200).send({ data: "Delete Kosan Succes" }).end();
    } catch (err) {
        res.status(400).send({ error: "Delete Kosan Gagal" }).end();
    }
});





app.delete('/fotoKos/:idKos', (req, res) => {
    try {
        const id = req.params.idKos;
        const link = req.query.foto;
        const buff = fs.readFileSync("./dataFoto.json", "utf-8");
        const datas = JSON.parse(buff);
        const data = datas.filter(item => { 
            if(item.link !== link) {
                return item;
            }
        });
        fs.writeFileSync("./dataFoto.json", JSON.stringify(data), "utf-8");
        res.status(200).send({ data: "Delete Foto Kosan Succes" }).end();
    } catch (err) {
        res.status(400).send({ data: "Delete Foto Kosan Succes" }).end();
    }
})



app.post('/kosan/addfoto/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const file = await proccesFile(req, res);
        const buff = fs.readFileSync("./dataFoto.json", "utf-8");
        const datas = JSON.parse(buff);
        const uriImg = Date.now() + "-" + file.originalname;
        fs.writeFileSync("./public/" + uriImg, file.buffer)
        datas.push({ idKosan: id, link: "http://localhost:5000/static/" + uriImg });
        fs.writeFileSync("./dataFoto.json", JSON.stringify(datas), "utf-8");
        res.status(200).send({data: "Berhasil Menambahkan Foto"}).end();
    } catch (err) {
        res.status(400).send({error: err}).end();
    }
})





app.patch("/kosan/:id", (req, res) => {
    try {
        const body = req.body;
        const newData = {};
        if(body.nama) {
            Object.assign(newData, { nama: body.nama });
        };
        if(body.deskripsi) {
            Object.assign(newData, { deskripsi: body.deskripsi });
        };
        if(body.harga) {
            Object.assign(newData, { harga: body.harga });
        };
        if(body.nomor) {
            Object.assign(newData, { nomor: body.nomor })
        };
        if(body.lat) {
            Object.assign(newData, { lat: body.lat })
        };

        const id = req.params["id"];
        const buffJson = fs.readFileSync("./data.json", "utf-8");
        const dats = JSON.parse(buffJson);
        const daada = dats.filter(item => {
            if(item.id == id) {
                const a = item;
                a.nama = newData.nama;
                a.deskripsi = newData.deskripsi;
                a.harga = newData.harga;
                return a
            } else {
                return item
            }
        });
        fs.writeFileSync("./data.json", JSON.stringify(daada), "utf-8")
        res.status(200).send({ data: [] }).end();
    } catch (err) {
        res.status(400).send({ error: err }).end();
    }
});





app.listen(port, (e) => {
    if(e) { throw e }
    console.log("Server Running on port " + port)
});
