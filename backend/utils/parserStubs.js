// SIMULATED AI LOGIC

exports.stubParse = (filename) => {
  // TODO: Replace with Google Gemini API call
  // Input: File Buffer/Text -> Prompt: "Analyze this government form..."
  
  return {
    docType: "Income_Certificate_Form_V2",
    version: "2.1.0",
    summary: "This document is an application for an Income Certificate. It requires details about your annual family income from all sources.",
    requiredAttachments: [
      "Identity Proof (Aadhar/Voter ID)",
      "Address Proof",
      "Salary Slip or Affidavit"
    ],
    fieldsFound: ["full_name", "dob", "annual_income", "address"]
  };
};

exports.stubCheckEligibility = (docType, userData) => {
  // Simple logic simulation
  if (docType.includes("Income")) {
    if (userData.income < 100000) {
      return { eligible: true, reason: "Income is within the limit for Scheme A." };
    } else {
      return { eligible: false, reason: "Income exceeds the limit of 100,000." };
    }
  }
  return { eligible: true, reason: "General eligibility met." };
};

exports.stubTranslate = (text, targetLang) => {
  const translations = {
    es: "Este documento es una solicitud de Certificado de Ingresos...",
    hi: "यह दस्तावेज़ आय प्रमाण पत्र के लिए एक आवेदन है...",
    fr: "Ce document est une demande de certificat de revenu..."
  };
  return translations[targetLang] || text + " [Translation unavailable in stub]";
};