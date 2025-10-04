const sms = async(sock, m) => {
  if (m.message) {
    m.type = Object.keys(m.message)[0]
  }
  
  return m
}

module.exports = { sms }
