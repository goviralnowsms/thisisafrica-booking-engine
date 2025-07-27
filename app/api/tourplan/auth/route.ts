import { NextRequest } from 'next/server';
import { checkTourPlanConnection, getTourPlanConfig } from '@/lib/tourplan';
import { successResponse, errorResponse, handleTourPlanError } from '../utils';

export async function GET(request: NextRequest) {
  try {
    // Use simplified connection check
    const connectionResult = await checkTourPlanConnection();
    
    if (!connectionResult.connected) {
      return errorResponse(
        'Failed to connect to TourPlan API',
        503,
        { message: connectionResult.error }
      );
    }
    
    // Get configuration for debugging
    const config = getTourPlanConfig();
    
    return successResponse({
      connected: true,
      authenticated: true,
      config: {
        endpoint: config.endpoint,
        agentId: config.agentId,
        hasPassword: config.hasPassword,
      },
    });
  } catch (error) {
    return handleTourPlanError(error);
  }
}