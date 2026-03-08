const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
browser: ["Minegoc8Bot","Chrome","1.0"]
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update) => {

const { connection, lastDisconnect } = update

if (connection === "connecting") {
console.log("Conectando a WhatsApp...")
}

if (connection === "open") {
console.log("BOT CONECTADO A WHATSAPP")
}

// generar código solo cuando está listo
if (connection === "connecting" && !sock.authState.creds.registered) {

try {

const code = await sock.requestPairingCode("593995647783")

console.log("================================")
console.log("CODIGO PARA VINCULAR WHATSAPP")
console.log(code)
console.log("================================")

} catch (e) {
console.log("Esperando que WhatsApp permita generar el código...")
}

}

if (connection === "close") {

const shouldReconnect =
lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

console.log("Conexión cerrada, reconectando...")

if (shouldReconnect) {
startBot()
}

}

})

}

startBot()
