/**
 * This file provides a mock MongoDB client for Edge API routes and development
 * to work around the limitation that Edge runtime doesn't support Node.js crypto module
 */

// Mock MongoDB client for Edge runtime
export class MockMongoClient {
  private connected = false;
  private mockCollections: Record<string, any[]> = {
    users: [],
    issues: [],
    communities: [],
    proposals: [],
    votes: [],
    redemptionCodes: [
      { code: 'CIVIC2023', points: 50, used: false },
      { code: 'COMMUNITY', points: 25, used: false },
      { code: 'BUILDER', points: 75, used: false },
      { code: 'PARTICIPATE', points: 30, used: false },
      { code: 'GOVERNANCE', points: 40, used: false },
    ]
  };

  async connect() {
    this.connected = true;
    return this;
  }

  db(name?: string) {
    return {
      collection: (collectionName: string) => {
        // Create the collection if it doesn't exist
        if (!this.mockCollections[collectionName]) {
          this.mockCollections[collectionName] = [];
        }

        return {
          find: (query = {}) => ({
            toArray: async () => {
              // Simple mock implementation - just returns all documents for now
              return this.mockCollections[collectionName] || [];
            }
          }),
          findOne: async (query = {}) => {
            // Simple implementation - returns first document
            return this.mockCollections[collectionName]?.[0] || null;
          },
          insertOne: async (doc: any) => {
            const id = Math.random().toString(36).substring(2, 9);
            const docWithId = { _id: id, ...doc };
            this.mockCollections[collectionName].push(docWithId);
            return { insertedId: id, acknowledged: true };
          },
          updateOne: async (filter: any, update: any) => {
            return { matchedCount: 1, modifiedCount: 1, acknowledged: true };
          },
          deleteOne: async (filter: any) => {
            return { deletedCount: 1, acknowledged: true };
          },
          command: async (cmd: any) => {
            // Handle ping command for health checks
            if (cmd.ping === 1) {
              return { ok: 1 };
            }
            return { ok: 1 };
          },
        };
      },
      command: async (cmd: any) => {
        // Handle ping command for health checks
        if (cmd.ping === 1) {
          return { ok: 1 };
        }
        return { ok: 1 };
      },
    };
  }

  isConnected() {
    return this.connected;
  }

  close() {
    this.connected = false;
    return Promise.resolve();
  }
}

// Create a mock client for development and Edge runtime
const mockClient = new MockMongoClient();
const mockClientPromise = Promise.resolve(mockClient);

export default mockClientPromise; 