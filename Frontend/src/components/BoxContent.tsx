import { type ReactNode } from "react";

interface BoxContentProps {
  children: ReactNode;
  className?: string;
 
}
export function BoxContent({ children, className="", }: BoxContentProps) {
  return( 
    <div className={`card p-4 bg-base-100 rounded-lg shadow-md ${className}`}>
  <div className="card-body">
   
      {children}
    
  </div>
</div>

    
    
  );
}
