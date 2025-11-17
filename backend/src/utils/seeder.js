import { connectDB, disconnectDB } from '../config/database.js';
import { getModels } from '../models/index.js';
import { logger } from './logger.js';

const universities = [
  {
    name: 'Massachusetts Institute of Technology (MIT)',
    location: {
      country: 'USA',
      city: 'Cambridge',
      state: 'Massachusetts',
      coordinates: { latitude: 42.3601, longitude: -71.0589 }
    },
    ranking: { global: 1, national: 1 },
    acceptanceRate: 7.3,
    tuition: {
      domestic: { undergraduate: 55000, graduate: 58000 },
      international: { undergraduate: 55000, graduate: 58000 },
      currency: 'USD'
    },
    programs: [
      {
        name: 'Computer Science',
        level: 'undergraduate',
        department: 'School of Engineering',
        duration: '4 years',
        tuition: 55000,
        requirements: ['SAT/ACT', 'High School Diploma', 'Strong Math Background'],
        description: 'Comprehensive computer science program with focus on algorithms, software engineering, and AI.'
      },
      {
        name: 'Electrical Engineering',
        level: 'undergraduate',
        department: 'School of Engineering',
        duration: '4 years',
        tuition: 55000,
        requirements: ['SAT/ACT', 'High School Diploma', 'Physics and Math'],
        description: 'Advanced electrical engineering with focus on electronics, communications, and power systems.'
      }
    ],
    website: 'https://mit.edu',
    description: 'World-renowned institution for science and technology education, known for cutting-edge research and innovation.',
    images: {
      logo: 'https://via.placeholder.com/300x200/667eea/ffffff?text=MIT',
      campus: ['https://via.placeholder.com/400x300/667eea/ffffff?text=MIT+Campus']
    },
    contact: {
      email: 'admissions@mit.edu',
      phone: '+1-617-253-1000',
      address: '77 Massachusetts Ave, Cambridge, MA 02139, USA'
    },
    statistics: {
      totalStudents: 11520,
      internationalStudents: 42,
      studentFacultyRatio: 3.1,
      graduationRate: 94,
      employmentRate: 95
    },
    facilities: [
      {
        name: 'MIT Libraries',
        description: 'Extensive library system with millions of volumes',
        type: 'academic'
      },
      {
        name: 'Athletic Facilities',
        description: 'State-of-the-art sports and recreation centers',
        type: 'recreational'
      }
    ],
    admissionRequirements: {
      gpa: { min: 3.8, recommended: 4.0 },
      sat: { min: 1500, recommended: 1550 },
      toefl: { min: 100, recommended: 110 },
      documents: ['Transcripts', 'Letters of Recommendation', 'Personal Statement', 'Portfolio']
    },
    scholarships: [
      {
        name: 'MIT Presidential Scholarship',
        amount: 25000,
        type: 'merit',
        eligibility: ['High academic achievement', 'Leadership potential'],
        description: 'Merit-based scholarship for outstanding students',
        deadline: new Date('2024-01-15')
      }
    ],
    tags: ['engineering', 'technology', 'research', 'innovation', 'prestigious'],
    isActive: true,
    featured: true,
    verified: true
  },
  {
    name: 'Stanford University',
    location: {
      country: 'USA',
      city: 'Stanford',
      state: 'California',
      coordinates: { latitude: 37.4275, longitude: -122.1697 }
    },
    ranking: { global: 2, national: 2 },
    acceptanceRate: 4.3,
    tuition: {
      domestic: { undergraduate: 56000, graduate: 59000 },
      international: { undergraduate: 56000, graduate: 59000 },
      currency: 'USD'
    },
    programs: [
      {
        name: 'Computer Science',
        level: 'undergraduate',
        department: 'School of Engineering',
        duration: '4 years',
        tuition: 56000,
        requirements: ['SAT/ACT', 'High School Diploma', 'Strong Programming Background'],
        description: 'Leading computer science program in the heart of Silicon Valley.'
      },
      {
        name: 'Business Administration',
        level: 'graduate',
        department: 'Graduate School of Business',
        duration: '2 years',
        tuition: 59000,
        requirements: ['GMAT/GRE', 'Bachelor\'s Degree', 'Work Experience'],
        description: 'Prestigious MBA program with strong entrepreneurship focus.'
      }
    ],
    website: 'https://stanford.edu',
    description: 'Leading research university in the heart of Silicon Valley, known for innovation and entrepreneurship.',
    images: {
      logo: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Stanford',
      campus: ['https://via.placeholder.com/400x300/764ba2/ffffff?text=Stanford+Campus']
    },
    contact: {
      email: 'admissions@stanford.edu',
      phone: '+1-650-723-2300',
      address: '450 Serra Mall, Stanford, CA 94305, USA'
    },
    statistics: {
      totalStudents: 17249,
      internationalStudents: 23,
      studentFacultyRatio: 4.8,
      graduationRate: 95,
      employmentRate: 94
    },
    facilities: [
      {
        name: 'Stanford Libraries',
        description: 'Comprehensive library system with digital resources',
        type: 'academic'
      },
      {
        name: 'Stanford Athletics',
        description: 'NCAA Division I athletic facilities',
        type: 'recreational'
      }
    ],
    admissionRequirements: {
      gpa: { min: 3.8, recommended: 4.0 },
      sat: { min: 1450, recommended: 1550 },
      toefl: { min: 100, recommended: 110 },
      documents: ['Transcripts', 'Letters of Recommendation', 'Personal Statement']
    },
    scholarships: [
      {
        name: 'Stanford Knight-Hennessy Scholars',
        amount: 75000,
        type: 'merit',
        eligibility: ['Exceptional leadership', 'Academic excellence'],
        description: 'Full funding for graduate studies',
        deadline: new Date('2024-10-15')
      }
    ],
    tags: ['business', 'engineering', 'entrepreneurship', 'silicon-valley', 'prestigious'],
    isActive: true,
    featured: true,
    verified: true
  },
  {
    name: 'Harvard University',
    location: {
      country: 'USA',
      city: 'Cambridge',
      state: 'Massachusetts',
      coordinates: { latitude: 42.3744, longitude: -71.1169 }
    },
    ranking: { global: 3, national: 3 },
    acceptanceRate: 4.6,
    tuition: {
      domestic: { undergraduate: 54000, graduate: 57000 },
      international: { undergraduate: 54000, graduate: 57000 },
      currency: 'USD'
    },
    programs: [
      {
        name: 'Economics',
        level: 'undergraduate',
        department: 'Faculty of Arts and Sciences',
        duration: '4 years',
        tuition: 54000,
        requirements: ['SAT/ACT', 'High School Diploma', 'Strong Math Background'],
        description: 'World-class economics program with focus on policy and research.'
      },
      {
        name: 'Law',
        level: 'graduate',
        department: 'Harvard Law School',
        duration: '3 years',
        tuition: 57000,
        requirements: ['LSAT', 'Bachelor\'s Degree', 'Personal Statement'],
        description: 'Prestigious law program with global impact.'
      }
    ],
    website: 'https://harvard.edu',
    description: 'Ivy League institution known for academic excellence, research, and producing world leaders.',
    images: {
      logo: 'https://via.placeholder.com/300x200/crimson/ffffff?text=Harvard',
      campus: ['https://via.placeholder.com/400x300/crimson/ffffff?text=Harvard+Campus']
    },
    contact: {
      email: 'admissions@harvard.edu',
      phone: '+1-617-495-1000',
      address: 'Cambridge, MA 02138, USA'
    },
    statistics: {
      totalStudents: 31266,
      internationalStudents: 25,
      studentFacultyRatio: 7.0,
      graduationRate: 97,
      employmentRate: 96
    },
    facilities: [
      {
        name: 'Harvard Libraries',
        description: 'Largest academic library system in the world',
        type: 'academic'
      },
      {
        name: 'Harvard Athletics',
        description: 'Ivy League athletic facilities',
        type: 'recreational'
      }
    ],
    admissionRequirements: {
      gpa: { min: 3.8, recommended: 4.0 },
      sat: { min: 1450, recommended: 1550 },
      toefl: { min: 100, recommended: 110 },
      documents: ['Transcripts', 'Letters of Recommendation', 'Personal Statement']
    },
    scholarships: [
      {
        name: 'Harvard Financial Aid',
        amount: 50000,
        type: 'need',
        eligibility: ['Demonstrated financial need', 'Academic merit'],
        description: 'Need-based financial aid program',
        deadline: new Date('2024-02-01')
      }
    ],
    tags: ['ivy-league', 'prestigious', 'research', 'liberal-arts', 'law'],
    isActive: true,
    featured: true,
    verified: true
  }
];

const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await University.deleteMany({});
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    
    logger.info('🗑️  Cleared existing data');
    
    // Seed universities
    const createdUniversities = await University.insertMany(universities);
    logger.info(`✅ Seeded ${createdUniversities.length} universities`);
    
    // Create a test user
    const testUser = new User({
      name: 'Test Student',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
      isVerified: true,
      profile: {
        academicLevel: 'high_school',
        interests: ['Computer Science', 'Engineering'],
        careerGoals: ['Software Engineer', 'AI Researcher'],
        preferredCountries: ['USA', 'Canada'],
        budget: { min: 20000, max: 60000, currency: 'USD' }
      }
    });
    
    await testUser.save();
    logger.info('✅ Created test user: test@example.com / password123');
    
    // Create student profile for test user
    const studentProfile = new StudentProfile({
      userId: testUser._id,
      academicBackground: {
        currentLevel: 'high_school',
        currentInstitution: 'Test High School',
        gpa: 3.8
      },
      interests: {
        academic: ['Computer Science', 'Mathematics', 'Physics'],
        extracurricular: ['Coding', 'Robotics', 'Debate'],
        hobbies: ['Reading', 'Gaming', 'Travel'],
        career: ['Software Development', 'AI Research']
      },
      careerGoals: {
        shortTerm: ['Get into top university', 'Learn programming'],
        longTerm: ['Become software engineer', 'Work in AI field'],
        dreamCompanies: ['Google', 'Microsoft', 'Apple'],
        preferredIndustries: ['Technology', 'AI', 'Software']
      },
      preferences: {
        studyAbroad: true,
        preferredCountries: ['USA', 'Canada', 'UK'],
        preferredCities: ['San Francisco', 'New York', 'Toronto'],
        climate: 'temperate',
        campusSize: 'medium',
        universityType: 'any'
      },
      financial: {
        budget: { min: 20000, max: 60000, currency: 'USD' },
        needScholarship: true,
        scholarshipTypes: ['merit', 'need', 'academic']
      },
      isComplete: true
    });
    
    await studentProfile.save();
    logger.info('✅ Created student profile for test user');
    
    logger.info('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
