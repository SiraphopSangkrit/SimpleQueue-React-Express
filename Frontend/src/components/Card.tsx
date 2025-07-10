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
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
        <button className="btn btn-primary">Buy Now</button>
      </div>
    </div>
  );
}
