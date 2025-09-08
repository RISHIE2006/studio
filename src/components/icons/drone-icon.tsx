import type { SVGProps } from 'react';

export function DroneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 12h.01" />
      <path d="M12 6.5A6.5 6.5 0 0 0 5.5 13H2" />
      <path d="M18.5 13H22a6.5 6.5 0 0 0-6.5-6.5" />
      <path d="M12 20.5A6.5 6.5 0 0 0 18.5 14h-13a6.5 6.5 0 0 0 6.5 6.5" />
      <path d="M12 3.5A6.5 6.5 0 0 0 5.5 10H11" />
      <path d="M13 10h5.5A6.5 6.5 0 0 0 12 3.5" />
    </svg>
  );
}
