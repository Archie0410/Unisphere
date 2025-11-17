// Jest setup file to define University mock before tests run
// This simulates the database being available but returning empty results
// which triggers the mock data fallback in the service

global.University = {
  find: jest.fn(() => Promise.resolve([])),
  findById: jest.fn(() => Promise.resolve(null)),
  aggregate: jest.fn(() => Promise.resolve([])),
};



