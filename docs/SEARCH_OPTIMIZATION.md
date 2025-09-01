# TourPlan Search Optimization

## Overview
This document describes the performance optimizations implemented for the TourPlan search API to improve response times and reduce server load.

## Key Improvements

### 1. **In-Memory Caching** (`lib/tourplan/cache.ts`)
- 5-minute TTL for search results
- 10-minute TTL for product details
- LRU eviction when cache exceeds 500 entries
- Automatic cleanup of expired entries

### 2. **Parallel Processing** 
- Batch fetching of product details (3 concurrent requests max)
- Reduced sequential API calls
- Smart rate limiting protection

### 3. **Production Logging** (`lib/tourplan/logger.ts`)
- Debug logs only in development
- Error/warning logs in production
- Performance timing helpers

### 4. **Centralized Configuration** (`lib/tourplan/config.ts`)
- Feature flags for easy enable/disable
- Performance tuning parameters
- Environment-based settings

### 5. **Optimized Search Route** (`app/api/tourplan/search-fast/route.ts`)
- Cache-first approach
- Response time tracking
- Minimal data fetching

## Performance Gains

Expected improvements:
- **First search**: Same speed (no cache)
- **Repeat searches**: 80-95% faster (cache hit)
- **Product browsing**: 60-70% faster (cached details)
- **Server load**: 50-70% reduction in API calls

## Usage

### Test Performance
```bash
node test-search-performance.js
```

### Enable Optimized Search
```bash
node scripts/enable-fast-search.js enable
```

### Disable Optimized Search
```bash
node scripts/enable-fast-search.js disable
```

### Check Cache Stats
```bash
curl http://localhost:3008/api/tourplan/search-fast?stats=true
```

## Configuration

### Environment Variables
```env
# Enable debug logging
TOURPLAN_DEBUG=true

# Enable request logging
TOURPLAN_LOG_REQUESTS=true

# Enable performance metrics
TOURPLAN_LOG_PERFORMANCE=true
```

### Tuning Parameters
Edit `lib/tourplan/config.ts`:
```javascript
performance: {
  enableCache: true,           // Enable/disable caching
  maxConcurrentRequests: 3,    // Parallel request limit
  requestTimeout: 15000,        // Request timeout in ms
  cacheTTL: {
    search: 5 * 60 * 1000,     // Search cache duration
    product: 10 * 60 * 1000,   // Product cache duration
  }
}
```

## Monitoring

### Key Metrics to Watch
- Response time (should be <2s for cached, <5s for uncached)
- Cache hit ratio (target >60% after warmup)
- API error rate (should be <1%)
- Memory usage (cache is limited to prevent bloat)

### Debug Endpoints
- `/api/tourplan/search-fast?stats=true` - Cache statistics
- Check browser DevTools Network tab for `_performance` data in responses

## Rollback Plan

If issues occur:
1. Disable optimized search: `node scripts/enable-fast-search.js disable`
2. Clear cache by restarting the server
3. Monitor logs for errors

## Next Steps

Future optimizations to consider:
1. Redis cache for multi-instance deployments
2. Edge caching with Vercel
3. Database caching for frequently accessed products
4. Pre-warming cache for popular searches
5. GraphQL API for selective field fetching