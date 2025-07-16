import { type ReactNode } from "react";

interface BoxContentProps {
  children: ReactNode;
  className?: string;
  title?: string;
}
export function Card({
  children,
  className = "",
  title = "",
}: BoxContentProps) {
  return (
    <div className={`card bg-base-100 w-96 shadow-sm ${className}`}>
      
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
