import { storage } from "./storage";

// This function simulates AI response generation
// In a production environment, you would integrate with the Google Gemini API or other AI services
export async function sendAiResponse(message: string, language: string): Promise<string> {
  try {
    // Get API key from storage
    const apiKey = await storage.getApiKeyByProvider("gemini");
    const actualApiKey = process.env.GEMINI_API_KEY || (apiKey?.keyValue || "");
    
    if (!actualApiKey) {
      console.warn("No API key found for Gemini. Using fallback responses.");
      return getFallbackResponse(message, language);
    }
    
    // Attempt to use Google Gemini API for responses
    // For production, you would implement the actual API call here
    return getFallbackResponse(message, language);
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}

// Fallback responses for when the API is not available or during development
function getFallbackResponse(message: string, language: string): string {
  const lowercaseMessage = message.toLowerCase();
  
  // Basic greeting detection
  if (lowercaseMessage.includes("hello") || 
      lowercaseMessage.includes("hi") || 
      lowercaseMessage.includes("greetings")) {
    
    if (language === "mas") {
      return "Sopa! (Hello in Maasai) How can I assist you today with Maasai language?";
    } else if (language === "swa") {
      return "Habari! (Hello in Kiswahili) How can I assist you today with Kiswahili language?";
    } else if (language === "kik") {
      return "Nĩatia! (Hello in Kikuyu) How can I assist you today with Kikuyu language?";
    } else {
      return "Hello! How can I assist you today?";
    }
  }
  
  // Translation request detection
  if (lowercaseMessage.includes("translate") || 
      lowercaseMessage.includes("how do you say")) {
    
    if (language === "mas") {
      return "In Maasai, common phrases include:\n- Sopa - Hello\n- Kaa eeta? - How are you?\n- Epa - Good\n- Ashe - Thank you\n\nWould you like to learn more specific Maasai phrases?";
    } else if (language === "swa") {
      return "In Kiswahili, common phrases include:\n- Habari - Hello\n- Habari yako? - How are you?\n- Nzuri - Good\n- Asante - Thank you\n\nWould you like to learn more specific Kiswahili phrases?";
    } else if (language === "kik") {
      return "In Kikuyu, common phrases include:\n- Nĩatia - Hello\n- Ūhoro waku? - How are you?\n- Nĩ mwega - Good\n- Nĩ ngatho - Thank you\n\nWould you like to learn more specific Kikuyu phrases?";
    } else {
      return "I can help you translate between various Kenyan languages. Please specify which language you'd like to translate to or from.";
    }
  }
  
  // Cultural information request
  if (lowercaseMessage.includes("culture") || 
      lowercaseMessage.includes("tradition") || 
      lowercaseMessage.includes("custom")) {
    
    if (language === "mas") {
      return "Maasai culture is rich in traditions. The Maasai are known for their distinctive customs, dress, and social organization. They are semi-nomadic people located primarily in Kenya and Tanzania. Their traditional lifestyle centers around their cattle, which are their primary source of food and measure of wealth. Would you like to know more about specific aspects of Maasai culture?";
    } else if (language === "swa") {
      return "Swahili culture blends African, Arab, Persian, and Indian influences. It developed along the East African coast, with traditions centered around community, respect for elders, and hospitality. Would you like to know more about specific aspects of Swahili culture?";
    } else {
      return "Kenya has over 40 ethnic groups, each with its own unique culture and traditions. Is there a specific Kenyan culture you'd like to learn more about?";
    }
  }
  
  // Default response
  return "I'm here to help you learn about Kenyan languages, particularly Maasai, Kiswahili, and others. You can ask me to translate phrases, teach you about cultural contexts, or provide language learning resources. What would you like to know?";
}
