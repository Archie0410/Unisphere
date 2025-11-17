import { logger } from '../utils/logger.js';
import University from '../models/University.js';

// Fallback mock data if database is not available
const mockUniversities = [
  {
    id: 1,
    name: 'Massachusetts Institute of Technology (MIT)',
    location: 'Cambridge, MA, USA',
    ranking: 1,
    acceptanceRate: 7.3,
    tuition: 55000,
    programs: ['Computer Science', 'Engineering', 'Physics', 'Mathematics'],
    website: 'https://mit.edu',
    description: 'World-renowned institution for science and technology education.',
    image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=MIT'
  },
  {
    id: 2,
    name: 'Stanford University',
    location: 'Stanford, CA, USA',
    ranking: 2,
    acceptanceRate: 4.3,
    tuition: 56000,
    programs: ['Computer Science', 'Business', 'Engineering', 'Medicine'],
    website: 'https://stanford.edu',
    description: 'Leading research university in the heart of Silicon Valley.',
    image: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Stanford'
  },
  {
    id: 3,
    name: 'Harvard University',
    location: 'Cambridge, MA, USA',
    ranking: 3,
    acceptanceRate: 4.6,
    tuition: 54000,
    programs: ['Law', 'Business', 'Medicine', 'Arts & Sciences'],
    website: 'https://harvard.edu',
    description: 'Ivy League institution with centuries of academic excellence.',
    image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Harvard'
  },
  {
    id: 4,
    name: 'University of California, Berkeley',
    location: 'Berkeley, CA, USA',
    ranking: 4,
    acceptanceRate: 14.8,
    tuition: 44000,
    programs: ['Engineering', 'Computer Science', 'Business', 'Environmental Science'],
    website: 'https://berkeley.edu',
    description: 'Public research university known for innovation and social impact.',
    image: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=UC+Berkeley'
  },
  {
    id: 5,
    name: 'University of Oxford',
    location: 'Oxford, England, UK',
    ranking: 5,
    acceptanceRate: 17.5,
    tuition: 39000,
    programs: ['Humanities', 'Sciences', 'Medicine', 'Law'],
    website: 'https://ox.ac.uk',
    description: 'One of the oldest and most prestigious universities in the world.',
    image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Oxford'
  },
  {
    id: 6,
    name: 'University of Cambridge',
    location: 'Cambridge, England, UK',
    ranking: 6,
    acceptanceRate: 21.0,
    tuition: 38000,
    programs: ['Natural Sciences', 'Engineering', 'Mathematics', 'Arts'],
    website: 'https://cam.ac.uk',
    description: 'Historic university with world-class research facilities.',
    image: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Cambridge'
  },
  {
    id: 7,
    name: 'ETH Zurich',
    location: 'Zurich, Switzerland',
    ranking: 7,
    acceptanceRate: 27.0,
    tuition: 1500,
    programs: ['Engineering', 'Architecture', 'Mathematics', 'Natural Sciences'],
    website: 'https://ethz.ch',
    description: 'Leading science and technology university in Europe.',
    image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=ETH+Zurich'
  },
  {
    id: 8,
    name: 'University of Toronto',
    location: 'Toronto, Canada',
    ranking: 8,
    acceptanceRate: 43.0,
    tuition: 45000,
    programs: ['Medicine', 'Engineering', 'Arts & Science', 'Business'],
    website: 'https://utoronto.ca',
    description: 'Canada\'s leading research university with global impact.',
    image: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=U+of+Toronto'
  }
];

class UniversityService {
  constructor() {
    this.externalApiKey = process.env.UNIVERSITY_API_KEY;
  }

  // Get all universities with optional filtering
  async getAllUniversities(filters = {}) {
    try {
      // Try to get from MongoDB first
      let query = { isActive: true };
      
      if (filters.location) {
        query['location.country'] = { $regex: filters.location, $options: 'i' };
      }

      if (filters.program) {
        query['programs.name'] = { $regex: filters.program, $options: 'i' };
      }

      if (filters.maxTuition) {
        query['tuition.international.undergraduate'] = { $lte: filters.maxTuition };
      }

      if (filters.minRanking) {
        query['ranking.global'] = { $lte: filters.minRanking };
      }

      const universities = await University.find(query).limit(100);
      
      if (universities.length > 0) {
        return {
          success: true,
          data: universities,
          total: universities.length,
          filters: filters
        };
      }

      // Fallback to mock data if no database results
      logger.warn('No universities found in database, using mock data');
      let filteredUniversities = [...mockUniversities];

      if (filters.location) {
        filteredUniversities = filteredUniversities.filter(uni => 
          uni.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.program) {
        filteredUniversities = filteredUniversities.filter(uni => 
          uni.programs.some(program => 
            program.toLowerCase().includes(filters.program.toLowerCase())
          )
        );
      }

      if (filters.maxTuition) {
        filteredUniversities = filteredUniversities.filter(uni => 
          uni.tuition <= filters.maxTuition
        );
      }

      if (filters.minRanking) {
        filteredUniversities = filteredUniversities.filter(uni => 
          uni.ranking <= filters.minRanking
        );
      }

      return {
        success: true,
        data: filteredUniversities,
        total: filteredUniversities.length,
        filters: filters
      };
    } catch (error) {
      logger.error('Error getting universities:', error);
      return {
        success: false,
        error: 'Failed to retrieve universities',
        data: []
      };
    }
  }

  // Search universities by name or description
  async searchUniversities(query, limit = 10) {
    try {
      // Try to search in MongoDB first
      const searchQuery = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { 'location.city': { $regex: query, $options: 'i' } },
          { 'location.country': { $regex: query, $options: 'i' } },
          { 'programs.name': { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ],
        isActive: true
      };

      const results = await University.find(searchQuery).limit(limit);
      
      if (results.length > 0) {
        return {
          success: true,
          data: results,
          total: results.length,
          query: query
        };
      }

      // Fallback to mock data if no database results
      logger.warn('No search results in database, using mock data');
      const searchTerm = query.toLowerCase();
      const mockResults = mockUniversities.filter(uni => 
        uni.name.toLowerCase().includes(searchTerm) ||
        uni.description.toLowerCase().includes(searchTerm) ||
        uni.location.toLowerCase().includes(searchTerm) ||
        uni.programs.some(program => program.toLowerCase().includes(searchTerm))
      ).slice(0, limit);

      return {
        success: true,
        data: mockResults,
        total: mockResults.length,
        query: query
      };
    } catch (error) {
      logger.error('Error searching universities:', error);
      return {
        success: false,
        error: 'Failed to search universities',
        data: []
      };
    }
  }

  // Get university by ID
  async getUniversityById(id) {
    try {
      // Try to get from MongoDB first
      const university = await University.findById(id);
      
      if (university) {
        return {
          success: true,
          data: university
        };
      }

      // Fallback to mock data if not found in database
      logger.warn('University not found in database, checking mock data');
      const mockUniversity = mockUniversities.find(uni => uni.id === parseInt(id));
      
      if (!mockUniversity) {
        return {
          success: false,
          error: 'University not found',
          data: null
        };
      }

      return {
        success: true,
        data: mockUniversity
      };
    } catch (error) {
      logger.error('Error getting university by ID:', error);
      return {
        success: false,
        error: 'Failed to retrieve university',
        data: null
      };
    }
  }

  // Get university recommendations based on student profile
  async getRecommendations(studentProfile) {
    try {
      const { interests, academicBackground, budget, location, careerGoals } = studentProfile;
      
      let recommendations = [...this.universities];

      // Filter by budget if specified
      if (budget) {
        recommendations = recommendations.filter(uni => uni.tuition <= budget);
      }

      // Filter by location preference if specified
      if (location) {
        recommendations = recommendations.filter(uni => 
          uni.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Filter by programs of interest
      if (interests && interests.length > 0) {
        recommendations = recommendations.filter(uni => 
          uni.programs.some(program => 
            interests.some(interest => 
              program.toLowerCase().includes(interest.toLowerCase())
            )
          )
        );
      }

      // Sort by ranking (best matches first)
      recommendations.sort((a, b) => a.ranking - b.ranking);

      // Limit to top 5 recommendations
      recommendations = recommendations.slice(0, 5);

      return {
        success: true,
        data: recommendations,
        total: recommendations.length,
        profile: studentProfile
      };
    } catch (error) {
      logger.error('Error getting recommendations:', error);
      return {
        success: false,
        error: 'Failed to generate recommendations',
        data: []
      };
    }
  }

  // Get university statistics
  async getStatistics() {
    try {
      // Try to get statistics from MongoDB first
      const dbStats = await University.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalUniversities: { $sum: 1 },
            averageTuition: { $avg: '$tuition.international.undergraduate' },
            averageAcceptanceRate: { $avg: '$acceptanceRate' },
            countries: { $addToSet: '$location.country' }
          }
        }
      ]);

      if (dbStats.length > 0) {
        const stats = {
          totalUniversities: dbStats[0].totalUniversities,
          averageTuition: Math.round(dbStats[0].averageTuition || 0),
          averageAcceptanceRate: Math.round(dbStats[0].averageAcceptanceRate || 0),
          topPrograms: await this.getTopProgramsFromDB(),
          countries: dbStats[0].countries
        };

        return {
          success: true,
          data: stats
        };
      }

      // Fallback to mock data statistics
      logger.warn('No statistics available in database, using mock data');
      const stats = {
        totalUniversities: mockUniversities.length,
        averageTuition: Math.round(
          mockUniversities.reduce((sum, uni) => sum + uni.tuition, 0) / mockUniversities.length
        ),
        averageAcceptanceRate: Math.round(
          mockUniversities.reduce((sum, uni) => sum + uni.acceptanceRate, 0) / mockUniversities.length
        ),
        topPrograms: this.getTopPrograms(),
        countries: [...new Set(mockUniversities.map(uni => uni.location.split(', ').pop()))]
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      logger.error('Error getting statistics:', error);
      return {
        success: false,
        error: 'Failed to retrieve statistics',
        data: null
      };
    }
  }

  // Helper method to get top programs from database
  async getTopProgramsFromDB() {
    try {
      const topPrograms = await University.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$programs' },
        {
          $group: {
            _id: '$programs.name',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            program: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]);

      return topPrograms;
    } catch (error) {
      logger.error('Error getting top programs from database:', error);
      return [];
    }
  }

  // Helper method to get top programs from mock data
  getTopPrograms() {
    const programCount = {};
    mockUniversities.forEach(uni => {
      uni.programs.forEach(program => {
        programCount[program] = (programCount[program] || 0) + 1;
      });
    });

    return Object.entries(programCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([program, count]) => ({ program, count }));
  }

  // Try to fetch from external API if available
  async fetchFromExternalAPI(endpoint, params = {}) {
    if (!this.externalApiKey) {
      logger.warn('No external API key configured, using mock data');
      return null;
    }

    try {
      const response = await axios.get(`https://api.universities.com/${endpoint}`, {
        params: { ...params, api_key: this.externalApiKey },
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      logger.error('External API request failed:', error.message);
      return null;
    }
  }
}

export default new UniversityService();
