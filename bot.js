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

if(connection === "connecting"){
console.log("Conectando a WhatsApp...")
}

if(connection === "open"){
console.log("BOT CONECTADO A WHATSAPP")
}

if(connection === "close"){

const shouldReconnect =
lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

console.log("Conexión cerrada, reconectando...")

if(shouldReconnect){
startBot()
}

}

})

// GENERAR CODIGO

setTimeout(async () => {

try{

if(!sock.authState.creds.registered){

const code = await sock.requestPairingCode("593995647783")

console.log("================================")
console.log("CODIGO PARA VINCULAR WHATSAPP")
console.log(code)
console.log("================================")

}

}catch(err){

console.log("Esperando conexión para generar código...")

}

},20000)

}

startBot()
