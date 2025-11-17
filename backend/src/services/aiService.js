import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

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

class AIService {
  constructor() {
    this.gemini = null;
    this.openai = null;
    this.openaiModel = 'gpt-4o-mini';
    this.initializeProviders();
  }

  initializeProviders() {
    // Initialize Gemini (primary provider)
    if (process.env.GEMINI_API_KEY) {
      try {
        // Validate API key format (should start with AIza)
        if (!process.env.GEMINI_API_KEY.startsWith('AIza')) {
          logger.warn('⚠️ GEMINI_API_KEY format appears invalid (should start with "AIza")');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Normalize common typos/misconfigurations in model name
        // - Trim whitespace
        // - Fix accidental "geminii" -> "gemini"
        // - Prefer "-latest" alias over old "-001" suffix
        let configuredModel = (process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest')
          .toString()
          .trim()
          .replace(/geminii/gi, 'gemini')
          .replace(/-001$/i, '-latest');
        if (!/^gemini-/i.test(configuredModel)) {
          configuredModel = 'gemini-1.5-flash-latest';
        }

        this.gemini = genAI.getGenerativeModel({
          model: configuredModel
        });
        logger.info('✅ Gemini provider initialized with model:', configuredModel);
      } catch (error) {
        logger.error('⚠️ Failed to initialize Gemini:', {
          message: error.message,
          stack: error.stack
        });
        this.gemini = null;
      }
    } else {
      logger.warn('⚠️ GEMINI_API_KEY not found in environment variables');
    }

    if (!this.gemini) {
      logger.warn('⚠️ No AI providers available - running in demo mode');
    }

    // Initialize OpenAI (secondary provider)
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.openaiModel = (process.env.OPENAI_MODEL || 'gpt-4o-mini').toString().trim();
        logger.info('✅ OpenAI provider initialized with model:', this.openaiModel);
      } catch (error) {
        logger.error('⚠️ Failed to initialize OpenAI:', {
          message: error.message,
          stack: error.stack
        });
        this.openai = null;
      }
    } else {
      logger.warn('ℹ️ OPENAI_API_KEY not set - OpenAI fallback disabled');
    }
  }

  // Send a message to the AI counselor with fallback
  async sendMessage(message, userContext = {}) {
    // Create a comprehensive prompt for career guidance
    let prompt = `${CAREER_COUNSELOR_PROMPT}\n\nStudent Question: ${message}`;
    
    // Enhance the message with context if available
    if (userContext.academicBackground || userContext.interests || userContext.goals) {
      prompt = `${CAREER_COUNSELOR_PROMPT}\n\nStudent Context: ${JSON.stringify(userContext)}\n\nStudent Question: ${message}`;
    }

    // Try Gemini
    if (this.gemini) {
      try {
        const result = await this.gemini.generateContent(prompt);
        const response = await result.response;
        
        // Check if response has candidates and text
        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('No candidates in Gemini response');
        }
        
        // Check for blocked content or safety issues
        const candidate = response.candidates[0];
        if (candidate.finishReason === 'SAFETY') {
          throw new Error('Content was blocked by Gemini safety filters');
        }
        if (candidate.finishReason === 'RECITATION') {
          throw new Error('Content was blocked due to recitation concerns');
        }
        
        const text = response.text();
        
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from Gemini');
        }

        logger.info('✅ Gemini response generated successfully');
        
        return {
          success: true,
          response: text,
          provider: 'Gemini',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        // Handle different types of Gemini API errors
        let errorDetails = {
          message: error.message,
          name: error.name
        };

        // Check for specific error types
        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('401') || error.message?.includes('API key')) {
          errorDetails.type = 'INVALID_API_KEY';
          logger.error('❌ Gemini API key is invalid or missing');
        } else if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
          errorDetails.type = 'QUOTA_EXCEEDED';
          logger.error('❌ Gemini API quota exceeded');
        } else if (error.message?.includes('SAFETY') || error.message?.includes('blocked') || error.message?.includes('safety')) {
          errorDetails.type = 'CONTENT_FILTERED';
          logger.error('❌ Content was filtered by Gemini safety settings');
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorDetails.type = 'NETWORK_ERROR';
          logger.error('❌ Network error connecting to Gemini API');
        } else {
          errorDetails.type = 'UNKNOWN_ERROR';
          errorDetails.stack = error.stack;
        }

        logger.error('⚠️ Gemini failed:', errorDetails);
      }
    }

    // Try OpenAI fallback
    if (this.openai) {
      try {
        // Prefer Responses API for latest SDKs
        const result = await this.openai.responses.create({
          model: this.openaiModel,
          input: prompt
        });
        const text = result.output_text || (result.content?.[0]?.text ?? '');
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from OpenAI');
        }
        logger.info('✅ OpenAI response generated successfully');
        return {
          success: true,
          response: text,
          provider: 'OpenAI',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        logger.error('⚠️ OpenAI failed:', {
          message: error.message,
          name: error.name
        });
      }
    }

    // Fallback response if AI service fails
    logger.warn('⚠️ AI provider failed, using fallback response');
    return {
      success: false,
      response: "I apologize, but I'm having trouble connecting to my AI services right now. However, I can still help you with our comprehensive career resources and university recommendations. You can explore our university database, take career assessments, and access our educational roadmaps. Would you like to browse universities or explore career paths?",
      provider: 'Fallback',
      timestamp: new Date().toISOString()
    };
  }

  // Get career insights for specific fields
  async getCareerInsights(field) {
    const prompt = `Provide detailed career insights for the field of ${field}. Include:
    1. Job prospects and growth potential
    2. Required education and skills
    3. Average salary ranges
    4. Top companies or organizations
    5. Emerging trends in this field
    6. Recommended university programs or courses
    
    Format this as a comprehensive but concise overview.`;

    // Try Gemini
    if (this.gemini) {
      try {
        const result = await this.gemini.generateContent(prompt);
        const response = await result.response;
        
        // Check if response has candidates and text
        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('No candidates in Gemini response');
        }
        
        // Check for blocked content or safety issues
        const candidate = response.candidates[0];
        if (candidate.finishReason === 'SAFETY') {
          throw new Error('Content was blocked by Gemini safety filters');
        }
        if (candidate.finishReason === 'RECITATION') {
          throw new Error('Content was blocked due to recitation concerns');
        }
        
        const text = response.text();
        
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from Gemini');
        }

        logger.info('✅ Gemini career insights generated successfully');
        
        return {
          success: true,
          insights: text,
          field: field,
          provider: 'Gemini',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        // Handle different types of Gemini API errors
        let errorDetails = {
          message: error.message,
          name: error.name,
          field: field
        };

        // Check for specific error types
        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('401') || error.message?.includes('API key')) {
          errorDetails.type = 'INVALID_API_KEY';
          logger.error('❌ Gemini API key is invalid or missing');
        } else if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
          errorDetails.type = 'QUOTA_EXCEEDED';
          logger.error('❌ Gemini API quota exceeded');
        } else if (error.message?.includes('SAFETY') || error.message?.includes('blocked') || error.message?.includes('safety')) {
          errorDetails.type = 'CONTENT_FILTERED';
          logger.error('❌ Content was filtered by Gemini safety settings');
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorDetails.type = 'NETWORK_ERROR';
          logger.error('❌ Network error connecting to Gemini API');
        } else {
          errorDetails.type = 'UNKNOWN_ERROR';
          errorDetails.stack = error.stack;
        }

        logger.error('⚠️ Gemini career insights failed:', errorDetails);
      }
    }

    // Try OpenAI fallback
    if (this.openai) {
      try {
        const result = await this.openai.responses.create({
          model: this.openaiModel,
          input: prompt
        });
        const text = result.output_text || '';
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from OpenAI');
        }
        logger.info('✅ OpenAI career insights generated successfully');
        return {
          success: true,
          insights: text,
          field: field,
          provider: 'OpenAI',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        logger.error('⚠️ OpenAI career insights failed:', {
          message: error.message,
          name: error.name,
          field: field
        });
      }
    }

    // Fallback response
    return {
      success: false,
      insights: `I'm sorry, I couldn't retrieve specific insights for ${field} at the moment. Please try again later or explore our university database for programs in this field.`,
      field: field,
      provider: 'Fallback',
      timestamp: new Date().toISOString()
    };
  }

  // Get university recommendations based on career goals
  async getUniversityRecommendations(careerGoal, preferences = {}) {
    const prompt = `Based on the career goal of "${careerGoal}" and preferences: ${JSON.stringify(preferences)}, suggest 5-7 universities that would be excellent choices. For each university, include:
    1. Why it's a good fit for this career path
    2. Notable programs or departments
    3. Location and campus environment
    4. Admission competitiveness
    5. Career placement rates (if relevant)
    
    Format as a structured list with clear explanations.`;

    // Try Gemini
    if (this.gemini) {
      try {
        const result = await this.gemini.generateContent(prompt);
        const response = await result.response;
        
        // Check if response has candidates and text
        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('No candidates in Gemini response');
        }
        
        // Check for blocked content or safety issues
        const candidate = response.candidates[0];
        if (candidate.finishReason === 'SAFETY') {
          throw new Error('Content was blocked by Gemini safety filters');
        }
        if (candidate.finishReason === 'RECITATION') {
          throw new Error('Content was blocked due to recitation concerns');
        }
        
        const text = response.text();
        
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from Gemini');
        }

        logger.info('✅ Gemini recommendations generated successfully');
        
        return {
          success: true,
          recommendations: text,
          careerGoal: careerGoal,
          provider: 'Gemini',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        // Handle different types of Gemini API errors
        let errorDetails = {
          message: error.message,
          name: error.name,
          careerGoal: careerGoal
        };

        // Check for specific error types
        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('401') || error.message?.includes('API key')) {
          errorDetails.type = 'INVALID_API_KEY';
          logger.error('❌ Gemini API key is invalid or missing');
        } else if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
          errorDetails.type = 'QUOTA_EXCEEDED';
          logger.error('❌ Gemini API quota exceeded');
        } else if (error.message?.includes('SAFETY') || error.message?.includes('blocked') || error.message?.includes('safety')) {
          errorDetails.type = 'CONTENT_FILTERED';
          logger.error('❌ Content was filtered by Gemini safety settings');
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorDetails.type = 'NETWORK_ERROR';
          logger.error('❌ Network error connecting to Gemini API');
        } else {
          errorDetails.type = 'UNKNOWN_ERROR';
          errorDetails.stack = error.stack;
        }

        logger.error('⚠️ Gemini recommendations failed:', errorDetails);
      }
    }

    // Try OpenAI fallback
    if (this.openai) {
      try {
        const result = await this.openai.responses.create({
          model: this.openaiModel,
          input: prompt
        });
        const text = result.output_text || '';
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from OpenAI');
        }
        logger.info('✅ OpenAI recommendations generated successfully');
        return {
          success: true,
          recommendations: text,
          careerGoal: careerGoal,
          provider: 'OpenAI',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        logger.error('⚠️ OpenAI recommendations failed:', {
          message: error.message,
          name: error.name,
          careerGoal: careerGoal
        });
      }
    }

    // Fallback response
    return {
      success: false,
      recommendations: `I'm sorry, I couldn't generate university recommendations for "${careerGoal}" at the moment. Please try again later or explore our university database directly.`,
      careerGoal: careerGoal,
      provider: 'Fallback',
      timestamp: new Date().toISOString()
    };
  }

  // Get service status
  getStatus() {
    return {
      gemini: !!this.gemini,
      openai: !!this.openai,
      available: !!this.gemini || !!this.openai
    };
  }
}

export default new AIService();
