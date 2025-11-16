import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI-Client – API-Key kommt aus Render-Env: OPENAI_API_KEY
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// einfache Test-Route
app.get("/", (req, res) => {
  res.send("Dienstplan-KI-Backend läuft.");
});

app.post("/chat", async (req, res) => {
  try {
    const userQuestion = req.body.question || "";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",   // passt gut für solche Zwecke
      messages: [
        {
          role: "system",
          content:
            "Du bist eine deutschsprachige KI-Hilfe für Dienstplan-Analysen. " +
            "Antworte kurz, klar und verständlich."
        },
        {
          role: "user",
          content: userQuestion
        }
      ]
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "Keine Antwort vom KI-Modell erhalten.";
    res.json({ answer });
  } catch (err) {
    console.error("Fehler im /chat-Endpunkt:", err);
    res.status(500).json({ answer: "Interner Fehler im KI-Backend." });
  }
});

// Render stellt PORT als Env-Variable bereit
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("KI-Backend läuft auf Port " + PORT);
});
