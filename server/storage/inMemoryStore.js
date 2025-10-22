const bcrypt = require('bcryptjs');

// In-memory data stores
let users = [];
let appointments = [];
let reports = [];
let aiAnalyses = [];
let chats = [];

// Initialize with sample data
const initializeSampleData = async () => {
  // Sample users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  users = [
    {
      _id: '1',
      name: 'John Patient',
      email: 'patient@example.com',
      password: hashedPassword,
      role: 'patient',
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-15'),
      bloodGroup: 'O+',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      _id: '2',
      name: 'Dr. Sarah Smith',
      email: 'doctor@example.com',
      password: hashedPassword,
      role: 'doctor',
      phone: '+1234567891',
      specialization: 'Cardiology',
      licenseNumber: 'MD12345',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      _id: '3',
      name: 'Dr. Michael Johnson',
      email: 'doctor2@example.com',
      password: hashedPassword,
      role: 'doctor',
      phone: '+1234567892',
      specialization: 'General Medicine',
      licenseNumber: 'MD12346',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      _id: '4',
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  // Sample appointments
  appointments = [
    {
      _id: '1',
      patient: '1',
      doctor: '2',
      appointmentDate: new Date('2024-12-20'),
      appointmentTime: '10:00',
      status: 'confirmed',
      reason: 'Regular checkup',
      symptoms: 'Mild headache',
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      _id: '2',
      patient: '1',
      doctor: '3',
      appointmentDate: new Date('2024-12-25'),
      appointmentTime: '14:00',
      status: 'pending',
      reason: 'Follow-up consultation',
      createdAt: new Date('2024-12-05'),
      updatedAt: new Date('2024-12-05'),
    },
  ];

  // Sample AI analyses
  aiAnalyses = [
    {
      _id: '1',
      patient: '1',
      inputType: 'symptoms',
      userInput: 'I have been experiencing persistent headaches for the past week, along with mild nausea.',
      aiResponse: {
        possibleDiagnosis: [
          {
            condition: 'Tension Headache',
            probability: 0.7,
            description: 'Common type of headache often caused by stress or muscle tension.',
          },
          {
            condition: 'Migraine',
            probability: 0.3,
            description: 'Recurrent headaches that can cause moderate to severe pain.',
          },
        ],
        severity: 'medium',
        recommendedActions: [
          'Rest in a quiet, dark room',
          'Stay hydrated',
          'Consider over-the-counter pain relief',
          'Consult with a healthcare professional if symptoms persist',
        ],
        notes: 'Symptoms suggest possible tension headache or migraine. Monitor symptoms and seek professional advice if they worsen.',
        confidence: 75,
      },
      aiModel: 'gpt-4',
      isReviewed: false,
      createdAt: new Date('2024-12-10'),
      updatedAt: new Date('2024-12-10'),
    },
  ];

  console.log('✅ Sample data initialized in memory');
  console.log(`📋 Initialized ${users.length} users:`, users.map(u => ({ email: u.email, role: u.role, isActive: u.isActive })));
};

// Initialize on import - ensure it completes
let initializationPromise = initializeSampleData();

// Export a function to ensure data is ready
const ensureDataInitialized = async () => {
  await initializationPromise;
  return true;
};

// Helper to generate IDs
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// User operations
const userStore = {
  async findOne(query) {
    if (!query || Object.keys(query).length === 0) {
      return null;
    }
    
    const key = Object.keys(query)[0];
    const value = query[key];
    
    // For email, do case-insensitive comparison
    if (key === 'email') {
      const normalizedValue = value.toLowerCase().trim();
      const found = users.find(u => {
        if (!u || !u.email) return false;
        const userEmail = String(u.email).toLowerCase().trim();
        return userEmail === normalizedValue;
      });
      
      if (!found && process.env.NODE_ENV !== 'production') {
        console.log(`🔍 Email search: Looking for "${normalizedValue}"`);
        console.log(`📋 Available emails:`, users.map(u => u?.email || 'NO EMAIL'));
      }
      
      return found || null;
    }
    
    return users.find(u => u && u[key] === value) || null;
  },

  async findById(id) {
    return users.find(u => u._id === id) || null;
  },

  async find(query = {}) {
    let result = [...users];
    
    if (query.role) {
      result = result.filter(u => u.role === query.role);
    }
    
    if (query.isActive !== undefined) {
      result = result.filter(u => u.isActive === query.isActive);
    }
    
    if (query.$or) {
      const orConditions = query.$or;
      result = result.filter(u => 
        orConditions.some(condition => {
          const key = Object.keys(condition)[0];
          const regex = condition[key].$regex;
          const options = condition[key].$options || '';
          const pattern = new RegExp(regex, options);
          return pattern.test(u[key] || '');
        })
      );
    }
    
    return result;
  },

  async create(data) {
    const newUser = {
      _id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const index = users.findIndex(u => u._id === id);
    if (index === -1) return null;
    
    const updated = {
      ...users[index],
      ...update,
      updatedAt: new Date(),
    };
    users[index] = updated;
    return updated;
  },

  async findByIdAndDelete(id) {
    const index = users.findIndex(u => u._id === id);
    if (index === -1) return null;
    return users.splice(index, 1)[0];
  },

  async countDocuments(query = {}) {
    const filtered = await this.find(query);
    return filtered.length;
  },

  async distinct(field, query = {}) {
    const filtered = await this.find(query);
    return [...new Set(filtered.map(u => u[field]).filter(Boolean))];
  },
};

// Appointment operations
const appointmentStore = {
  async find(query = {}) {
    let result = [...appointments];
    
    if (query.patient) {
      result = result.filter(a => a.patient === query.patient);
    }
    
    if (query.doctor) {
      result = result.filter(a => a.doctor === query.doctor);
    }
    
    if (query.status) {
      result = result.filter(a => a.status === query.status);
    }
    
    if (query.appointmentDate) {
      if (query.appointmentDate.$gte) {
        result = result.filter(a => new Date(a.appointmentDate) >= new Date(query.appointmentDate.$gte));
      }
    }
    
    return result;
  },

  async findById(id) {
    return appointments.find(a => a._id === id) || null;
  },

  async create(data) {
    const newAppointment = {
      _id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    appointments.push(newAppointment);
    return newAppointment;
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const index = appointments.findIndex(a => a._id === id);
    if (index === -1) return null;
    
    const updated = {
      ...appointments[index],
      ...update,
      updatedAt: new Date(),
    };
    appointments[index] = updated;
    return updated;
  },

  async findByIdAndDelete(id) {
    const index = appointments.findIndex(a => a._id === id);
    if (index === -1) return null;
    return appointments.splice(index, 1)[0];
  },

  async countDocuments(query = {}) {
    const filtered = await this.find(query);
    return filtered.length;
  },

  async distinct(field, query = {}) {
    const filtered = await this.find(query);
    return [...new Set(filtered.map(a => a[field]).filter(Boolean))];
  },
};

// Report operations
const reportStore = {
  async find(query = {}) {
    let result = [...reports];
    
    if (query.patient) {
      result = result.filter(r => r.patient === query.patient);
    }
    
    if (query.doctor) {
      result = result.filter(r => r.doctor === query.doctor);
    }
    
    return result;
  },

  async findById(id) {
    return reports.find(r => r._id === id) || null;
  },

  async create(data) {
    const newReport = {
      _id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    reports.push(newReport);
    return newReport;
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const index = reports.findIndex(r => r._id === id);
    if (index === -1) return null;
    
    const updated = {
      ...reports[index],
      ...update,
      updatedAt: new Date(),
    };
    reports[index] = updated;
    return updated;
  },

  async findByIdAndDelete(id) {
    const index = reports.findIndex(r => r._id === id);
    if (index === -1) return null;
    return reports.splice(index, 1)[0];
  },

  async countDocuments(query = {}) {
    const filtered = await this.find(query);
    return filtered.length;
  },
};

// AI Analysis operations
const aiAnalysisStore = {
  async find(query = {}) {
    let result = [...aiAnalyses];
    
    if (query.patient) {
      result = result.filter(a => a.patient === query.patient);
    }
    
    if (query.doctor) {
      result = result.filter(a => a.doctor === query.doctor);
    }
    
    return result;
  },

  async findById(id) {
    return aiAnalyses.find(a => a._id === id) || null;
  },

  async create(data) {
    const newAnalysis = {
      _id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    aiAnalyses.push(newAnalysis);
    return newAnalysis;
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const index = aiAnalyses.findIndex(a => a._id === id);
    if (index === -1) return null;
    
    const updated = {
      ...aiAnalyses[index],
      ...update,
      updatedAt: new Date(),
    };
    aiAnalyses[index] = updated;
    return updated;
  },

  async countDocuments(query = {}) {
    const filtered = await this.find(query);
    return filtered.length;
  },
};

// Helper to populate references
const populate = async (doc, fields) => {
  if (!doc) return doc;
  
  const populated = { ...doc };
  
  for (const field of fields) {
    if (populated[field] && typeof populated[field] === 'string') {
      const user = await userStore.findById(populated[field]);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        populated[field] = userWithoutPassword;
      }
    }
  }
  
  return populated;
};

// Helper to populate array of docs
const populateMany = async (docs, fields) => {
  return Promise.all(docs.map(doc => populate(doc, fields)));
};

module.exports = {
  ensureDataInitialized,
  userStore,
  appointmentStore,
  reportStore,
  aiAnalysisStore,
  populate,
  populateMany
};

