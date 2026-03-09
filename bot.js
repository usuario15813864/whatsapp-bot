const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
printQRInTerminal: false,
browser: ["Minegoc8Bot","Chrome","1.0"]
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => {

const { connection, lastDisconnect, qr } = update

// MOSTRAR QR
if (qr) {
console.log("ESCANEA ESTE QR CON WHATSAPP")
qrcode.generate(qr, { small: true })
}

// CONECTADO
if (connection === "open") {
console.log("BOT CONECTADO A WHATSAPP")
}

// RECONEXION
if (connection === "close") {

const shouldReconnect =
lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

console.log("Conexion cerrada, reconectando...")

if (shouldReconnect) {
startBot()
}

}

})

// RESPUESTAS AUTOMATICAS

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]

if (!msg.message) return

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text

if (!text) return

const from = msg.key.remoteJid
const message = text.toLowerCase()

// MENU

if (message === "hola" || message === "menu") {

await sock.sendMessage(from, {
text:
"👋 Hola, bienvenido a *Minegoc8*\n\n"+
"Selecciona una opción:\n\n"+
"1️⃣ Ver productos\n"+
"2️⃣ Ver precios\n"+
"3️⃣ Comprar\n"+
"4️⃣ Asesor"
})

}

// PRODUCTOS

if (message === "1") {

await sock.sendMessage(from, {
text:
"🛍️ Productos disponibles\n\n"+
"• Masajeador tipo pistola\n"+
"• Audífonos Bluetooth\n"+
"• Smartwatch\n\n"+
"Escribe *comprar* para hacer pedido."
})

}

// PRECIOS

if (message === "2") {

await sock.sendMessage(from, {
text:
"💰 Lista de precios\n\n"+
"Masajeador: $25\n"+
"Audífonos: $15\n"+
"Smartwatch: $30\n\n"+
"🚚 Pago contra entrega"
})

}

// COMPRAR

if (message === "3" || message === "comprar") {

await sock.sendMessage(from, {
text:
"🛒 Para hacer tu pedido envíanos:\n\n"+
"Producto:\n"+
"Nombre:\n"+
"Ciudad:\n"+
"Dirección:\n"+
"Teléfono:\n\n"+
"📦 Pago contra entrega."
})

}

})

}

startBot()
