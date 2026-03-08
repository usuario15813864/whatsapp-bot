const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot(){

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update) => {

const { connection } = update

if(connection === "connecting"){
console.log("Conectando a WhatsApp...")
}

if(connection === "open"){
console.log("BOT CONECTADO")
}

})

// GENERAR CODIGO

setTimeout(async () => {

try {

if(!sock.authState.creds.registered){

const code = await sock.requestPairingCode("593995647783")

console.log("================================")
console.log("CODIGO PARA VINCULAR WHATSAPP")
console.log(code)
console.log("================================")

}

} catch(err){

console.log("Error generando código")

}

},10000)

}

startBot()
