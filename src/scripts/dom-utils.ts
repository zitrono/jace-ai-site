/**
 * DOM Utilities Module
 * Safe DOM query functions and event listener helpers with null safety checks
 */

export type QueryResult<T extends Element> = T | null;

/**
 * Safely query a single element from the DOM
 */
export function queryElement<T extends Element = Element>(
  selector: string,
  parent: Element | Document = document
): QueryResult<T> {
  try {
    return parent.querySelector<T>(selector);
  } catch (error) {
    console.error(`Failed to query selector: ${selector}`, error);
    return null;
  }
}

/**
 * Safely query multiple elements from the DOM
 */
export function queryElements<T extends Element = Element>(
  selector: string,
  parent: Element | Document = document
): NodeListOf<T> {
  try {
    return parent.querySelectorAll<T>(selector);
  } catch (error) {
    console.error(`Failed to query selector: ${selector}`, error);
    return document.querySelectorAll<T>('.__non_existent__'); // Return empty NodeList
  }
}

/**
 * Add event listener with null safety
 */
export function addEventListenerSafe<K extends keyof HTMLElementEventMap>(
  element: Element | null | undefined,
  event: K,
  handler: (this: Element, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  if (element) {
    element.addEventListener(event, handler as EventListener, options);
  }
}

/**
 * Add event listener to multiple elements
 */
export function addEventListenerToAll<K extends keyof HTMLElementEventMap>(
  elements: NodeListOf<Element> | Element[] | null | undefined,
  event: K,
  handler: (this: Element, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  if (elements) {
    elements.forEach(element => {
      addEventListenerSafe(element, event, handler, options);
    });
  }
}

/**
 * Wait for DOM to be ready
 */
export function onDOMReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Request animation frame with fallback
 */
export function raf(callback: () => void): void {
  if ('requestAnimationFrame' in window) {
    requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 16);
  }
}

/**
 * Set multiple attributes on an element
 */
export function setAttributes(
  element: Element | null,
  attributes: Record<string, string>
): void {
  if (!element) return;
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

/**
 * Toggle class with optional force parameter
 */
export function toggleClass(
  element: Element | null,
  className: string,
  force?: boolean
): boolean {
  if (!element) return false;
  return element.classList.toggle(className, force);
}

/**
 * Check if element matches selector
 */
export function matches(
  element: Element | null,
  selector: string
): boolean {
  if (!element) return false;
  return element.matches(selector);
}