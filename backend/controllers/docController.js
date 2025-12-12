const Document = require('../models/Document');
const { analyzeDocument, translateText } = require('../utils/aiService');

// 1. Upload Document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      console.log('No file uploaded in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', req.file);
    
    // Use Gemini to analyze the uploaded file
    console.log('Analyzing document with AI service...');
    const analysis = await analyzeDocument(req.file.path);
    console.log('AI analysis result:', analysis);

    const newDoc = new Document({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      docType: analysis.docType,
      summary: analysis.summary,
      requiredAttachments: analysis.requiredAttachments,
      version: analysis.version
    });

    console.log('Saving document to database...');
    await newDoc.save();
    console.log('Document saved successfully:', newDoc._id);
    res.json(newDoc);
  } catch (err) {
    console.error('Upload error:', err);
    // Log more detailed error information
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    if (err.message.includes('AI')) {
      return res.status(500).json({ 
        message: 'AI processing failed. Please try another document.',
        error: err.message
      });
    }
    res.status(500).json({ 
      message: 'Upload failed: ' + err.message,
      error: err.message
    });
  }
};

// 2. Get User Documents
exports.getMyDocuments = async (req, res) => {
  try {
    console.log('Fetching documents for user:', req.user.id);
    const docs = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error('Fetch documents error:', err);
    res.status(500).json({ message: 'Fetch failed: ' + err.message });
  }
};

// 3. Translate Summary
exports.translateSummary = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const translated = await translateText(doc.summary, req.body.language);
    res.json({ original: doc.summary, translated, language: req.body.language });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ message: 'Translation failed: ' + err.message });
  }
};

// 4. Check Eligibility (The New 13-Rule Logic)
exports.checkEligibility = (req, res) => {
  const { docType, age, nationality, income, category } = req.body;
  
  const userAge = parseInt(age) || 0;
  const userIncome = parseInt(income) || 0;
  const isIndian = nationality && nationality.toLowerCase() === 'indian';
  
  let eligible = false;
  let reasons = [];

  switch (docType) {
    case 'Aadhar Card':
      if (isIndian) {
        eligible = true;
        reasons.push("✅ Eligible: You are an Indian resident.");
      } else {
        reasons.push("❌ Residency: Aadhar is for residents who have stayed in India for 182+ days.");
      }
      reasons.push("ℹ️ Requirement: Physical presence at enrolment center is mandatory.");
      break;

    case 'PAN Card':
      eligible = true;
      reasons.push("✅ Eligible: Any citizen or entity can apply.");
      if (!isIndian) reasons.push("ℹ️ Note: Foreign citizens must use Form 49AA.");
      reasons.push("ℹ️ Requirement: Valid ID, Address, and DOB proof required.");
      break;

    case 'Voter ID':
      if (userAge >= 18 && isIndian) {
        eligible = true;
        reasons.push("✅ Eligible: You meet the age (18+) and citizenship criteria.");
      } else {
        eligible = false;
        if (userAge < 18) reasons.push("❌ Age: You must be at least 18 years old.");
        if (!isIndian) reasons.push("❌ Citizenship: Only Indian citizens can vote.");
      }
      break;

    case 'Driving License':
      if (userAge >= 18) {
        eligible = true;
        reasons.push("✅ Eligible: You meet the minimum age for a standard vehicle (MCWG/LMV).");
      } else if (userAge >= 16) {
        eligible = true;
        reasons.push("✅ Eligible (Restricted): You can apply for a gearless scooter (50cc) only.");
      } else {
        eligible = false;
        reasons.push("❌ Age: Minimum age is 18 (16 for gearless scooters).");
      }
      break;

    case 'Ration Card':
      if (isIndian) {
        eligible = true;
        reasons.push("✅ Eligible: Indian residents can apply.");
        if (userIncome < 150000) {
          reasons.push("ℹ️ Likely eligible for Priority/BPL card (Income-based).");
        } else {
          reasons.push("ℹ️ Likely eligible for Non-Priority/APL card (White Card).");
        }
      } else {
        eligible = false;
        reasons.push("❌ Residency: Must be an Indian resident.");
      }
      break;

    case 'Student Scholarship':
      if (userIncome < 250000) {
        eligible = true;
        reasons.push("✅ Income: Your family income is within common scholarship limits (< ₹2.5L).");
      } else {
        eligible = false;
        reasons.push("❌ Income: Family income often must be below ₹2.5L.");
      }
      break;

    case 'Income Certificate':
      if (isIndian) {
        eligible = true;
        reasons.push("✅ Eligible: Residents can apply to prove income.");
      } else {
        eligible = false;
        reasons.push("❌ Residency: Must be a resident of the state.");
      }
      break;

    case 'Caste Certificate':
      if (category && category !== 'General') {
        eligible = true;
        reasons.push(`✅ Eligible: Application valid for ${category} category.`);
      } else {
        eligible = false;
        reasons.push("❌ Category: 'General' category does not require a Caste Certificate.");
      }
      break;

    case 'Birth Certificate':
      eligible = true;
      reasons.push("✅ Eligible: Can be applied for any child born in India.");
      break;

    case 'Death Certificate':
      eligible = true;
      reasons.push("✅ Eligible: Can be applied for by immediate relatives.");
      break;

    case 'Income Tax Filing':
      if (userIncome > 250000) {
        eligible = true;
        reasons.push("✅ Mandatory: Your income exceeds the basic exemption limit (₹2.5L).");
      } else {
        reasons.push("ℹ️ Optional: Income is below taxable limit, but filing is recommended.");
      }
      break;

    case 'Passport':
      if (isIndian) {
        eligible = true;
        reasons.push("✅ Eligible: Indian citizens can apply.");
      } else {
        eligible = false;
        reasons.push("❌ Citizenship: Must be an Indian citizen.");
      }
      break;

    case 'EWS Certificate':
      if (category === 'General' || category === 'EWS') {
        if (userIncome < 800000) {
          eligible = true;
          reasons.push("✅ Eligible: Income is below ₹8 Lakhs and category is General.");
        } else {
          eligible = false;
          reasons.push("❌ Income: Family income must be less than ₹8 Lakhs.");
        }
      } else {
        eligible = false;
        reasons.push("❌ Category: EWS is only for General category (not SC/ST/OBC).");
      }
      break;

    default:
      eligible = false;
      reasons.push("Unknown document type.");
  }

  res.json({ eligible, reasons });
};