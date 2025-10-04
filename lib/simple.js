const sms = async(m) => {
  if (m.key) {
    m.id = m.key.id
    m.chat = m.key.remoteJid
    m.fromMe = m.key.fromMe
    m.isGroup = m.chat.endsWith('@g.us')
  }
  if (m.message) {
    m.type = Object.keys(m.message)[0]
    m.msg = m.message[m.type]
    if (m.msg) {
      let quotedMention = m.msg.contextInfo != null ? m.msg.contextInfo.participant : ''
      let tagMention = m.msg.contextInfo != null ? m.msg.contextInfo.mentionedJid : []
      let mention != undefined ? mention.push(quotedMention) : []
      m.mentionUser = mention != undefined ? mention.filter(x => x) : []
      m.quoted = m.msg.contextInfo != undefined ? m.msg.contextInfo.quotedMessage : null
    }
  }
  
  return m
}

module.exports = { sms }
