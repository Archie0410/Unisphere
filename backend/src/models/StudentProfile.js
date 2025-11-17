import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  academicBackground: {
    currentLevel: {
      type: String,
      enum: ['high_school', 'undergraduate', 'graduate', 'professional'],
      required: true
    },
    currentInstitution: String,
    gpa: {
      type: Number,
      min: 0,
      max: 4.0
    },
    satScore: {
      total: Number,
      math: Number,
      reading: Number,
      writing: Number
    },
    actScore: {
      composite: Number,
      math: Number,
      english: Number,
      reading: Number,
      science: Number
    },
    toeflScore: Number,
    ieltsScore: Number,
    greScore: {
      verbal: Number,
      quantitative: Number,
      analytical: Number
    },
    gmatScore: Number,
    academicAchievements: [String],
    researchExperience: [{
      title: String,
      description: String,
      duration: String,
      outcomes: [String]
    }],
    publications: [{
      title: String,
      journal: String,
      year: Number,
      url: String
    }]
  },
  interests: {
    academic: [String],
    extracurricular: [String],
    hobbies: [String],
    career: [String]
  },
  careerGoals: {
    shortTerm: [String],
    longTerm: [String],
    dreamCompanies: [String],
    preferredIndustries: [String],
    salaryExpectations: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    }
  },
  preferences: {
    studyAbroad: {
      type: Boolean,
      default: false
    },
    preferredCountries: [String],
    preferredCities: [String],
    climate: {
      type: String,
      enum: ['tropical', 'temperate', 'cold', 'any']
    },
    campusSize: {
      type: String,
      enum: ['small', 'medium', 'large', 'any']
    },
    universityType: {
      type: String,
      enum: ['public', 'private', 'any']
    },
    programDuration: {
      type: String,
      enum: ['2_years', '4_years', 'flexible', 'any']
    },
    classSize: {
      type: String,
      enum: ['small', 'medium', 'large', 'any']
    }
  },
  financial: {
    budget: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    needScholarship: {
      type: Boolean,
      default: false
    },
    scholarshipTypes: [{
      type: String,
      enum: ['merit', 'need', 'athletic', 'academic', 'international', 'research']
    }],
    workStudy: {
      type: Boolean,
      default: false
    },
    partTimeWork: {
      type: Boolean,
      default: false
    }
  },
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'native']
    },
    certified: Boolean
  }],
  skills: {
    technical: [String],
    soft: [String],
    languages: [String],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      expiry: Date,
      url: String
    }]
  },
  workExperience: [{
    company: String,
    position: String,
    duration: String,
    description: String,
    achievements: [String],
    skills: [String]
  }],
  extracurricular: [{
    organization: String,
    role: String,
    duration: String,
    description: String,
    achievements: [String]
  }],
  recommendations: [{
    name: String,
    title: String,
    institution: String,
    email: String,
    relationship: String,
    strength: String
  }],
  applications: [{
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University'
    },
    program: String,
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted'],
      default: 'draft'
    },
    applicationDate: Date,
    decisionDate: Date,
    notes: String
  }],
  savedUniversities: [{
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University'
    },
    savedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  roadmap: {
    currentStep: {
      type: String,
      enum: ['profile_complete', 'researching', 'applying', 'deciding', 'enrolled'],
      default: 'profile_complete'
    },
    timeline: {
      targetYear: Number,
      targetSemester: {
        type: String,
        enum: ['fall', 'spring', 'summer']
      }
    },
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }]
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for profile completion percentage
studentProfileSchema.virtual('completionPercentage').get(function() {
  const fields = [
    'academicBackground.currentLevel',
    'interests.academic',
    'careerGoals.longTerm',
    'preferences.preferredCountries',
    'financial.budget'
  ];
  
  let completed = 0;
  fields.forEach(field => {
    const value = this.get(field);
    if (value && (Array.isArray(value) ? value.length > 0 : true)) {
      completed++;
    }
  });
  
  return Math.round((completed / fields.length) * 100);
});

// Indexes for better query performance
studentProfileSchema.index({ 'academicBackground.currentLevel': 1 });
studentProfileSchema.index({ 'interests.academic': 1 });
studentProfileSchema.index({ 'preferences.preferredCountries': 1 });
studentProfileSchema.index({ 'financial.budget.max': 1 });
studentProfileSchema.index({ 'roadmap.currentStep': 1 });

// Static method to find profiles by academic level
studentProfileSchema.statics.findByAcademicLevel = function(level) {
  return this.find({ 'academicBackground.currentLevel': level });
};

// Static method to find profiles by interests
studentProfileSchema.statics.findByInterests = function(interests) {
  return this.find({
    'interests.academic': { $in: interests }
  });
};

// Static method to find profiles by budget range
studentProfileSchema.statics.findByBudgetRange = function(minBudget, maxBudget) {
  return this.find({
    'financial.budget.max': { $gte: minBudget, $lte: maxBudget }
  });
};

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

export default StudentProfile;
