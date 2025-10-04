const { proto, jidDecode, downloadContentFromMessage } = require('baileys')
const fs = require('fs')

const client = (sock) => {
  return sock
}

const sms = async(m) => {
  if (m.message) {
    m.type = Object.keys(m.message)[0]
  }
  
  return m
}

module.exports = { client, sms }
