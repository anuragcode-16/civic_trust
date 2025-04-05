import { NextRequest, NextResponse } from 'next/server';
import { getIssueById, updateIssue, deleteIssue } from '@/app/lib/db';

// GET handler to fetch a specific issue
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const issue = await getIssueById(params.id);
    
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(issue);
  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issue' },
      { status: 500 }
    );
  }
}

// PATCH handler to update an issue
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // Check if issue exists
    const issue = await getIssueById(params.id);
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }
    
    // Update the issue with new data
    const updatedIssue = {
      ...data,
      updatedAt: new Date()
    };
    
    await updateIssue(params.id, updatedIssue);
    
    return NextResponse.json(
      { success: true, message: 'Issue updated successfully' }
    );
  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json(
      { error: 'Failed to update issue' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove an issue
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if issue exists
    const issue = await getIssueById(params.id);
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }
    
    await deleteIssue(params.id);
    
    return NextResponse.json(
      { success: true, message: 'Issue deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json(
      { error: 'Failed to delete issue' },
      { status: 500 }
    );
  }
} 