import { NextRequest, NextResponse } from 'next/server';
import { getIssues, createIssue } from '@/app/lib/db';
import clientPromise from '../../lib/mongodb';

// Use Node.js runtime instead of Edge to avoid compatibility issues
export const runtime = 'nodejs';

// GET handler to fetch all issues
export async function GET(request: Request) {
  try {
    // Get coordinates from URL parameters
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat') || '37.7749');
    const lng = parseFloat(url.searchParams.get('lng') || '-122.4194');
    
    // Generate issues based on location
    const issues = generateIssues(lat, lng);
    
    // Simulate API delay (300-600ms)
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
    
    return NextResponse.json({ 
      success: true, 
      issues,
      meta: {
        location: { lat, lng },
        count: issues.length,
        generated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating civic issues:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve civic issues',
        issues: []
      },
      { status: 500 }
    );
  }
}

function generateIssues(lat: number, lng: number) {
  // Create a deterministic but location-specific seed
  const locationSeed = Math.abs(Math.sin(lat * lng) * 10000);
  
  // Categories and their issue types
  const categories = {
    'Infrastructure': ['Pothole', 'Broken Sidewalk', 'Street Light Out', 'Water Leak', 'Fallen Tree', 'Damaged Road Sign', 'Uneven Pavement'],
    'Safety': ['Dangerous Intersection', 'Missing Street Sign', 'Abandoned Vehicle', 'Blocked Fire Hydrant', 'Traffic Signal Malfunction', 'Speeding Concern'],
    'Environment': ['Illegal Dumping', 'Park Cleanup', 'Graffiti', 'Overgrown Vegetation', 'Water Pollution', 'Air Quality Concern'],
    'Vandalism': ['Damaged Public Property', 'Broken Bench', 'Vandalized Bus Stop', 'Defaced Sign', 'Broken Window', 'Fence Damage']
  };
  
  // Street names to use for issue locations
  const streets = ['Main St', 'Oak Ave', 'Park Rd', 'Center Blvd', 'Pine St', 'Maple Dr', 'Washington Ave', 'Cedar Ln', 'Elm St', 'River Rd'];
  
  // Create 5-8 random issues around the location
  const numIssues = 5 + Math.floor(locationSeed % 4);
  const issues = [];
  
  for (let i = 0; i < numIssues; i++) {
    // Create a deterministic but varied seed for this issue
    const issueSeed = locationSeed + (i * 123456);
    
    // Random offset from user location (within ~1km)
    const latOffset = ((issueSeed % 200) - 100) / 10000;
    const lngOffset = ((issueSeed % 300) - 150) / 10000;
    
    // Pick random category
    const categoryKeys = Object.keys(categories);
    const category = categoryKeys[Math.floor((issueSeed % 100) / (100 / categoryKeys.length))];
    
    // Pick issue type from the category
    const issueTypes = categories[category as keyof typeof categories];
    const issueType = issueTypes[Math.floor((issueSeed % 1000) / (1000 / issueTypes.length))];
    
    // Generate a date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor((issueSeed % 300) / 10));
    
    // Pick a street from the list
    const street = streets[Math.floor((issueSeed % 1000) / (1000 / streets.length))];
    
    // Generate a street number
    const streetNumber = 100 + Math.floor(issueSeed % 900);
    
    // Determine status (weighted toward "Open")
    const statusOptions = ['Open', 'In Progress', 'Resolved'];
    const statusIndex = Math.floor((issueSeed % 100) / (100 / (statusOptions.length + 2))) % statusOptions.length;
    const status = statusOptions[statusIndex];
    
    // Generate votes (1-25)
    const votes = 1 + Math.floor((issueSeed % 250) / 10);
    
    // Generate creator names
    const creators = ['Alex Smith', 'Jamie Lee', 'Taylor Jones', 'Casey Kim', 'Morgan Wells', 'Jordan Rivera', 'Quinn Patterson'];
    const creator = creators[Math.floor((issueSeed % 700) / (700 / creators.length))];
    
    // Generate description
    const descriptions = [
      `Local residents reported this ${category.toLowerCase()} issue that needs attention.`,
      `This ${issueType.toLowerCase()} is causing problems for residents in the area.`,
      `Community members are concerned about this ${category.toLowerCase()} issue.`,
      `Several complaints have been received about this ${issueType.toLowerCase()}.`,
      `This ${category.toLowerCase()} issue was reported by multiple residents recently.`
    ];
    const description = descriptions[Math.floor((issueSeed % 500) / (500 / descriptions.length))];
    
    // Create the issue object
    issues.push({
      id: `issue-${i + 1}-${Math.floor(issueSeed % 10000)}`,
      title: `${issueType} on ${street}`,
      description,
      category,
      status,
      location: {
        address: `${streetNumber} ${street}`,
        coordinates: [lng + lngOffset, lat + latOffset]
      },
      votes,
      comments: Math.floor((issueSeed % 150) / 10),
      createdBy: creator,
      createdAt: date.toISOString(),
      impactScore: 30 + Math.floor((issueSeed % 700) / 10),
      contributions: Math.floor((issueSeed % 200) / 10)
    });
  }
  
  return issues;
}

// POST handler to create a new issue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.category || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("civicchain");
    
    // Add timestamps
    const timestamp = new Date().toISOString();
    const issue = {
      ...body,
      id: `issue-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: body.status || 'Open',
      votes: body.votes || 0,
      comments: body.comments || 0,
      impactScore: body.impactScore || 50,
      contributions: body.contributions || 0,
    };
    
    // Save to DB
    const result = await db.collection("issues").insertOne(issue);
    
    return NextResponse.json({
      success: true,
      issue: { ...issue, _id: result.insertedId }
    });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 