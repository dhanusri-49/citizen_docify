// backend/test-models.js
require('dotenv').config();
// This URL lists models without needing the SDK library
const https = require('https');

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("--- AVAILABLE MODELS FOR YOUR KEY ---");
    const json = JSON.parse(data);
    if(json.models) {
        json.models.forEach(m => console.log(m.name));
    } else {
        console.log("Error:", json);
    }
  });
}).on('error', (err) => {
  console.error("Error:", err.message);
});