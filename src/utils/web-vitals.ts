/**
 * Web Vitals tracking utility for Ralph Web
 * 
 * This module provides comprehensive Core Web Vitals monitoring
 * with performance budget validation and real-time tracking.
 * 
 * @example
 * ```typescript
 * import { initWebVitals } from './web-vitals';
 * 
 * // Initialize in your main script
 * initWebVitals({
 *   enableConsoleLogging: true,
 *   enableAnalytics: true,
 *   thresholds: {
 *     CLS: 0.1,
 *     FID: 100,
 *     LCP: 2500
 *   }
 * });
 * ```
 */

export interface WebVitalsConfig {
  /** Enable console logging of metrics */
  enableConsoleLogging?: boolean;
  /** Enable analytics reporting */
  enableAnalytics?: boolean;
  /** Custom performance thresholds */
  thresholds?: {
    CLS?: number;
    FID?: number;
    LCP?: number;
    FCP?: number;
    TTFB?: number;
  };
  /** Custom analytics endpoint */
  analyticsEndpoint?: string;
  /** Debug mode for development */
  debug?: boolean;
}

export interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender';
  rating: 'good' | 'needs-improvement' | 'poor';
  attribution?: any;
}

// Default performance thresholds based on Core Web Vitals recommendations
const DEFAULT_THRESHOLDS = {
  CLS: 0.1,      // Cumulative Layout Shift
  FID: 100,      // First Input Delay (ms)
  LCP: 2500,     // Largest Contentful Paint (ms)
  FCP: 1800,     // First Contentful Paint (ms)
  TTFB: 800,     // Time to First Byte (ms)
};

/**
 * Performance budget class for tracking and validating metrics
 */
export class PerformanceBudget {
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private thresholds: typeof DEFAULT_THRESHOLDS;
  private config: WebVitalsConfig;

  constructor(config: WebVitalsConfig = {}) {
    this.config = config;
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...config.thresholds };
  }

  /**
   * Record a web vital metric
   */
  recordMetric(metric: WebVitalsMetric): void {
    this.metrics.set(metric.name, metric);
    
    if (this.config.enableConsoleLogging) {
      this.logMetric(metric);
    }

    if (this.config.enableAnalytics) {
      this.sendToAnalytics(metric);
    }

    this.validateThreshold(metric);
  }

  /**
   * Log metric to console with color coding
   */
  private logMetric(metric: WebVitalsMetric): void {
    const styles = {
      good: 'color: #0f5132; background-color: #d1e7dd; padding: 2px 4px; border-radius: 3px;',
      'needs-improvement': 'color: #664d03; background-color: #fff3cd; padding: 2px 4px; border-radius: 3px;',
      poor: 'color: #842029; background-color: #f8d7da; padding: 2px 4px; border-radius: 3px;'
    };

    console.log(
      `%c${metric.name}`,
      styles[metric.rating],
      `${metric.value}${metric.name === 'CLS' ? '' : 'ms'} (${metric.rating})`
    );

    if (this.config.debug) {
      console.log('Full metric data:', metric);
    }
  }

  /**
   * Validate metric against performance threshold
   */
  private validateThreshold(metric: WebVitalsMetric): void {
    const threshold = this.thresholds[metric.name as keyof typeof DEFAULT_THRESHOLDS];
    if (!threshold) return;

    if (metric.value > threshold) {
      console.warn(
        `⚠️ Performance Budget Exceeded: ${metric.name} (${metric.value}) > ${threshold}`
      );
      
      // Dispatch custom event for monitoring systems
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('performanceBudgetExceeded', {
          detail: { metric, threshold }
        }));
      }
    }
  }

  /**
   * Send metric to analytics endpoint
   */
  private async sendToAnalytics(metric: WebVitalsMetric): Promise<void> {
    try {
      const endpoint = this.config.analyticsEndpoint || '/api/analytics/web-vitals';
      
      // Use sendBeacon for better performance if available
      const data = JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        navigationType: metric.navigationType,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      });

      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(endpoint, data);
      } else {
        // Fallback to fetch with low priority
        fetch(endpoint, {
          method: 'POST',
          body: data,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true
        }).catch(() => {
          // Silently fail - analytics shouldn't break the app
        });
      }
    } catch (error) {
      if (this.config.debug) {
        console.warn('Failed to send analytics:', error);
      }
    }
  }

  /**
   * Get current performance summary
   */
  getSummary(): Record<string, WebVitalsMetric | undefined> {
    return {
      CLS: this.metrics.get('CLS'),
      FID: this.metrics.get('FID'),
      LCP: this.metrics.get('LCP'),
      FCP: this.metrics.get('FCP'),
      TTFB: this.metrics.get('TTFB'),
    };
  }

  /**
   * Generate performance score (0-100)
   */
  getPerformanceScore(): number {
    const metrics = this.getSummary();
    const scores: number[] = [];

    Object.entries(metrics).forEach(([name, metric]) => {
      if (metric) {
        let score = 100;
        switch (metric.rating) {
          case 'good':
            score = 100;
            break;
          case 'needs-improvement':
            score = 50;
            break;
          case 'poor':
            score = 0;
            break;
        }
        scores.push(score);
      }
    });

    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }
}

/**
 * Initialize Web Vitals tracking
 */
export async function initWebVitals(config: WebVitalsConfig = {}): Promise<PerformanceBudget> {
  const budget = new PerformanceBudget(config);

  // Dynamically import web-vitals library to avoid blocking
  try {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

    // Set up metric collection with debouncing
    const debouncedRecord = debounce((metric: WebVitalsMetric) => {
      budget.recordMetric(metric);
    }, 100);

    // Register all Core Web Vitals
    getCLS(debouncedRecord);
    getFID(debouncedRecord);
    getFCP(debouncedRecord);
    getLCP(debouncedRecord);
    getTTFB(debouncedRecord);

    if (config.enableConsoleLogging) {
      console.log('🚀 Web Vitals tracking initialized');
    }

  } catch (error) {
    if (config.debug) {
      console.warn('Web Vitals library not available:', error);
    }
  }

  return budget;
}

/**
 * Simple debounce utility
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Performance observer for additional metrics
 */
export function observePerformance(config: WebVitalsConfig = {}): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    // Observe long tasks (potential performance bottlenecks)
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          if (config.enableConsoleLogging) {
            console.warn(`🐌 Long Task detected: ${entry.duration.toFixed(2)}ms`);
          }
          
          if (config.enableAnalytics) {
            // Report long tasks to analytics
            const data = {
              type: 'long-task',
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            };
            
            if ('sendBeacon' in navigator) {
              navigator.sendBeacon('/api/analytics/performance', JSON.stringify(data));
            }
          }
        }
      });
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Observe layout shifts for debugging
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.hadRecentInput) return; // Ignore shifts caused by user interaction
        
        if (config.debug && entry.value > 0.1) {
          console.warn('📐 Significant Layout Shift detected:', {
            value: entry.value,
            sources: entry.sources?.map((source: any) => ({
              element: source.node?.tagName,
              previousRect: source.previousRect,
              currentRect: source.currentRect
            }))
          });
        }
      });
    });

    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

  } catch (error) {
    if (config.debug) {
      console.warn('Performance Observer not supported:', error);
    }
  }
}

/**
 * Monitor resource loading performance
 */
export function monitorResourceLoading(config: WebVitalsConfig = {}): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    // Analyze resource loading after page load
    setTimeout(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const analysis = {
        totalResources: resources.length,
        slowResources: resources.filter(r => r.duration > 500),
        largeResources: resources.filter(r => r.transferSize > 100 * 1024), // > 100KB
        blockedResources: resources.filter(r => r.blockedStart > 0)
      };

      if (config.enableConsoleLogging) {
        console.log('📊 Resource Loading Analysis:', analysis);
        
        if (analysis.slowResources.length > 0) {
          console.warn('🐌 Slow loading resources:', 
            analysis.slowResources.map(r => ({
              name: r.name,
              duration: `${r.duration.toFixed(2)}ms`
            }))
          );
        }
      }

      if (config.enableAnalytics && analysis.slowResources.length > 0) {
        const data = {
          type: 'resource-analysis',
          slowResources: analysis.slowResources.length,
          totalResources: analysis.totalResources,
          timestamp: Date.now()
        };
        
        if ('sendBeacon' in navigator) {
          navigator.sendBeacon('/api/analytics/resources', JSON.stringify(data));
        }
      }
    }, 2000); // Wait 2 seconds after load to capture all resources
  });
}

/**
 * Initialize comprehensive performance monitoring
 */
export function initPerformanceMonitoring(config: WebVitalsConfig = {}): Promise<PerformanceBudget> {
  // Set up all monitoring systems
  observePerformance(config);
  monitorResourceLoading(config);
  
  // Return the main Web Vitals tracking
  return initWebVitals(config);
}

// Export default configuration for easy use
export const defaultConfig: WebVitalsConfig = {
  enableConsoleLogging: true,
  enableAnalytics: false, // Disabled by default - enable in production
  debug: false,
  thresholds: DEFAULT_THRESHOLDS
};