import type { SVGProps } from 'react';

export function AmbulanceIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M10 10H6" />
      <path d="M8 8v4" />
      <path d="M9 18h6" />
      <path d="M18 18h2v-5a2 2 0 0 0-2-2h-1" />
      <path d="M4 18h1" />
      <path d="M15 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M17 13H5a2 2 0 0 0-2 2v1" />
      <path d="M17 9.5 14 5" />
      <path d="m3 11 2-3" />
    </svg>
  );
}
