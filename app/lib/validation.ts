// Validation Types
export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

// Project Validation
export interface ProjectData {
  title: string;
  description: string;
  category?: string;
  location?: string;
  budget?: number;
  timeline?: string;
  status?: 'Pending' | 'Active' | 'Completed' | 'Cancelled';
}

export function validateProject(data: Partial<ProjectData>): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Title validation
  if (!data.title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (data.title.length < 5) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters long' });
  } else if (data.title.length > 100) {
    errors.push({ field: 'title', message: 'Title must be less than 100 characters' });
  }
  
  // Description validation
  if (!data.description) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (data.description.length < 20) {
    errors.push({ field: 'description', message: 'Description must be at least 20 characters long' });
  }
  
  // Budget validation (if provided)
  if (data.budget !== undefined && data.budget < 0) {
    errors.push({ field: 'budget', message: 'Budget must be a positive number' });
  }
  
  // Status validation (if provided)
  if (data.status && !['Pending', 'Active', 'Completed', 'Cancelled'].includes(data.status)) {
    errors.push({ field: 'status', message: 'Invalid status value' });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Issue Validation
export interface IssueData {
  title: string;
  description: string;
  category?: string;
  location?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  status?: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
}

export function validateIssue(data: Partial<IssueData>): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Title validation
  if (!data.title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (data.title.length < 5) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters long' });
  } else if (data.title.length > 100) {
    errors.push({ field: 'title', message: 'Title must be less than 100 characters' });
  }
  
  // Description validation
  if (!data.description) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (data.description.length < 20) {
    errors.push({ field: 'description', message: 'Description must be at least 20 characters long' });
  }
  
  // Priority validation (if provided)
  if (data.priority && !['Low', 'Medium', 'High', 'Critical'].includes(data.priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority value' });
  }
  
  // Status validation (if provided)
  if (data.status && !['Open', 'In Progress', 'Resolved', 'Closed'].includes(data.status)) {
    errors.push({ field: 'status', message: 'Invalid status value' });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Helper function to sanitize input
export function sanitizeInput(input: string): string {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script tags and content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

// Helper function to validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to validate coordinates
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
} 