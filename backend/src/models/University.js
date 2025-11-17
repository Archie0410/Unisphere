import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true,
    unique: true
  },
  location: {
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  ranking: {
    global: Number,
    national: Number,
    regional: Number
  },
  acceptanceRate: {
    type: Number,
    min: 0,
    max: 100
  },
  tuition: {
    domestic: {
      undergraduate: Number,
      graduate: Number
    },
    international: {
      undergraduate: Number,
      graduate: Number
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  programs: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['undergraduate', 'graduate', 'phd', 'certificate'],
      required: true
    },
    department: String,
    duration: String,
    tuition: Number,
    requirements: [String],
    description: String
  }],
  website: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  images: {
    logo: String,
    campus: [String],
    facilities: [String]
  },
  contact: {
    email: String,
    phone: String,
    address: String
  },
  statistics: {
    totalStudents: Number,
    internationalStudents: Number,
    studentFacultyRatio: Number,
    graduationRate: Number,
    employmentRate: Number
  },
  facilities: [{
    name: String,
    description: String,
    type: {
      type: String,
      enum: ['academic', 'recreational', 'housing', 'dining', 'transportation']
    }
  }],
  admissionRequirements: {
    gpa: {
      min: Number,
      recommended: Number
    },
    sat: {
      min: Number,
      recommended: Number
    },
    act: {
      min: Number,
      recommended: Number
    },
    toefl: {
      min: Number,
      recommended: Number
    },
    ielts: {
      min: Number,
      recommended: Number
    },
    documents: [String],
    deadlines: {
      early: Date,
      regular: Date,
      rolling: Boolean
    }
  },
  scholarships: [{
    name: String,
    amount: Number,
    type: {
      type: String,
      enum: ['merit', 'need', 'athletic', 'academic', 'international']
    },
    eligibility: [String],
    description: String,
    deadline: Date
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full location
universitySchema.virtual('fullLocation').get(function() {
  const { city, state, country } = this.location;
  return state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
});

// Virtual for average tuition
universitySchema.virtual('averageTuition').get(function() {
  const { domestic, international } = this.tuition;
  if (!domestic && !international) return null;
  
  const domesticAvg = domestic ? (domestic.undergraduate + domestic.graduate) / 2 : 0;
  const internationalAvg = international ? (international.undergraduate + international.graduate) / 2 : 0;
  
  return {
    domestic: domesticAvg,
    international: internationalAvg
  };
});

// Indexes for better query performance
universitySchema.index({ name: 'text', description: 'text' });
universitySchema.index({ 'location.country': 1 });
universitySchema.index({ 'location.city': 1 });
universitySchema.index({ ranking: 1 });
universitySchema.index({ acceptanceRate: 1 });
universitySchema.index({ 'programs.name': 1 });
universitySchema.index({ tags: 1 });
universitySchema.index({ featured: 1 });
universitySchema.index({ isActive: 1 });

// Static method to find universities by location
universitySchema.statics.findByLocation = function(country, city = null) {
  const query = { 'location.country': country };
  if (city) query['location.city'] = city;
  return this.find(query);
};

// Static method to find universities by program
universitySchema.statics.findByProgram = function(programName) {
  return this.find({
    'programs.name': { $regex: programName, $options: 'i' }
  });
};

// Static method to find universities by budget
universitySchema.statics.findByBudget = function(maxBudget, studentType = 'international') {
  const tuitionField = `tuition.${studentType}.undergraduate`;
  return this.find({
    [tuitionField]: { $lte: maxBudget }
  });
};

// Static method to find top ranked universities
universitySchema.statics.findTopRanked = function(limit = 10) {
  return this.find({ 'ranking.global': { $exists: true } })
    .sort({ 'ranking.global': 1 })
    .limit(limit);
};

// Static method to search universities
universitySchema.statics.search = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { 'location.city': { $regex: query, $options: 'i' } },
      { 'location.country': { $regex: query, $options: 'i' } },
      { 'programs.name': { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  });
};

const University = mongoose.model('University', universitySchema);

export default University;
