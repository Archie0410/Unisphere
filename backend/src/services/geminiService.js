import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

// Career counselor system prompt
const CAREER_COUNSELOR_PROMPT = `You are an expert career counselor and educational advisor for UniSphere. Your role is to help students make informed decisions about their education and career paths.

Key Responsibilities:
1. Provide personalized career guidance based on student interests, skills, and goals
2. Suggest relevant academic paths and university programs
3. Offer insights about emerging career fields and job market trends
4. Help students understand the connection between education and career opportunities
5. Provide practical advice for career planning and skill development

Guidelines:
- Be encouraging and supportive while being realistic
- Provide specific, actionable advice
- Consider the student's academic background, interests, and goals
- Suggest multiple options and pathways
- Include information about job prospects, salary ranges, and required skills
- Keep responses concise but comprehensive (2-3 paragraphs)
- Use a friendly, professional tone
- Ask follow-up questions when appropriate to better understand the student's needs

Always start your response with a brief acknowledgment of their question or concern, then provide your guidance.`;

class GeminiService {
  constructor() {
    // Normalize model name to avoid common typos and deprecated suffixes
    let configuredModel = (process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest')
      .toString()
      .trim()
      .replace(/geminii/gi, 'gemini')   // fix accidental double 'i'
      .replace(/-001$/i, '-latest');    // prefer stable latest alias
    if (!/^gemini-/i.test(configuredModel)) {
      configuredModel = 'gemini-1.5-flash-latest';
    }

    this.model = genAI.getGenerativeModel({
      model: configuredModel
    });
    this.chat = null;
  }

  // Initialize a new chat session
  async initializeChat() {
    try {
      this.chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'Hello, I need career guidance.' }],
          },
          {
            role: 'model',
            parts: [{ text: 'Hello! I\'m your AI career counselor at UniSphere. I\'m here to help you explore career paths, understand educational requirements, and make informed decisions about your future. What would you like to discuss today?' }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });
      return true;
    } catch (error) {
      logger.error('Failed to initialize Gemini chat:', error);
      return false;
    }
  }

  // Send a message to the AI counselor
  async sendMessage(message, userContext = {}) {
    try {
      // Create a comprehensive prompt for career guidance
      let prompt = `${CAREER_COUNSELOR_PROMPT}\n\nStudent Question: ${message}`;
      
      // Enhance the message with context if available
      if (userContext.academicBackground || userContext.interests || userContext.goals) {
        prompt = `${CAREER_COUNSELOR_PROMPT}\n\nStudent Context: ${JSON.stringify(userContext)}\n\nStudent Question: ${message}`;
      }

      // Use direct model generation instead of chat
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      logger.info('Gemini AI response generated successfully');
      
      return {
        success: true,
        response: text,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Error in Gemini AI service:', error);
      
      // Fallback response if AI service fails
      return {
        success: false,
        response: "I apologize, but I'm having trouble connecting to my AI services right now. Please try again in a moment, or feel free to explore our career resources and university recommendations in the meantime.",
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  // Get career insights for specific fields
  async getCareerInsights(field) {
    try {
      const prompt = `Provide detailed career insights for the field of ${field}. Include:
      1. Job prospects and growth potential
      2. Required education and skills
      3. Average salary ranges
      4. Top companies or organizations
      5. Emerging trends in this field
      6. Recommended university programs or courses
      
      Format this as a comprehensive but concise overview.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        insights: text,
        field: field,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Error getting career insights:', error);
      return {
        success: false,
        insights: `I'm sorry, I couldn't retrieve specific insights for ${field} at the moment. Please try again later.`,
        field: field,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get university recommendations based on career goals
  async getUniversityRecommendations(careerGoal, preferences = {}) {
    try {
      const prompt = `Based on the career goal of "${careerGoal}" and preferences: ${JSON.stringify(preferences)}, suggest 5-7 universities that would be excellent choices. For each university, include:
      1. Why it's a good fit for this career path
      2. Notable programs or departments
      3. Location and campus environment
      4. Admission competitiveness
      5. Career placement rates (if relevant)
      
      Format as a structured list with clear explanations.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        recommendations: text,
        careerGoal: careerGoal,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Error getting university recommendations:', error);
      return {
        success: false,
        recommendations: `I'm sorry, I couldn't generate university recommendations for "${careerGoal}" at the moment. Please try again later.`,
        careerGoal: careerGoal,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Reset chat session
  async resetChat() {
    try {
      await this.initializeChat();
      return { success: true, message: 'Chat session reset successfully' };
    } catch (error) {
      logger.error('Error resetting chat:', error);
      return { success: false, message: 'Failed to reset chat session' };
    }
  }
}

export default new GeminiService();
