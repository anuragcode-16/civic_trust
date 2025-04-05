import { getCollection } from './db';

/**
 * Creates all required indexes for the CivicChain database collections
 */
export async function createIndexes() {
  try {
    console.log('Setting up database indexes...');
    
    // Create indexes for events collection
    const eventsCollection = await getCollection('events');
    await eventsCollection.createIndex({ title: 'text', description: 'text' });
    await eventsCollection.createIndex({ date: 1 });
    await eventsCollection.createIndex({ location: '2dsphere' });
    
    // Create indexes for projects collection
    const projectsCollection = await getCollection('projects');
    await projectsCollection.createIndex({ title: 'text', description: 'text' });
    await projectsCollection.createIndex({ createdAt: -1 });
    await projectsCollection.createIndex({ status: 1 });
    await projectsCollection.createIndex({ location: '2dsphere' });
    
    // Create indexes for issues collection
    const issuesCollection = await getCollection('issues');
    await issuesCollection.createIndex({ title: 'text', description: 'text' });
    await issuesCollection.createIndex({ createdAt: -1 });
    await issuesCollection.createIndex({ status: 1 });
    await issuesCollection.createIndex({ priority: 1 });
    await issuesCollection.createIndex({ location: '2dsphere' });
    
    // Create indexes for users collection
    const usersCollection = await getCollection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ name: 'text' });
    await usersCollection.createIndex({ location: '2dsphere' });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating database indexes:', error);
    throw error;
  }
}

/**
 * Helper function to create a GeoJSON point
 */
export function createGeoPoint(lng: number, lat: number) {
  return {
    type: 'Point',
    coordinates: [lng, lat]
  };
}

/**
 * Setup indexes on application startup
 * This function can be called from a serverless function or during app initialization
 */
export async function setupDatabase() {
  try {
    await createIndexes();
    return { success: true, message: 'Database setup completed successfully' };
  } catch (error) {
    console.error('Database setup failed:', error);
    return { success: false, error: 'Database setup failed' };
  }
} 