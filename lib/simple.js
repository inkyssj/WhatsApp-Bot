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
  if (m.message) {
    m.type = Object.keys(m.message)[0]
  }
  
  return m
}

module.exports = { client, sms }
