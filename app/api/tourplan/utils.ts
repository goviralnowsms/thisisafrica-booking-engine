import { NextResponse } from 'next/server';
import { z } from 'zod';

// No need for client initialization - using direct service functions

// Standard error response
export function errorResponse(
  message: string,
  status: number = 400,
  error?: any
) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: error || undefined,
    },
    { status }
  );
}

// Standard success response
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

// Validate request body with Zod schema
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    return { data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: errorResponse(
          'Validation error',
          400,
          {
            ErrorCode: 'VALIDATION_ERROR',
            ErrorMessage: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
          }
        ),
      };
    }
    return {
      error: errorResponse('Invalid request body', 400),
    };
  }
}

// Common date validation
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// Room configuration schema
export const roomConfigSchema = z.object({
  Adults: z.number().int().min(1).max(9),
  Children: z.number().int().min(0).max(9).optional(),
  Infants: z.number().int().min(0).max(9).optional(),
  Type: z.enum(['SG', 'DB', 'TW', 'TR', 'QU']),
  Quantity: z.number().int().min(1).max(9),
});

// Handle TourPlan API errors
export function handleTourPlanError(error: unknown): NextResponse {
  console.error('TourPlan API error:', error);
  
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('timeout')) {
      return errorResponse('Request timeout - please try again', 504);
    }
    if (error.message.includes('Failed after')) {
      return errorResponse('Service temporarily unavailable - please try again later', 503);
    }
    return errorResponse(error.message, 500);
  }
  
  return errorResponse('An unexpected error occurred', 500);
}