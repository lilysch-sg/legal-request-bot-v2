function handler(req, res) {
  console.log('Request received:', req.method);
  
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const TEST_CHANNEL = 'C096BUUPWRJ';
  
  if (req.method === 'POST') {
    const { challenge, event } = req.body;
    
    // Handle URL verification
    if (challenge) {
      return res.status(200).send(challenge);
    }
    
    // Handle message events
    if (event && event.type === 'message' && event.channel === TEST_CHANNEL && !event.bot_id && !event.thread_ts) {
      console.log('Creating ticket for message:', event.text);
      
      // Simple classification
      const messageText = event.text.toLowerCase();
      let type = 'General Legal';
      let assignee = '<@U0473NNB3GA>'; // Sam Mandell
      
      if (messageText.includes('msa') || messageText.includes('master agreement')) {
        type = 'Commercial Contracts';
        assignee = '<@U06K65CQ31A>'; // Lily Schurra
      } else if (messageText.includes('nda')) {
        type = 'NDAs';
        assignee = '<@U06PS7F4V8B>'; // Melanie Cameron
      } else if (messageText.includes('privacy') || messageText.includes('gdpr')) {
        type = 'Privacy';
        assignee = '<@U06K65CQ31A>'; // Lily Schurra
      }
      
      // Generate ticket number
      const ticketNumber = `LGL-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
      
      // Post reply in thread
      const threadMessage = `🎫 Ticket ${ticketNumber} created\nType: ${type}\nAssigned to: ${assignee}\nStatus: Open`;
      
      // Use global fetch (available in Node.js 18+)
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
      .then(response => response.json())
      .then(data => {
        console.log('Slack API response:', data);
      })
      .catch(err => {
        console.error('Slack API error:', err);
      });
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(200).send('Bot is working!');
}

module.exports = handler;
