import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '@/app/lib/db';

// GET handler to fetch all projects
export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST handler to create a new project
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }
    
    // Create project object with default values
    const project = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: data.status || 'Pending',
      votes: 0,
      participants: []
    };
    
    const result = await createProject(project);
    
    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 