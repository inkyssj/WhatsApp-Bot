const { proto, jidDecode, downloadContentFromMessage } = require('baileys')
const fs = require('fs')

const client = (sock) => {
  sock.parseMention = (text = '') => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
  }

  sock.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {}
      return decode.user && decode.server && decide.user + '@' + decode.server || jid
    } else return jid
  }

  sock.getAdmins = async(jids) => {
    let jid;
    if (!jid || !jid.endsWith('@g.us')) return
    let group = await sock.groupMetadata(jid)
    let admins = new Array()

    for (let user of group.participants) {
      if (user.admin == 'admin' || user.admin == 'superadmin') admins.push(sock.decodeJid(user.id))
    }

    return admins
  }

  return sock
}

const sms = async(m) => {
  if (m.key) {
    m.id = m.key.id
    m.chat = m.key.remoteJid
    m.fromMe = m.key.fromMe
    m.isGroup = m.chat.endsWith('@g.us')
    m.sender = m.fromMe ? sock.decodeJid(sock.user.id) : m.isGroup ? m.key.participant : m.chat
    if (m.isGroup) {
      let admins = await sock.getAdmins(m.from)
      if (admins) {
        m.isAdmin = admins.include(m.sender)
        m.isBotAdmin = admins.includes(sock.decodeJid(sock.user.id))
      }
    }
  }
  if (m.message) {
    m.type = Object.keys(m.message)[0]
  }
}

module.exports = { client, sms }
