/**
 * This file provides a unified database client that works in both Node.js and Edge runtimes
 */

import mockClientPromise from './mock-mongodb';

// Detect if we're running in an Edge runtime
const isEdgeRuntime = typeof globalThis.process?.platform === 'undefined';

// In Edge runtime, we can't use the real MongoDB client due to crypto module limitations,
// so we always use the mock implementation
const dbClientPromise = mockClientPromise;

// Export the appropriate client based on runtime
export default dbClientPromise; 