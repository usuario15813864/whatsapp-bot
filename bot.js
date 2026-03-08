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
console.log("BOT CONECTADO A WHATSAPP")
}

})

// generar código después de iniciar

setTimeout(async () => {

try{

const code = await sock.requestPairingCode("593995647783")

console.log("================================")
console.log("CODIGO PARA VINCULAR WHATSAPP:")
console.log(code)
console.log("================================")

}catch(e){

console.log("No se pudo generar el código todavía...")

}

},20000)

}

startBot()
