const fs = require('node:fs');
const P = require('pino');
const QRCode = require('qrcode');
const path = require('path');
const { fileURLToPath } = require('url');
const { exec } = require('child_process');

let plugins;

const start = async() => {
  const level = P({ level: 'silent' }).child( level: 'silent' );
  const { state, saveCreds } = await useMultiFileAuthState('session');

  const sock = makeWASocket({
    logger: level,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSingnalKeyStore(state.key, level);
    };
  });

  sock.ev.on('connection.update', async(update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log(await QRCode.toString(qr, {type: 'terminal'}));
    };
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('message.upsert', async({ type, messages }) => {
    m = messages[0];
  });
  
};

start();
