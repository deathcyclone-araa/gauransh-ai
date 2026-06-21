
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CUSTOMER_API =
  "https://script.google.com/macros/s/AKfycbz6Mpfz63ndK4OLwKtqIIS4jMvhHNAVebfqnDQf3HGaETrJiEMK7c59PeNU61ViZ8QDOw/exec";

const WORK_API =
  "https://script.google.com/macros/s/AKfycbwRxJ6cxs4lXY4Wnd542wowG3tcFvNjgIBz7rkw5rJbPZvj7DR69eC4RDoN3Jv5_kG1pQ/exec";

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const lowerMessage = message.toLowerCase();

    // CUSTOMER SEARCH
    if (lowerMessage.includes("customer")) {

      const customerId = message.split(" ").pop();

const response = await axios.get(
  CUSTOMER_API + "?customerid=" + customerId
);
      const data = response.data;

      if (!data || data.length === 0) {
        return res.json({
          reply: "Customer not found"
        });
      }

      let reply = "Customer Details:\n\n";

data.forEach((row) => {

  reply +=
    "Customer ID: " + row.customerid + "\n" +
    "Name: " + row.customername + "\n" +
    "Phone: " + row.phone + "\n" +
    "Work ID: " + row.workid + "\n" +
    "Material: " + row.material + "\n" +
    "Items: " + row.items + "\n\n";

});

      return res.json({ reply });
    }

    // WORK SEARCH
    if (lowerMessage.includes("work")) {

      const workId = message.split(" ").pop();

    const response = await axios.get(
  WORK_API + "?workid=" + workId
);
      const data = response.data;

      if (!data || data.length === 0) {
        return res.json({
          reply: "Work ID not found"
        });
      }

     let reply = "Work Entry Details:\n\n";

data.forEach((row, index) => {

  reply +=
    "Entry " + (index + 1) + "\n\n" +
    "Work ID: " + row.workid + "\n" +
    "Employee: " + row.employee + "\n" +
    "Narration: " + row.narration + "\n" +
    "Start Date: " + row.startdate + "\n" +
    "End Date: " + row.enddate + "\n" +
    "Amount: " + row.amount + "\n\n";

});

      return res.json({ reply });

    }

    // NORMAL AI CHAT
    const response = await client.chat.completions.create({

      model: "gpt-3.5-turbo",

      messages: [

        {
         role: "system",
content:
"You are Gauransh AI. " +
"You speak Hindi and English. " +
"Help customers politely."
        },

        {
          role: "user",
          content: message
        }

      ]

    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {

    console.log(error);

    res.json({
      reply: "Server error"
    });

  }

});

app.get("/", (req, res) => {
  res.send("AI ERP Server Running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
