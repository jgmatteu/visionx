const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/getLikes", async (req, res) => {
    const postUrl = req.query.url;
    if (!postUrl) return res.status(400).json({ error: "URL obrigatória" });

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.goto(postUrl, { waitUntil: "networkidle2" });

        const likes = await page.evaluate(() => {
            let likeElement = document.querySelector("span[class*='fr66n']");
            return likeElement ? likeElement.innerText : "Curtidas não encontradas";
        });

        await browser.close();
        res.json({ likes });

    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar curtidas" });
    }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));