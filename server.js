import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI-Client, API-Key kommt aus Umgebungsvariable
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const userQuestion = req.body.question || "";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",   // oder ein anderes aktuelles Modell
      messages: [
        {
          role: "system",
          content:
            "Du bist eine deutschsprachige KI-Hilfe für die Dienstplan-Analyse. " +
            "Erkläre Dinge knapp, klar und freundlich."
        },
        {
          role: "user",
          content: userQuestion
        }
      ]
    });

    const answer = completion.choices?.[0]?.message?.content || "Keine Antwort erhalten.";
    res.json({ answer });
  } catch (err) {
    console.error("Fehler im /chat-Endpunkt:", err);
    res.status(500).json({ answer: "Interner Fehler im KI-Backend." });
  }
});

// Render stellt PORT als Umgebungsvariable bereit
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("KI-Backend läuft auf Port " + PORT);
});
