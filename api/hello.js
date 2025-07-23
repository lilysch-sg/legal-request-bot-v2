function handler(req, res) {
  console.log('Request received:', req.method);
  
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const TEST_CHANNEL = 'C096BUUPWRJ';
  
  console.log('Bot token exists:', !!SLACK_BOT_TOKEN);
  console.log('Bot token first 10 chars:', SLACK_BOT_TOKEN ? SLACK_BOT_TOKEN.substring(0, 10) : 'none');
  
  if (req.method === 'POST') {
    const { challenge, event } = req.body;
    
    // Handle URL verification
    if (challenge) {
      return res.status(200).send(challenge);
    }
    
    // Handle message events
    if (event && event.type === 'message') {
      console.log('Event details:');
      console.log('- Channel:', event.channel, 'vs expected:', TEST_CHANNEL);
      console.log('- Bot ID:', event.bot_id);
      console.log('- Thread TS:', event.thread_ts);
      console.log('- Text:', event.text);
      
      if (event.channel === TEST_CHANNEL && !event.bot_id && !event.thread_ts) {
        console.log('✅ Creating ticket for message:', event.text);
        
        // Simple classification
        const messageText = event.text.toLowerCase();
        let type = 'General Legal';
        let assignee = '<@U0473NNB3GA>'; // Sam Mandell
        
        if (messageText.includes('msa')) {
          type = 'Commercial Contracts';
          assignee = '<@U06K65CQ31A>';
          console.log('Classified as MSA/Commercial');
        }
        
        const ticketNumber = `LGL-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
        const threadMessage = `🎫 Ticket ${ticketNumber} created\nType: ${type}\nAssigned to: ${assignee}\nStatus: Open`;
        
        console.log('About to call Slack API with:', {
          channel: event.channel,
          thread_ts: event.ts,
          message: threadMessage
        });
        
        // Call Slack API
        fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            channel: event.channel,
            text: threadMessage,
            thread_ts: event.ts
          })
        })
        .then(response => {
          console.log('Slack API status:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('Slack API response:', JSON.stringify(data, null, 2));
          if (!data.ok) {
            console.error('Slack API error:', data.error);
          }
        })
        .catch(err => {
          console.error('Fetch error:', err);
        });
      } else {
        console.log('❌ Message does not match criteria');
      }
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Bot is working!');
}

module.exports = handler;
