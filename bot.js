const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBN9HbGRgVl0NEVX0zjxMz9qrssmDAWKco",
    authDomain: "banca-hp.firebaseapp.com",
    projectId: "banca-hp",
    storageBucket: "banca-hp.firebasestorage.app",
    messagingSenderId: "78718057679",
    appId: "1:78718057679:web:002f4ac81022a5602acbba",
    measurementId: "G-YZ7EX6YFQE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para raspar los números reales de la web
async function obtenerResultadosWeb() {
    try {
        console.log("Extrayendo resultados desde la web...");
        const response = await axios.get("https://www.conectate.com.do/loterias/", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(response.data);
        const resultados = {};

        // Recorrer los bloques de juegos
        $(".game-block").each((_, element) => {
            const titulo = $(element).find(".game-title").text().trim();
            const numeros = [];

            $(element).find(".score-number").each((_, num) => {
                const valor = $(num).text().trim();
                if (valor) numeros.push(valor);
            });

            if (titulo && numeros.length >= 3) {
                resultados[titulo] = {
                    p1: numeros[0] || "00",
                    p2: numeros[1] || "00",
                    p3: numeros[2] || "00"
                };
            }
        });

        return resultados;
    } catch (error) {
        console.error("Error al extraer los datos de la web:", error.message);
        return {};
    }
}

// Mapeo y actualización en Firebase
async function actualizarResultadosEnVivo() {
    try {
        console.log("Iniciando actualización...");
        const datosWeb = await obtenerResultadosWeb();

        // Mapeo entre cómo se llama en la web y el ID de tu Firebase
        const loterias = [
            { id: "Nacional", nombre: "Lotería Nacional", busca: "Gana Más / Lotería Nacional" },
            { id: "GanaMas", nombre: "Gana Más", busca: "Gana Más" },
            { id: "Leidsa", nombre: "Leidsa", busca: "Quiniela Leidsa" },
            { id: "Real", nombre: "Lotería Real", busca: "Lotería Real" },
            { id: "Loteka", nombre: "Loteka", busca: "Quiniela Loteka" },
            { id: "PrimeraDia", nombre: "La Primera Día", busca: "La Primera 12:00 PM" },
            { id: "PrimeraNoche", nombre: "La Primera Noche", busca: "La Primera 8:00 PM" },
            { id: "LaSuerte", nombre: "La Suerte Dominicana", busca: "La Suerte 12:30 PM" },
            { id: "LoteDom", nombre: "LoteDom", busca: "LoteDom" },
            { id: "NewYorkTarde", nombre: "New York Tarde", busca: "New York 2:30 PM" },
            { id: "NewYorkNoche", nombre: "New York Noche", busca: "New York 10:30 PM" },
            { id: "FloridaTarde", nombre: "Florida Tarde", busca: "Florida 1:30 PM" },
            { id: "FloridaNoche", nombre: "Florida Noche", busca: "Florida 9:45 PM" }
        ];

        for (const loteria of loterias) {
            // Si la web aún no tiene los números de hoy o falla, deja los valores encontrados o "00"
            const extraido = datosWeb[loteria.busca] || { p1: "00", p2: "00", p3: "00" };

            await setDoc(doc(db, "resultados", loteria.id), {
                loteria: loteria.nombre,
                p1: extraido.p1,
                p2: extraido.p2,
                p3: extraido.p3,
                timestamp: Date.now()
            });

            console.log(`[Firebase] ${loteria.nombre} -> ${extraido.p1} - ${extraido.p2} - ${extraido.p3}`);
        }

        console.log("¡Todas las loterías actualizadas en Firebase con éxito!");
    } catch (error) {
        console.error("Error al actualizar Firebase:", error);
    }
}

// Ejecución inmediata al encender
actualizarResultadosEnVivo();

// Tarea automática cada 15 minutos en Render
cron.schedule("*/15 * * * *", () => {
    console.log("Ejecutando actualización programada...");
    actualizarResultadosEnVivo();
});