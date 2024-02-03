const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Function to handle sending a message to OpenAI's GPT model
const sendMessageHandler = async (req, res) => {
  let data = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [{
      "role": "user",
      "content": req.body.message
    }]
  });

  let config = {
    method: 'post',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer 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'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    // Assuming the structure of response from OpenAI API is correct and consistent
    // Adjust the following line if the structure is different
    const botMessage = response.data.choices[0].message.content;
    res.json({ botMessage: botMessage });
  } catch (error) {
    console.error('Error sending message to GPT:', error.response.data);
    res.status(500).send('Error sending message to GPT');
  }
};

// Endpoint to handle sending a message to OpenAI's GPT model
app.post('/sendMessage', sendMessageHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
