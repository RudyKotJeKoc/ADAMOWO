import { createElement, forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react';

type MotionExtras = {
  layoutId?: string;
  transition?: Record<string, unknown>;
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  whileFocus?: Record<string, unknown>;
};

type MotionComponent<T extends ElementType> = (props: MotionExtras & ComponentPropsWithoutRef<T>) => JSX.Element;

const createMotion = <T extends ElementType>(tag: T): MotionComponent<T> =>
  forwardRef<HTMLElement, MotionExtras & ComponentPropsWithoutRef<T>>(({ children, ...rest }, ref) =>
    createElement(tag as ElementType, { ...rest, ref }, children)
  ) as MotionComponent<T>;

export const motion = new Proxy(
  {},
  {
    get: (_target, key: string) => createMotion(key as ElementType)
  }
) as Record<string, MotionComponent<ElementType>>;

export const AnimatePresence = ({ children }: PropsWithChildren): JSX.Element => <>{children}</>;
export const LayoutGroup = ({ children }: PropsWithChildren): JSX.Element => <>{children}</>;
