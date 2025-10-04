const { removeAccents } = require('../lib/functions')
const { client, sms } = require('../lib/simple')

module.exports = async(sock, m, plugins) => {
  try {
    sock = await client(sock)
    m = await sms(sock, m)
    
    console.log(m)
  } catch(e) {
    console.log('Error en messages.upsert: ', e)
  }
}
