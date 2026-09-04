const express = require("express");

const app = express();

app.use(express.json());

async function traducirTexto(texto, idiomaDestino) {
    const { default: translate } = await import("translate");
    
    translate.engine = "google"; 

    try {
        const textoTraducido = await translate(texto, { from: "en", to: idiomaDestino });
        return textoTraducido;        
    } catch (error) {
        console.error("Error al traducir:", error);
    }
}

traducirTexto("Hello, how are you?", "es").then((traduccion) => {
    console.log("Traducción:", traduccion);
});

module.exports = { traducirTexto };
