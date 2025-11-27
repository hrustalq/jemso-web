/**
 * Animation Performance Utilities
 * 
 * Utilities to optimize GSAP animations and improve performance
 */

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detect if device is low-end based on performance heuristics
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check hardware concurrency (number of CPU cores)
  const cores = navigator.hardwareConcurrency ?? 0;
  if (cores > 0 && cores <= 2) return true;
  
  // Check device memory (if available)
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined && memory <= 2) return true;
  
  // Check connection (if available)
  const connection = (navigator as Navigator & { 
    connection?: { effectiveType?: string; saveData?: boolean }
  }).connection;
  if (connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g') {
    return true;
  }
  if (connection?.saveData) return true;
  
  return false;
}

/**
 * Get recommended animation quality based on device capabilities
 */
export function getAnimationQuality(): 'high' | 'medium' | 'low' | 'none' {
  if (prefersReducedMotion()) return 'none';
  if (isLowEndDevice()) return 'low';
  
  // Check if running on mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) return 'medium';
  
  return 'high';
}

/**
 * Animation Budget Manager
 * Limits the number of concurrent animations to prevent performance issues
 */
class AnimationBudgetManager {
  private activeAnimations = new Set<string>();
  private maxConcurrent: number;

  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Request permission to run an animation
   * @param id Unique identifier for the animation
   * @returns true if animation can run, false if budget exceeded
   */
  requestAnimation(id: string): boolean {
    if (this.activeAnimations.size >= this.maxConcurrent) {
      console.warn(`[Animation Budget] Budget exceeded. Active: ${this.activeAnimations.size}/${this.maxConcurrent}`);
      return false;
    }
    this.activeAnimations.add(id);
    return true;
  }

  /**
   * Release an animation slot
   * @param id Unique identifier for the animation
   */
  releaseAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }

  /**
   * Get current animation count
   */
  getActiveCount(): number {
    return this.activeAnimations.size;
  }

  /**
   * Check if budget allows more animations
   */
  hasCapacity(): boolean {
    return this.activeAnimations.size < this.maxConcurrent;
  }

  /**
   * Reset all animations
   */
  reset(): void {
    this.activeAnimations.clear();
  }

  /**
   * Update max concurrent animations
   */
  setMaxConcurrent(max: number): void {
    this.maxConcurrent = max;
  }
}

// Global instance
export const animationBudget = new AnimationBudgetManager();

// Adjust budget based on device capabilities
if (typeof window !== 'undefined') {
  const quality = getAnimationQuality();
  switch (quality) {
    case 'none':
      animationBudget.setMaxConcurrent(0);
      break;
    case 'low':
      animationBudget.setMaxConcurrent(3);
      break;
    case 'medium':
      animationBudget.setMaxConcurrent(5);
      break;
    case 'high':
      animationBudget.setMaxConcurrent(10);
      break;
  }
}

/**
 * Performance monitoring for animations
 */
export class AnimationPerformanceMonitor {
  private measurements = new Map<string, number[]>();

  /**
   * Start measuring an animation
   */
  start(id: string): void {
    if (typeof performance === 'undefined') return;
    performance.mark(`${id}-start`);
  }

  /**
   * End measuring an animation and store the duration
   */
  end(id: string): number | null {
    if (typeof performance === 'undefined') return null;
    
    performance.mark(`${id}-end`);
    
    try {
      performance.measure(id, `${id}-start`, `${id}-end`);
      const measure = performance.getEntriesByName(id).pop() as PerformanceMeasure;
      
      if (measure) {
        const durations = this.measurements.get(id) ?? [];
        durations.push(measure.duration);
        this.measurements.set(id, durations);
        
        // Clean up
        performance.clearMarks(`${id}-start`);
        performance.clearMarks(`${id}-end`);
        performance.clearMeasures(id);
        
        return measure.duration;
      }
    } catch (error) {
      console.warn(`[Animation Performance] Error measuring ${id}:`, error);
    }
    
    return null;
  }

  /**
   * Get average duration for an animation
   */
  getAverage(id: string): number | null {
    const durations = this.measurements.get(id);
    if (!durations || durations.length === 0) return null;
    
    const sum = durations.reduce((a, b) => a + b, 0);
    return sum / durations.length;
  }

  /**
   * Get all measurements for an animation
   */
  getMeasurements(id: string): number[] {
    return this.measurements.get(id) ?? [];
  }

  /**
   * Clear measurements for an animation
   */
  clear(id?: string): void {
    if (id) {
      this.measurements.delete(id);
    } else {
      this.measurements.clear();
    }
  }

  /**
   * Get performance report
   */
  getReport(): Record<string, { count: number; average: number; min: number; max: number }> {
    const report: Record<string, { count: number; average: number; min: number; max: number }> = {};
    
    this.measurements.forEach((durations, id) => {
      if (durations.length === 0) return;
      
      const sum = durations.reduce((a, b) => a + b, 0);
      report[id] = {
        count: durations.length,
        average: sum / durations.length,
        min: Math.min(...durations),
        max: Math.max(...durations),
      };
    });
    
    return report;
  }

  /**
   * Log performance report to console
   */
  logReport(): void {
    const report = this.getReport();
    console.table(report);
  }
}

// Global instance
export const animationMonitor = new AnimationPerformanceMonitor();

/**
 * Debounce function for scroll/resize handlers
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for frequent events
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if element is in viewport
 * More efficient than IntersectionObserver for one-time checks
 */
export function isInViewport(element: Element, threshold = 0): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = (rect.top <= windowHeight * (1 - threshold)) && ((rect.top + rect.height) >= windowHeight * threshold);
  const horInView = (rect.left <= windowWidth * (1 - threshold)) && ((rect.left + rect.width) >= windowWidth * threshold);
  
  return vertInView && horInView;
}

/**
 * Create an optimized IntersectionObserver with default options
 */
export function createOptimizedObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Animation configuration based on quality level
 */
export function getAnimationConfig(quality: ReturnType<typeof getAnimationQuality>) {
  switch (quality) {
    case 'none':
      return {
        enabled: false,
        duration: 0,
        stagger: 0,
        ease: 'none',
      };
    case 'low':
      return {
        enabled: true,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
      };
    case 'medium':
      return {
        enabled: true,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      };
    case 'high':
      return {
        enabled: true,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power4.out',
      };
  }
}

