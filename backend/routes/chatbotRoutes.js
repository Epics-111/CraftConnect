// backend/routes/chatbotRoutes.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Define contextual instructions for the AI
    const systemPrompt = `
      You are a virtual assistant for a smart community service access platform. Your purpose is to help users with questions related to community services such as local events, public transportation, utility services, and community resources. If a question is unrelated to these topics, politely inform the user that you can only assist with community service-related inquiries.
    `;

    const response = await model.generateContent([systemPrompt, message]); // Ensure context

    // Extract response text
    const reply = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text 
      || "I'm here to assist with community service inquiries. How can I help you today?";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Chatbot API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
