import User from './User.js';

let models = {};

// Initialize models after database connection
export const initializeModels = (connection) => {
  // Initialize models
  if (connection) {
    models = {
      User
    };
  } else {
    // Demo mode - create mock models
    models = {
      User: createMockUserModel()
    };
  }

  return models;
};

// Create a mock User model for demo mode
const createMockUserModel = () => {
  let users = [];
  let nextId = 1;

  return {
    findOne: async ({ where }) => {
      return users.find(user => user.email === where.email) || null;
    },
    create: async (userData) => {
      const user = {
        _id: nextId++,
        ...userData,
        joinDate: new Date(),
        lastLogin: new Date(),
        achievements: userData.achievements || ['Hero Registration'],
        stats: userData.stats || {
          universitiesExplored: 0,
          roadmapsCreated: 0,
          careerQuestions: 0,
          favorites: 0
        },
        profileCompleted: false,
        academicProfile: null,
        avatar: userData.avatar || '🦸‍♂️',
        isActive: true
      };
      users.push(user);
      return user;
    },
    findById: async (id) => {
      return users.find(user => user._id === id) || null;
    },
    findByIdAndUpdate: async (id, updateData, options) => {
      const user = users.find(u => u._id === id);
      if (user) {
        Object.assign(user, updateData);
        return user;
      }
      return null;
    }
  };
};

// Get models (for routes to use)
export const getModels = () => models;

export { models };
export default models;
