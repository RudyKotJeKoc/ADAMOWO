import type { ReactNode, SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export function IconBase({ children, title, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
