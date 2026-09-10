import React from 'react';
import { cn } from "@/lib/utils";

interface FontAwesomeIconProps extends React.HTMLAttributes<HTMLElement> {
  name: string; // e.g. "fa-solid fa-user", "fa-brands fa-linkedin", "fa-book-open"
  className?: string;
}

export function FontAwesomeIcon({ name, className, ...props }: FontAwesomeIconProps) {
  // If icon name doesn't start with 'fa-', default to 'fa-solid fa-' prefix
  const iconClass = name.includes('fa-') ? name : `fa-solid fa-${name}`;

  return (
    <i className={cn(iconClass, className)} aria-hidden="true" {...props} />
  );
}

export default FontAwesomeIcon;
