import { useEffect, useState } from "react";
import { BoxContent } from "../../components/BoxContent";
import { getLatestQueue, getQueuesStats } from "../../api/QueueAPI";
export function Home() {
  const [TotalBooks, setTotalBooks] = useState("");
  const [waitingQueues, setWaitingQueues] = useState("");
  const [completedQueues, setCompletedQueues] = useState("");
  const [inProgressQueues, setInProgressQueues] = useState("");
  const [cancelledQueues, setCancelledQueues] = useState("");
  const [latestQueues, setLatestQueues] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const TotalBooks = await getQueuesStats();

        setTotalBooks(TotalBooks.data.total);
        setWaitingQueues(TotalBooks.data.waiting);
        setCompletedQueues(TotalBooks.data.completed);
        setInProgressQueues(TotalBooks.data.inProgress);
        setCancelledQueues(TotalBooks.data.cancelled);

        const latestQueues = await getLatestQueue();

        setLatestQueues(latestQueues.data);
      } catch (error) {
        console.error("Error fetching queues:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="flex lg:flex-row flex-col justify-start items-center max-h-fit gap-4 ">
        <BoxContent className="max-w-md text-center w-full ">
          <p className="card-title justify-center">ยอดจองทั้งหมด</p>
          <p className="text-4xl font-bold text-primary mb-2">{TotalBooks}</p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>

        <BoxContent className="max-w-md text-center w-full">
          <p className="card-title justify-center">รอดำเนินการ</p>
          <p className="text-4xl font-bold text-warning mb-2">
            {waitingQueues}
          </p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>
        <BoxContent className="max-w-md text-center w-full">
          <p className="card-title justify-center">กำลังดำเนินการ</p>
          <p className="text-4xl font-bold text-info mb-2">
            {inProgressQueues}
          </p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>
        <BoxContent className="max-w-md text-center w-full">
          <p className="card-title justify-center">เสร็จสิ้น</p>
          <p className="text-4xl font-bold text-success mb-2">
            {completedQueues}
          </p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>
        <BoxContent className="max-w-md text-center w-full">
          <p className="card-title justify-center">ยกเลิก</p>
          <p className="text-4xl font-bold text-error mb-2">
            {cancelledQueues}
          </p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>
      </div>

      {/* Charts */}

      <div className="w-full">
        <BoxContent>
          <p className="card-title">รายการล่าสุด</p>
          <div className="h-64">
            <table className="table">
              <thead>
                <tr>
                  <th>หมายเลขคิว</th>
                  <th>ชื่อลูกค้า</th>
                  <th>สถานะ</th>
                  <th>วันที่จอง</th>
                  <th>วันที่สร้างรายการ</th>
                </tr>
              </thead>
              <tbody>
                {latestQueues.map((queue) => (
                  <tr key={queue.id}>
                    <td>{queue.queueId}</td>
                    <td>
                      {queue.customerId.customerName}{" "}
                      {queue.customerId.customerPhone}
                    </td>
                    <td>{queue.status}</td>
                    <td>
                      {new Date(queue.bookingDate).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}{" "}
                      {queue.timeSlotDetails.StartTime} น.
                    </td>
                    <td>{new Date(queue.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BoxContent>
      </div>
    </div>
  );
}
