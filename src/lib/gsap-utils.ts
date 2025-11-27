import { gsap } from "gsap";

/**
 * GSAP animation configurations and utilities
 */

// Default animation settings
export const defaultAnimationConfig = {
  duration: 0.6,
  ease: "power3.out",
};

// Fade in animation
export const fadeIn = (element: HTMLElement, delay = 0) => {
  return gsap.from(element, {
    opacity: 0,
    y: 30,
    duration: defaultAnimationConfig.duration,
    ease: defaultAnimationConfig.ease,
    delay,
  });
};

// Slide in from left
export const slideInLeft = (element: HTMLElement, delay = 0) => {
  return gsap.from(element, {
    opacity: 0,
    x: -50,
    duration: defaultAnimationConfig.duration,
    ease: defaultAnimationConfig.ease,
    delay,
  });
};

// Slide in from right
export const slideInRight = (element: HTMLElement, delay = 0) => {
  return gsap.from(element, {
    opacity: 0,
    x: 50,
    duration: defaultAnimationConfig.duration,
    ease: defaultAnimationConfig.ease,
    delay,
  });
};

// Scale in animation
export const scaleIn = (element: HTMLElement, delay = 0) => {
  return gsap.from(element, {
    opacity: 0,
    scale: 0.8,
    duration: defaultAnimationConfig.duration,
    ease: "back.out(1.7)",
    delay,
  });
};

// Stagger children animation
export const staggerChildren = (
  container: HTMLElement,
  childSelector: string,
  delay = 0,
) => {
  const children = container.querySelectorAll(childSelector);
  return gsap.from(children, {
    opacity: 0,
    y: 30,
    duration: defaultAnimationConfig.duration,
    ease: defaultAnimationConfig.ease,
    stagger: 0.1,
    delay,
  });
};

// Floating animation - Note: Remember to kill the returned tween when done
export const floatingAnimation = (element: HTMLElement) => {
  return gsap.to(element, {
    y: "-=20",
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
};

// Pulse animation - Note: Remember to kill the returned tween when done
export const pulseAnimation = (element: HTMLElement) => {
  return gsap.to(element, {
    scale: 1.05,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
};

// Card hover animation
export const cardHoverIn = (element: HTMLElement) => {
  return gsap.to(element, {
    y: -8,
    scale: 1.02,
    duration: 0.3,
    ease: "power2.out",
  });
};

export const cardHoverOut = (element: HTMLElement) => {
  return gsap.to(element, {
    y: 0,
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
  });
};

// Text reveal animation
export const textReveal = (element: HTMLElement, delay = 0) => {
  return gsap.from(element, {
    opacity: 0,
    y: 50,
    rotateX: -90,
    transformOrigin: "top center",
    duration: 0.8,
    ease: "power3.out",
    delay,
  });
};

// Blur animation
export const blurIn = (element: HTMLElement, delay = 0) => {
  return gsap.from(element, {
    opacity: 0,
    filter: "blur(20px)",
    duration: 0.8,
    ease: defaultAnimationConfig.ease,
    delay,
  });
};

// Shimmer effect - Note: Remember to kill the returned tween when done
export const shimmerEffect = (element: HTMLElement) => {
  const shimmer = document.createElement("div");
  shimmer.className = "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent";
  shimmer.setAttribute("data-shimmer", "true");
  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(shimmer);

  const tween = gsap.to(shimmer, {
    x: "200%",
    duration: 1.5,
    ease: "power2.inOut",
    repeat: -1,
    repeatDelay: 2,
  });

  // Store cleanup function on the element
  (element as HTMLElement & { _cleanupShimmer?: () => void })._cleanupShimmer = () => {
    tween.kill();
    shimmer.remove();
  };

  return tween;
};

