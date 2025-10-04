const sms = async(m) => {
  if (m.key) {
    m.id = m.key.id
    m.chat = m.key.remoteJid
    m.fromMe = m.key.fromMe
    m.isGroup = m.chat.endsWith('@g.us')
  }
  if (m.message) {
    m.type = Object.keys(m.message)[0]
  }
  
  return m
}

module.exports = { sms }
