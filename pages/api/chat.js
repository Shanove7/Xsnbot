export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CEREBRAS_API_KEY}`
      },
      body: JSON.stringify({
        model: "zai-glm-4.7",
        stream: false,
        messages: [
          { role: "user", content: message }
        ],
        temperature: 0.7,
        top_p: 1
      })
    });

    const data = await response.json();

    return res.status(200).json({
      status: true,
      reply: data?.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
