import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/app/lib/db';

// GET handler to fetch a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getProjectById(params.id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PATCH handler to update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // Check if project exists
    const project = await getProjectById(params.id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Update the project with new data
    const updatedProject = {
      ...data,
      updatedAt: new Date()
    };
    
    await updateProject(params.id, updatedProject);
    
    return NextResponse.json(
      { success: true, message: 'Project updated successfully' }
    );
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if project exists
    const project = await getProjectById(params.id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    await deleteProject(params.id);
    
    return NextResponse.json(
      { success: true, message: 'Project deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 