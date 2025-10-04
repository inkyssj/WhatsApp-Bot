const fs = require('node:fs');
const P = require('pino');
const QRCode = require('qrcode');
const path = require('path');
const { fileURLToPath } = require('url');
const { exec } = require('child_process');
const { useMultiFileAuthState, makeCacheableSignalKeyStore, makeWASocket, DisconnectReason } = require('baileys');

let plugins;

const start = async() => {
  const level = P({ level: 'silent' }).child({ level: 'silent' });
  const { state, saveCreds } = await useMultiFileAuthState('session');

  const sock = makeWASocket({
    logger: level,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.key, level)
    }
  });

  sock.ev.on('connection.update', async ({connection, lastDisconnect, qr }) => {
    if (qr) console.log(await QRCode.toString(qr, {type:'terminal'}))
    if (connection == 'close') {
      if (lastDisconnect?.error?.output?.statusCode !== 401) {
        start()
      } else {
        console.log('La session esta corrupta!')
        fs.rmSync('session', { recursive: true })
        start()
      }
    } else if (connection == 'open') console.log('Bot iniciado!')
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('message.upsert', async({ type, messages }) => {
  });
  
};

start();
