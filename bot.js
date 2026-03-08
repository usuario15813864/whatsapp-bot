const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
printQRInTerminal: false
})

sock.ev.on("connection.update", (update) => {

const { connection, lastDisconnect, qr } = update

if (qr) {
console.log("ESCANEA ESTE QR CON WHATSAPP")
qrcode.generate(qr, { small: true })
}

if (connection === "close") {
const shouldReconnect =
lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

if (shouldReconnect) {
startBot()
}
}

if (connection === "open") {
console.log("BOT CONECTADO A WHATSAPP")
}

})

sock.ev.on("creds.update", saveCreds)

}

startBot()
