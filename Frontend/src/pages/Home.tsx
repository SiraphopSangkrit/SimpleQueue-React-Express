import { BoxContent } from "../components/BoxContent";
import {  LineChart } from "../components/Chart";

export function Home() {



  const lineChartData = {
    labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
    datasets: [
      {
        label: 'จองใหม่',
        data: [3, 7, 4, 8],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
      {
        label: 'ยกเลิก',
        data: [1, 2, 1, 3],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="flex lg:flex-row flex-col justify-start items-center max-h-fit gap-4 ">
        <BoxContent className="max-w-md text-center max-w-md" >
            <p className="card-title justify-center">ยอดจองทั้งหมด</p>
          <p className="text-4xl font-bold text-primary mb-2">6</p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>

        <BoxContent className="max-w-md text-center max-w-md">
             <p className="card-title justify-center">ยอดยกเลิก</p>
          <p className="text-4xl font-bold text-error mb-2">2</p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>

        <BoxContent className="max-w-md text-center max-w-md">
        <p className="card-title justify-center">รอดำเนินการ</p>
          <p className="text-4xl font-bold text-warning mb-2">4</p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>
      </div>

      {/* Charts */}
   

      <div className="w-full">
        <BoxContent>
            <p className="card-title">แนวโน้มการจองรายสัปดาห์</p>
          <div className="h-64">
            <LineChart data={lineChartData} className="h-full" />
          </div>
        </BoxContent>
      </div>
    </div>
  );
}
