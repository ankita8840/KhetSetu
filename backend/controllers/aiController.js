/**
 * AI Assistant Controller - KhetSetu AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const smartAgricultureResponse = (message) => {
  const msg = message.toLowerCase().trim();

  // Tomato
  if (msg.includes("tomato") || msg.includes("टमाटर")) {
    if (
      msg.includes("demand") ||
      msg.includes("market") ||
      msg.includes("mandi")
    ) {
      return `
Tomato ki demand Bharat ke bade shahron aur processing industries mein sabse zyada rehti hai:

• Delhi NCR
• Mumbai
• Bengaluru
• Hyderabad
• Lucknow
• Kanpur

Tomato sauce, ketchup aur puree industries bhi bade buyers hote hain.
      `;
    }

    if (
      msg.includes("kab") ||
      msg.includes("season") ||
      msg.includes("lagaye")
    ) {
      return `
Tomato lagane ka best season:

• North India: October-November
• South India: August-September aur January-February
• Ideal Temperature: 20°C - 30°C
      `;
    }

    return `
Tomato ke liye:
• Soil: Sandy Loam
• pH: 6.0 - 7.5
• Irrigation: Drip Best
• Fruiting: 60-70 din
      `;
  }

  // Nitrogen
  if (
    msg.includes("nitrogen") ||
    msg.includes("नाइट्रोजन")
  ) {
    return `
Soil mein Nitrogen kam hai:

• FYM/Gobar Khad: 8-10 ton/acre
• Vermicompost: 2-3 ton/acre
• Green Manure use karein
• Neem Cake use karein
• Soil test 15-20 din baad repeat karein
    `;
  }

  // Rice / Paddy
  if (
    msg.includes("rice") ||
    msg.includes("paddy") ||
    msg.includes("dhan") ||
    msg.includes("धान")
  ) {
    return `
Dhaan (Rice) ki kheti:

1. Soil:
   • Clay Loam
   • pH 5.5 - 7.0

2. Nursery:
   • 20-25 din

3. Fertilizer:
   • DAP
   • Urea split doses mein

4. Irrigation:
   • 2-5 cm pani maintain karein

5. Harvest:
   • 110-140 din
    `;
  }

  return `
Main KhetSetu AI hoon.

Aap pooch sakte hain:
• Soil Health
• Fertilizer Recommendation
• Crop Cultivation
• Disease Management
• Irrigation
• Market Demand
• Government Schemes
• Organic Farming
  `;
};

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "Kripya apna sawal likhiye.",
        source: "validation",
      });
    }

    // Gemini First
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(
          process.env.GEMINI_API_KEY.trim()
        );

        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
        });

        const prompt = `
You are KhetSetu AI, an expert Agriculture Assistant for Indian farmers.

You have expertise in:
- Soil Science
- Crop Cultivation
- Fertilizer Management
- Irrigation
- Pest & Disease Control
- Organic Farming
- Market Demand
- Government Schemes
- Weather-based Farming Advice

Instructions:
1. Reply only in Hindi.
2. Give practical and useful answers.
3. Understand user intent carefully.
4. If user asks about crops, explain cultivation clearly.
5. If user asks about market demand, answer accordingly.
6. Use bullet points whenever useful.
7. Keep answers farmer-friendly.

User Question:
${message}
`;

        const result = await model.generateContent(prompt);

        const reply = result.response.text();

        return res.status(200).json({
          reply,
          source: "gemini",
        });
      } catch (geminiError) {
        console.error("Gemini Error:", geminiError);
      }
    }

    // Fallback
    const reply = smartAgricultureResponse(message);

    return res.status(200).json({
      reply,
      source: "fallback",
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      reply:
        "Maaf kijiye, abhi server mein dikkat aa rahi hai. Kripya thodi der baad phir prayas karein.",
      source: "error",
    });
  }
};