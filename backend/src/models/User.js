import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  superheroName: {
    type: String,
    required: true,
    trim: true
  },
  powerLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Legendary'],
    default: 'Beginner'
  },
  avatar: {
    type: String,
    default: '🦸‍♂️'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  achievements: {
    type: [String],
    default: []
  },
  stats: {
    universitiesExplored: { type: Number, default: 0 },
    roadmapsCreated: { type: Number, default: 0 },
    careerQuestions: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 }
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  academicProfile: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      grade12: {
        board: '',
        stream: '',
        percentage: 0,
        year: ''
      },
      entranceExams: [],
      preferredFields: [],
      budget: {
        min: 0,
        max: 0,
        currency: 'INR'
      },
      location: {
        preferredCities: [],
        preferredStates: [],
        country: 'India'
      }
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to set default values
userSchema.pre('save', function(next) {
  if (!this.superheroName) {
    const prefixes = ["Captain", "Super", "Ultra", "Mega", "Power", "Star", "Lightning", "Thunder"];
    const suffixes = ["Hero", "Warrior", "Guardian", "Protector", "Champion", "Legend", "Force", "Storm"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    this.superheroName = `${prefix} ${suffix}`;
  }
  if (!this.avatar) {
    this.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.email}`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
