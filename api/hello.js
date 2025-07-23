function handler(req, res) {
  console.log('Request received:', req.method);
  
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const TEST_CHANNEL = 'C096BUUPWRJ';
  
  if (req.method === 'POST') {
    const { challenge, event } = req.body;
    
    console.log('Event received:', event ? event.type : 'no event');
    console.log('Channel:', event ? event.channel : 'no channel');
    
    // Handle URL verification
    if (challenge) {
      return res.status(200).send(challenge);
    }
    
    // Handle message events
    if (event && event.type === 'message' && event.channel === TEST_CHANNEL && !event.bot_id && !event.thread_ts) {
      console.log('Processing message:', event.text);
      
      // Just return OK for now - no Slack API calls yet
      return res.status(200).send('OK');
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Bot is working!');
}

module.exports = handler;
