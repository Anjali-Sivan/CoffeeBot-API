const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Function to fetch coffee data from the external API
const getCoffeeData = async () => {
  try {
    const response = await axios.get('https://api.sampleapis.com/coffee/hot');
    return response.data;
  } catch (error) {
    console.error('Error fetching coffee data:', error.message);
    throw new Error('Error fetching coffee data');
  }
};

// Function to handle sending a message to the custom GPT model
const sendMessageHandler = (req, res) => {
  const { message } = req.body;

  // Assuming you want to acknowledge the receipt of the message
  res.json({ acknowledgement: 'Message received successfully', userMessage: message });
};

// Endpoint to handle sending a message to the custom GPT model
app.post('/sendMessage', sendMessageHandler);

// Function to retrieve a response from the custom GPT model based on user message
const getResponseHandler = async (req, res) => {
  try {
    const coffeeData = await getCoffeeData();
    const userMessage = req.query.message.toLowerCase();

    // Find a response that matches the user's message
    const matchedCoffee = coffeeData.find((coffee) => coffee.title.toLowerCase().includes(userMessage));

    if (matchedCoffee) {
      res.json({ responseMessage: matchedCoffee });
    } else {
      // If no match found, send a default response
      const randomCoffee = coffeeData[Math.floor(Math.random() * coffeeData.length)];
      res.json({ responseMessage: randomCoffee });
    }
  } catch (error) {
    res.status(500).send('Error getting response');
  }
};

// Endpoint to retrieve a response from the custom GPT model
app.get('/getResponse', getResponseHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
