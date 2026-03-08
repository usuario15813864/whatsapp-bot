const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot(){

const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
browser: ["Minegoc8Bot","Chrome","1.0"]
})

sock.ev.on("creds.update", saveCreds)

// ESTADO DE CONEXIÓN

sock.ev.on("connection.update", async (update) => {

const { connection } = update

if(connection === "connecting"){
console.log("Conectando a WhatsApp...")
}

if(connection === "open"){
console.log("BOT CONECTADO A WHATSAPP")
}

})

// GENERAR CODIGO PARA VINCULAR

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

console.log("Error generando el código")

}

},15000)

// RESPUESTAS AUTOMÁTICAS

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]

if(!msg.message) return

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text

if(!text) return

const from = msg.key.remoteJid
const message = text.toLowerCase()

// MENÚ

if(message === "hola" || message === "menu"){

await sock.sendMessage(from,{
text:
"👋 Hola, bienvenido a *Minegoc8*\n\n"+
"🛍️ Tu tienda online\n\n"+
"Selecciona una opción:\n\n"+
"1️⃣ Ver productos\n"+
"2️⃣ Ver precios\n"+
"3️⃣ Comprar\n"+
"4️⃣ Hablar con asesor"
})

}

// PRODUCTOS

if(message === "1"){

await sock.sendMessage(from,{
text:
"🛍️ *Productos disponibles*\n\n"+
"🔹 Masajeador tipo pistola\n"+
"🔹 Audífonos Bluetooth\n"+
"🔹 Smartwatch\n\n"+
"Escribe *comprar* para hacer tu pedido."
})

}

// PRECIOS

if(message === "2"){

await sock.sendMessage(from,{
text:
"💰 *Lista de precios*\n\n"+
"Masajeador: $25\n"+
"Audífonos Bluetooth: $15\n"+
"Smartwatch: $30\n\n"+
"🚚 Envíos a todo Ecuador\n"+
"💵 Pago contra entrega"
})

}

// COMPRAR

if(message === "3" || message === "comprar"){

await sock.sendMessage(from,{
text:
"🛒 *Pedido Minegoc8*\n\n"+
"Envíanos estos datos:\n\n"+
"📦 Producto:\n"+
"👤 Nombre:\n"+
"📍 Ciudad:\n"+
"🏠 Dirección:\n"+
"📞 Teléfono:\n\n"+
"🚚 Pago contra entrega disponible."
})

}

// ASESOR

if(message === "4"){

await sock.sendMessage(from,{
text:
"👨‍💼 Un asesor de *Minegoc8* te responderá pronto.\n\n"+
"📞 También puedes llamar o escribir a:\n"+
"+593995647783"
})

}

})

}

startBot()
