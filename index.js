const fs = require('node:fs');
const P = require('pino');
const QRCode = require('qrcode');
const { useMultiFileAuthState, makeCacheableSignalKeyStore, makeWASocket, DisconnectReason } = require('baileys');

const start = async() => {
  const level = P({ level: 'silent' }).child({ level: 'silent' });
  const { state, saveCreds } = await useMultiFileAuthState('session');

  const sock = makeWASocket({
    logger: level,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, level)
    }
  });

  sock.ev.on('connection.update', async ({connection, lastDisconnect, qr }) => {
    if (qr) console.log(await QRCode.toString(qr, {type:'terminal'}))
    if (connection == 'close') {
      if (lastDisconnect?.error?.output?.statusCode !== 401) {
        start()
      } else {
        console.log('⚠️ Sesión corrupta. Reiniciando...')
        fs.rmSync('session', { recursive: true, force: true })
        start()
      }
    } else if (connection == 'open') console.log('✅ Bot iniciado!')
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async(m) => {
    console.log(m)
  });
};

start();
