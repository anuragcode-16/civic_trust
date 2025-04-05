import clientPromise from './mongodb';

// Collection names
const EVENTS_COLLECTION = 'events';
const PROJECTS_COLLECTION = 'projects';
const ISSUES_COLLECTION = 'issues';
const USERS_COLLECTION = 'users';

// Database name
const DB_NAME = 'civic-trust';

// Generic function to get a collection
export async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(collectionName);
}

// Events CRUD operations
export async function getEvents() {
  const collection = await getCollection(EVENTS_COLLECTION);
  return collection.find({}).sort({ date: -1 }).toArray();
}

export async function getEventById(id: string) {
  const collection = await getCollection(EVENTS_COLLECTION);
  return collection.findOne({ _id: id });
}

export async function createEvent(event: any) {
  const collection = await getCollection(EVENTS_COLLECTION);
  return collection.insertOne(event);
}

export async function updateEvent(id: string, event: any) {
  const collection = await getCollection(EVENTS_COLLECTION);
  return collection.updateOne({ _id: id }, { $set: event });
}

export async function deleteEvent(id: string) {
  const collection = await getCollection(EVENTS_COLLECTION);
  return collection.deleteOne({ _id: id });
}

// Projects CRUD operations
export async function getProjects() {
  const collection = await getCollection(PROJECTS_COLLECTION);
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}

export async function getProjectById(id: string) {
  const collection = await getCollection(PROJECTS_COLLECTION);
  return collection.findOne({ _id: id });
}

export async function createProject(project: any) {
  const collection = await getCollection(PROJECTS_COLLECTION);
  return collection.insertOne(project);
}

export async function updateProject(id: string, project: any) {
  const collection = await getCollection(PROJECTS_COLLECTION);
  return collection.updateOne({ _id: id }, { $set: project });
}

export async function deleteProject(id: string) {
  const collection = await getCollection(PROJECTS_COLLECTION);
  return collection.deleteOne({ _id: id });
}

// Issues CRUD operations
export async function getIssues() {
  const collection = await getCollection(ISSUES_COLLECTION);
  return collection.find({}).sort({ createdAt: -1 }).toArray();
}

export async function getIssueById(id: string) {
  const collection = await getCollection(ISSUES_COLLECTION);
  return collection.findOne({ _id: id });
}

export async function createIssue(issue: any) {
  const collection = await getCollection(ISSUES_COLLECTION);
  return collection.insertOne(issue);
}

export async function updateIssue(id: string, issue: any) {
  const collection = await getCollection(ISSUES_COLLECTION);
  return collection.updateOne({ _id: id }, { $set: issue });
}

export async function deleteIssue(id: string) {
  const collection = await getCollection(ISSUES_COLLECTION);
  return collection.deleteOne({ _id: id });
}

// User operations
export async function getUserByEmail(email: string) {
  const collection = await getCollection(USERS_COLLECTION);
  return collection.findOne({ email });
}

export async function createUser(user: any) {
  const collection = await getCollection(USERS_COLLECTION);
  return collection.insertOne(user);
}

// Get nearby events based on location coordinates
export async function getNearbyEvents(lat: number, lng: number, maxDistance: number = 10000) {
  const collection = await getCollection(EVENTS_COLLECTION);
  
  return collection.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: maxDistance
      }
    }
  }).toArray();
}

// Get statistics for dashboard
export async function getStatistics() {
  const eventsCollection = await getCollection(EVENTS_COLLECTION);
  const projectsCollection = await getCollection(PROJECTS_COLLECTION);
  const issuesCollection = await getCollection(ISSUES_COLLECTION);
  const usersCollection = await getCollection(USERS_COLLECTION);
  
  const totalEvents = await eventsCollection.countDocuments();
  const totalProjects = await projectsCollection.countDocuments();
  const totalIssues = await issuesCollection.countDocuments();
  const totalUsers = await usersCollection.countDocuments();
  
  const resolvedIssues = await issuesCollection.countDocuments({ status: 'Resolved' });
  const activeProjects = await projectsCollection.countDocuments({ status: 'Active' });
  
  return {
    totalEvents,
    totalProjects,
    totalIssues,
    totalUsers,
    resolvedIssues,
    activeProjects,
    issueResolutionRate: totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0
  };
} 