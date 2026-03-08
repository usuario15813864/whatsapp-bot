const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
printQRInTerminal: false
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => {

const { connection, qr } = update

if (qr) {
console.log("Escanea este QR con WhatsApp")
qrcode.generate(qr, { small: true })
}

if (connection === "open") {
console.log("✅ Bot conectado a WhatsApp")
}

})

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]

if (!msg.message) return

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text

const from = msg.key.remoteJid

if (!text) return

if (text.toLowerCase() === "hola") {

await sock.sendMessage(from, {
text: "👋 Hola, soy tu bot de WhatsApp"
})

}

if (text.toLowerCase() === "menu") {

await sock.sendMessage(from, {
text: "📋 Menú:\n1️⃣ Información\n2️⃣ Soporte\n3️⃣ Contacto"
})

}

})

}

startBot()
