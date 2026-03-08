const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state
})

sock.ev.on("connection.update", (update) => {

const { connection, qr } = update

if (qr) {
console.log("Escanea este QR con WhatsApp")
qrcode.generate(qr, { small: true })
}

if (connection === "open") {
console.log("Bot conectado correctamente")
}

})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]

if (!msg.message) return

const text = msg.message.conversation || msg.message.extendedTextMessage?.text

if (!text) return

const from = msg.key.remoteJid

// MENSAJE DE BIENVENIDA
if (text.toLowerCase() === "hola") {

await sock.sendMessage(from, {
text:
"👋 Hola, bienvenido a nuestra tienda\n\n"+
"Escribe el número de la opción:\n\n"+
"1️⃣ Ver productos\n"+
"2️⃣ Precios\n"+
"3️⃣ Comprar\n"+
"4️⃣ Hablar con asesor"
})

}

// VER PRODUCTOS
if (text === "1") {

await sock.sendMessage(from, {
text:
"🛍️ Nuestros productos disponibles:\n\n"+
"• Masajeador tipo pistola\n"+
"• Audífonos bluetooth\n"+
"• Smartwatch\n\n"+
"Escribe *comprar* si te interesa uno."
})

}

// PRECIOS
if (text === "2") {

await sock.sendMessage(from, {
text:
"💲 Lista de precios:\n\n"+
"Masajeador: $25\n"+
"Audífonos: $15\n"+
"Smartwatch: $30\n\n"+
"🚚 Pago contra entrega disponible."
})

}

// COMPRAR
if (text.toLowerCase() === "comprar" || text === "3") {

await sock.sendMessage(from, {
text:
"🛒 Perfecto\n\n"+
"Envíanos:\n"+
"• Producto\n"+
"• Ciudad\n"+
"• Nombre\n\n"+
"📦 Pago contra entrega."
})

}

// ASESOR
if (text === "4") {

await sock.sendMessage(from, {
text:
"👨‍💼 Un asesor te responderá pronto.\n\n"+
"Gracias por contactarnos."
})

}

})

}

startBot()
