require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {

    const { message } = req.body;

    try {

        const response = await client.chat.completions.create({

            model: "gpt-3.5-turbo",

            messages: [

                {
                    role: "system",
                    content: `
                    You are Gauransh AI.
                    You speak Hindi and English.
                    Help customers politely.
                    If customer speaks Hindi, reply in Hindi.
                    If customer speaks English, reply in English.
                    `
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
            reply: "Something went wrong"
        });

    }

});

app.get("/", (req, res) => {
  res.send("AI Server Running Successfully 🚀");
});

app.listen(3000, () => {
    console.log("AI Server Running on port 3000");
});