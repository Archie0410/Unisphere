// Mock the logger first
jest.mock('../../utils/logger.js', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  }
}));

// Mock the University model
// This simulates the database being available but returning empty results
// which triggers the mock data fallback in the service
jest.mock('../../models/University.js', () => {
  // Create fresh mocks inside the factory
  const find = jest.fn().mockReturnValue({
    limit: jest.fn().mockResolvedValue([])
  });
  const findById = jest.fn().mockResolvedValue(null);
  const aggregate = jest.fn().mockResolvedValue([]);
  
  return {
    __esModule: true,
    default: {
      find,
      findById,
      aggregate,
    }
  };
});

// Import the service and University AFTER mocking
import universityService from '../universityService.js';
import University from '../../models/University.js';

describe('UniversityService Unit Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Reset University mock to return empty arrays (triggers fallback to mock data)
    // This ensures the service uses the fallback mock data
    University.find.mockReturnValue({
      limit: jest.fn().mockResolvedValue([])
    });
    University.findById.mockResolvedValue(null);
    University.aggregate.mockResolvedValue([]);
  });

  // TEST 1: Search Universities Functionality
  describe('searchUniversities', () => {
    it('should search universities by name and return MIT when searching for "MIT"', async () => {
      const query = 'MIT';
      const result = await universityService.searchUniversities(query);

      // Assertions
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(result.query).toBe(query);
      
      // Verify MIT is in the results
      const mitUniversity = result.data.find(uni => 
        uni.name.toLowerCase().includes('mit')
      );
      expect(mitUniversity).toBeDefined();
      expect(mitUniversity.name).toContain('MIT');
      expect(mitUniversity.ranking).toBe(1);
    });

    it('should search universities by location (Cambridge)', async () => {
      const query = 'Cambridge';
      const result = await universityService.searchUniversities(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      
      // Verify all results contain Cambridge
      result.data.forEach(uni => {
        const matchesCambridge = 
          uni.name.toLowerCase().includes('cambridge') ||
          uni.location.toLowerCase().includes('cambridge') ||
          uni.description.toLowerCase().includes('cambridge');
        expect(matchesCambridge).toBe(true);
      });
    });

    it('should search universities by program (Computer Science)', async () => {
      const query = 'Computer Science';
      const result = await universityService.searchUniversities(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      
      // Verify all results have Computer Science in programs
      result.data.forEach(uni => {
        const hasComputerScience = uni.programs.some(program => 
          program.toLowerCase().includes('computer science')
        );
        expect(hasComputerScience).toBe(true);
      });
    });

    it('should respect the limit parameter', async () => {
      const query = 'University';
      const limit = 3;
      const result = await universityService.searchUniversities(query, limit);

      expect(result.success).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(limit);
      expect(result.total).toBeLessThanOrEqual(limit);
    });

    it('should return empty results for non-existent search term', async () => {
      const query = 'NonExistentUniversity12345XYZ';
      const result = await universityService.searchUniversities(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBe(0);
      expect(result.data.length).toBe(0);
    });
  });

  // TEST 2: Get All Universities with Filters
  describe('getAllUniversities with filters', () => {
    it('should return all universities when no filters are provided', async () => {
      const result = await universityService.getAllUniversities({});

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(result.filters).toEqual({});
      
      // Should have at least 8 universities (from mock data)
      expect(result.total).toBeGreaterThanOrEqual(8);
    });

    it('should filter universities by location (USA)', async () => {
      const filters = { location: 'USA' };
      const result = await universityService.getAllUniversities(filters);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.filters.location).toBe('USA');
      
      // Verify all results are from USA
      result.data.forEach(uni => {
        expect(uni.location.toLowerCase()).toContain('usa');
      });
      
      // Should have multiple USA universities
      expect(result.total).toBeGreaterThan(0);
    });

    it('should filter universities by program (Engineering)', async () => {
      const filters = { program: 'Engineering' };
      const result = await universityService.getAllUniversities(filters);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      
      // Verify all results have Engineering program
      result.data.forEach(uni => {
        const hasEngineering = uni.programs.some(program => 
          program.toLowerCase().includes('engineering')
        );
        expect(hasEngineering).toBe(true);
      });
    });

    it('should filter universities by max tuition (45000)', async () => {
      const filters = { maxTuition: 45000 };
      const result = await universityService.getAllUniversities(filters);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      
      // Verify all results have tuition <= maxTuition
      result.data.forEach(uni => {
        expect(uni.tuition).toBeLessThanOrEqual(45000);
      });
      
      // Should include ETH Zurich (1500) and other affordable options
      expect(result.total).toBeGreaterThan(0);
    });

    it('should filter universities by minimum ranking (top 5)', async () => {
      const filters = { minRanking: 5 };
      const result = await universityService.getAllUniversities(filters);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      
      // Verify all results have ranking <= minRanking (lower ranking number is better)
      result.data.forEach(uni => {
        expect(uni.ranking).toBeLessThanOrEqual(5);
      });
      
      // Should include top 5 universities
      expect(result.total).toBeGreaterThanOrEqual(5);
    });

    it('should apply multiple filters simultaneously (location + program + maxTuition)', async () => {
      const filters = { 
        location: 'USA',
        program: 'Computer Science',
        maxTuition: 55000
      };
      const result = await universityService.getAllUniversities(filters);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      
      // Verify all results match ALL filters
      result.data.forEach(uni => {
        // Location filter
        expect(uni.location.toLowerCase()).toContain('usa');
        
        // Program filter
        const hasComputerScience = uni.programs.some(program => 
          program.toLowerCase().includes('computer science')
        );
        expect(hasComputerScience).toBe(true);
        
        // Tuition filter
        expect(uni.tuition).toBeLessThanOrEqual(55000);
      });
    });

    it('should return empty array when filters match no universities', async () => {
      const filters = { 
        location: 'Mars',
        maxTuition: 100
      };
      const result = await universityService.getAllUniversities(filters);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBe(0);
      expect(result.data.length).toBe(0);
    });
  });

  // TEST 3: Get University by ID
  describe('getUniversityById', () => {
    it('should return MIT university when searching for ID 1', async () => {
      const id = '1';
      const result = await universityService.getUniversityById(id);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).not.toBeNull();
      expect(result.data.id).toBe(1);
      expect(result.data.name).toContain('MIT');
      expect(result.data.ranking).toBe(1);
      expect(result.data.location).toContain('Cambridge');
      expect(result.data.programs).toContain('Computer Science');
    });

    it('should return Stanford university when searching for ID 2', async () => {
      const id = '2';
      const result = await universityService.getUniversityById(id);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).not.toBeNull();
      expect(result.data.id).toBe(2);
      expect(result.data.name).toContain('Stanford');
      expect(result.data.ranking).toBe(2);
      expect(result.data.location).toContain('Stanford');
      expect(result.data.programs).toContain('Computer Science');
    });

    it('should return null when searching for non-existent ID', async () => {
      const id = '999';
      const result = await universityService.getUniversityById(id);

      expect(result.success).toBe(false);
      expect(result.error).toBe('University not found');
      expect(result.data).toBeNull();
    });

    it('should handle string and numeric ID formats', async () => {
      // Test with numeric ID
      const numericResult = await universityService.getUniversityById(1);
      expect(numericResult.success).toBe(true);
      expect(numericResult.data.id).toBe(1);

      // Test with string ID
      const stringResult = await universityService.getUniversityById('1');
      expect(stringResult.success).toBe(true);
      expect(stringResult.data.id).toBe(1);
    });

    it('should return university with all required fields', async () => {
      const id = '3'; // Harvard
      const result = await universityService.getUniversityById(id);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      // Verify all required fields are present
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('name');
      expect(result.data).toHaveProperty('location');
      expect(result.data).toHaveProperty('ranking');
      expect(result.data).toHaveProperty('acceptanceRate');
      expect(result.data).toHaveProperty('tuition');
      expect(result.data).toHaveProperty('programs');
      expect(result.data).toHaveProperty('website');
      expect(result.data).toHaveProperty('description');
      
      // Verify data types
      expect(typeof result.data.id).toBe('number');
      expect(typeof result.data.name).toBe('string');
      expect(typeof result.data.location).toBe('string');
      expect(typeof result.data.ranking).toBe('number');
      expect(Array.isArray(result.data.programs)).toBe(true);
    });
  });

  // TEST 4: Get University Statistics
  describe('getStatistics', () => {
    it('should return statistics with total universities count', async () => {
      const result = await universityService.getStatistics();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('totalUniversities');
      expect(typeof result.data.totalUniversities).toBe('number');
      expect(result.data.totalUniversities).toBeGreaterThan(0);
      // Should have 8 universities in mock data
      expect(result.data.totalUniversities).toBe(8);
    });

    it('should return average tuition calculation', async () => {
      const result = await universityService.getStatistics();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('averageTuition');
      expect(typeof result.data.averageTuition).toBe('number');
      expect(result.data.averageTuition).toBeGreaterThan(0);
      // Average should be reasonable (between 1000 and 60000 based on mock data)
      expect(result.data.averageTuition).toBeGreaterThan(1000);
      expect(result.data.averageTuition).toBeLessThan(60000);
    });

    it('should return average acceptance rate', async () => {
      const result = await universityService.getStatistics();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('averageAcceptanceRate');
      expect(typeof result.data.averageAcceptanceRate).toBe('number');
      // Acceptance rate should be between 0 and 100
      expect(result.data.averageAcceptanceRate).toBeGreaterThanOrEqual(0);
      expect(result.data.averageAcceptanceRate).toBeLessThanOrEqual(100);
    });

    it('should return list of countries', async () => {
      const result = await universityService.getStatistics();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('countries');
      expect(Array.isArray(result.data.countries)).toBe(true);
      expect(result.data.countries.length).toBeGreaterThan(0);
      
      // Verify countries are strings
      result.data.countries.forEach(country => {
        expect(typeof country).toBe('string');
        expect(country.length).toBeGreaterThan(0);
      });
      
      // Should include USA, UK, Switzerland, Canada from mock data
      const countryNames = result.data.countries.map(c => c.toLowerCase());
      expect(countryNames.some(c => c.includes('usa') || c.includes('united states'))).toBe(true);
    });

    it('should return top programs list', async () => {
      const result = await universityService.getStatistics();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('topPrograms');
      expect(Array.isArray(result.data.topPrograms)).toBe(true);
      expect(result.data.topPrograms.length).toBeGreaterThan(0);
      
      // Verify top programs structure
      result.data.topPrograms.forEach(program => {
        expect(program).toHaveProperty('program');
        expect(program).toHaveProperty('count');
        expect(typeof program.program).toBe('string');
        expect(typeof program.count).toBe('number');
        expect(program.count).toBeGreaterThan(0);
      });
      
      // Should have Engineering as a top program (appears in multiple universities)
      const programNames = result.data.topPrograms.map(p => p.program.toLowerCase());
      expect(programNames.some(p => p.includes('engineering'))).toBe(true);
    });

    it('should return all required statistics fields', async () => {
      const result = await universityService.getStatistics();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      // Verify all required fields
      expect(result.data).toHaveProperty('totalUniversities');
      expect(result.data).toHaveProperty('averageTuition');
      expect(result.data).toHaveProperty('averageAcceptanceRate');
      expect(result.data).toHaveProperty('topPrograms');
      expect(result.data).toHaveProperty('countries');
      
      // Verify data types
      expect(typeof result.data.totalUniversities).toBe('number');
      expect(typeof result.data.averageTuition).toBe('number');
      expect(typeof result.data.averageAcceptanceRate).toBe('number');
      expect(Array.isArray(result.data.topPrograms)).toBe(true);
      expect(Array.isArray(result.data.countries)).toBe(true);
    });

    it('should calculate correct average tuition from mock data', async () => {
      const result = await universityService.getStatistics();

      expect(result.success).toBe(true);
      // Mock data tuitions: 55000, 56000, 54000, 44000, 39000, 38000, 1500, 45000
      // Average = (55000 + 56000 + 54000 + 44000 + 39000 + 38000 + 1500 + 45000) / 8
      // Average = 339125 / 8 = 42390.625, rounded = 42391
      const expectedAverage = Math.round(
        (55000 + 56000 + 54000 + 44000 + 39000 + 38000 + 1500 + 45000) / 8
      );
      expect(result.data.averageTuition).toBe(expectedAverage);
    });

    it('should return unique countries only', async () => {
      const result = await universityService.getStatistics();

      expect(result.success).toBe(true);
      const countries = result.data.countries;
      
      // Check for duplicates
      const uniqueCountries = [...new Set(countries)];
      expect(countries.length).toBe(uniqueCountries.length);
    });
  });
});