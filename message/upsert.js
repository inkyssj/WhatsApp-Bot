const { removeAccents } = require('../lib/functions')
const { sms } = require('../lib/simple')

module.exports = async(sock, m, plugins) => {
  try {
    m = await sms(m)

    const base64 = Buffer.from(m.message.messageContextInfo.messageSecret).toString('base64');
    console.log('Base64:', base64)
  } catch(e) {
    console.log('Error en messages.upsert: ', e)
  }
}
