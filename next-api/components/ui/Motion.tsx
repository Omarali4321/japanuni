'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

// FadeIn animation
export interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, delay = 0, duration = 0.4, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeIn.displayName = 'FadeIn';

// SlideUp animation
export interface SlideUpProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
}

export const SlideUp = forwardRef<HTMLDivElement, SlideUpProps>(
  ({ children, delay = 0, duration = 0.5, distance = 20, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
SlideUp.displayName = 'SlideUp';

// SlideIn from left
export interface SlideInLeftProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
}

export const SlideInLeft = forwardRef<HTMLDivElement, SlideInLeftProps>(
  ({ children, delay = 0, duration = 0.5, distance = 30, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -distance }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
SlideInLeft.displayName = 'SlideInLeft';

// SlideIn from right
export interface SlideInRightProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
}

export const SlideInRight = forwardRef<HTMLDivElement, SlideInRightProps>(
  ({ children, delay = 0, duration = 0.5, distance = 30, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: distance }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
SlideInRight.displayName = 'SlideInRight';

// Scale animation
export interface ScaleInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, delay = 0, duration = 0.3, scale = 0.95, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
ScaleIn.displayName = 'ScaleIn';

// StaggerContainer for orchestrating child animations
export interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, staggerDelay = 0.1, delayChildren = 0, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
StaggerContainer.displayName = 'StaggerContainer';

// StaggerItem for children of StaggerContainer
export interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  customDelay?: number;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, customDelay = 0, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: (custom: number) => ({
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            delay: customDelay + custom * 0.1,
            ease: 'easeOut',
          },
        }),
      }}
      custom={customDelay}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
StaggerItem.displayName = 'StaggerItem';

// Page transition wrapper
export interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = '' }: PageTransitionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Hover lift animation
export interface HoverLiftProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  lift?: number;
}

export const HoverLift = forwardRef<HTMLDivElement, HoverLiftProps>(
  ({ children, lift = -4, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ y: lift, transition: { duration: 0.2, ease: 'easeOut' } }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
HoverLift.displayName = 'HoverLift';

// Tap scale animation
export interface TapScaleProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  scale?: number;
}

export const TapScale = forwardRef<HTMLDivElement, TapScaleProps>(
  ({ children, scale = 0.98, className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      whileTap={{ scale, transition: { duration: 0.1 } }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
TapScale.displayName = 'TapScale';

// Reveal on scroll (using viewport)
export interface RevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  once?: boolean;
  margin?: string;
}

export const Reveal = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, once = true, margin = '0px 0px -100px 0px', className = '', ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
Reveal.displayName = 'Reveal';