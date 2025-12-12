const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Helper: Upload file to Gemini
async function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

// 2. Main Analysis Function
async function analyzeDocument(filePath) {
  try {
    // 👇 UPDATED MODEL HERE
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this government document.
      Return ONLY a raw JSON object (no markdown, no backticks) with this structure:
      {
        "docType": "Type of document (e.g., PAN Card, Aadhar, etc)",
        "summary": "A simple 2-line summary for a non-expert",
        "requiredAttachments": ["List of likely needed attachments"],
        "version": "Document version if visible, else 'Unknown'"
      }
    `;

    const imagePart = await fileToGenerativePart(filePath, "application/pdf");
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    // Clean up the text to ensure it's valid JSON
    let text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw new Error("AI Processing Failed: " + error.message);
  }
}

// 3. Translation Function
async function translateText(text, targetLang) {
  try {
    // 👇 UPDATED MODEL HERE AS WELL
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Translate this text to ${targetLang}. Return only the translated text, nothing else: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Translation Failed:", error);
    throw new Error("Translation Failed");
  }
}

module.exports = { analyzeDocument, translateText };