const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const pdfParse = require("pdf-parse");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: Extract text from PDF buffer
async function extractText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (err) {
    console.error("Error reading PDF file:", err);
    throw new Error("Failed to read PDF file content.");
  }
}

exports.analyzeDocument = async (filePath) => {
  try {
    console.log("--- Starting Analysis ---");
    console.log("Reading file:", filePath);

    const text = await extractText(filePath);
    
    // Check if PDF is scanned (image-only)
    if (!text || text.trim().length < 20) {
      console.warn("WARNING: Extracted text is empty. This might be a scanned image PDF.");
      throw new Error("The PDF appears to be an image scan. Please upload a PDF with selectable text.");
    }

    console.log(`Extracted ${text.length} characters. Sending to Gemini...`);

    // Use gemini-1.5-flash for speed/reliability, or fallback to gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `
      You are an expert government document analyzer.
      Analyze the following document text and return a strictly valid JSON object.
      Do not include markdown formatting (like \`\`\`json). 
      
      The JSON structure must be:
      {
        "docType": "String (e.g., Income Certificate)",
        "summary": "String (Simple explanation in plain English)",
        "requiredAttachments": ["String", "String"],
        "version": "String (e.g., 2024 or Unknown)"
      }

      Document Text:
      ${text.substring(0, 8000)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResponse = response.text();

    console.log("Gemini Raw Response:", textResponse);

    // CLEANUP: Find the first '{' and last '}' to ensure valid JSON
    const firstBrace = textResponse.indexOf('{');
    const lastBrace = textResponse.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      textResponse = textResponse.substring(firstBrace, lastBrace + 1);
    } else {
      throw new Error("AI did not return a valid JSON object");
    }

    const jsonResult = JSON.parse(textResponse);
    console.log("Analysis Success:", jsonResult.docType);
    
    return jsonResult;

  } catch (error) {
    // THIS IS WHERE YOU WILL SEE THE REAL ERROR IN YOUR TERMINAL
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("ANALYSIS FAILED. ERROR DETAILS BELOW:");
    console.error(error.message);
    if (error.response) console.error(error.response);
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    // Return the fallback stub so the frontend doesn't crash
    return {
      docType: "Unknown Document (Analysis Failed)",
      summary: `Error: ${error.message}. Please check the backend terminal for details.`,
      requiredAttachments: [],
      version: "Error"
    };
  }
};

exports.translateText = async (text, targetLang) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `Translate this to ${targetLang}: ${text}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Translation Error:", error);
    return "Translation failed.";
  }
};