const { removeAccents } = require('../lib/functions')
const { sms } = require('../lib/simple')

module.exports = async(sock, m, plugins) => {
  try {
    m = await sms(m)
    
    console.log(String(m))
  } catch(e) {
    console.log('Error en messages.upsert: ', e)
  }
}
