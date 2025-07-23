function handler(req, res) {
  console.log('Request received:', req.method);
  
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const TEST_CHANNEL = 'C096BUUPWRJ';
  
  console.log('Bot token exists:', !!SLACK_BOT_TOKEN);
  console.log('Test channel:', TEST_CHANNEL);
  
  if (req.method === 'POST') {
    const { challenge, event } = req.body;
    
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Event received:', event ? event.type : 'no event');
    console.log('Channel:', event ? event.channel : 'no channel');
    
    // Handle URL verification
    if (challenge) {
      console.log('Challenge received:', challenge);
      return res.status(200).send(challenge);
    }
    
    // Handle message events
    if (event && event.type === 'message') {
      console.log('Message event details:');
      console.log('- Text:', event.text);
      console.log('- Channel:', event.channel);
      console.log('- Expected channel:', TEST_CHANNEL);
      console.log('- Bot ID:', event.bot_id);
      console.log('- Thread TS:', event.thread_ts);
      console.log('- User:', event.user);
      
      if (event.channel === TEST_CHANNEL && !event.bot_id && !event.thread_ts) {
        console.log('✅ Message matches criteria - would create ticket');
        // Just log for now, don't create ticket yet
      } else {
        console.log('❌ Message does not match criteria');
      }
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Bot is working!');
}

module.exports = handler;
