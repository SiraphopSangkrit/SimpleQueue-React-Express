import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {
  type: 'bar' | 'line' | 'doughnut' | 'pie';
  data: any;
  options?: any;
  className?: string;
}

export function Chart({ type, data, options = {}, className = '' }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      chartInstance.current = new ChartJS(chartRef.current, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={chartRef} />
    </div>
  );
}

// Predefined chart components for common use cases
export function BarChart({ data, options, className }: Omit<ChartProps, 'type'>) {
  return <Chart type="bar" data={data} options={options} className={className} />;
}

export function LineChart({ data, options, className }: Omit<ChartProps, 'type'>) {
  return <Chart type="line" data={data} options={options} className={className} />;
}

export function DoughnutChart({ data, options, className }: Omit<ChartProps, 'type'>) {
  return <Chart type="doughnut" data={data} options={options} className={className} />;
}

export function PieChart({ data, options, className }: Omit<ChartProps, 'type'>) {
  return <Chart type="pie" data={data} options={options} className={className} />;
}
