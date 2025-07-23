function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body || {};
    
    if (body.challenge) {
      return res.status(200).send(body.challenge);
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Bot is working!');
}

module.exports = handler;
