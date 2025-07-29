import { useEffect,useState } from "react";
import { BoxContent } from "../../components/BoxContent";
import { getQueuesStats} from "../../api/QueueAPI";
export function Home() {


  const [TotalBooks, setTotalBooks] = useState('');
  const [waitingQueues, setWaitingQueues] = useState('');
  const [completedQueues, setCompletedQueues] = useState('');
useEffect(()=>{
  const fetchData = async () => {
    try {
      const TotalBooks = await getQueuesStats();
      
      setTotalBooks(TotalBooks.data.total);
      setWaitingQueues(TotalBooks.data.waiting);
      setCompletedQueues(TotalBooks.data.completed);
     
   
    } catch (error) {
      console.error("Error fetching queues:", error);
    }
  };

  fetchData();
},[])




  

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="flex lg:flex-row flex-col justify-start items-center max-h-fit gap-4 ">
        <BoxContent className="max-w-md text-center w-full " >
            <p className="card-title justify-center">ยอดจองทั้งหมด</p>
          <p className="text-4xl font-bold text-primary mb-2">{TotalBooks}</p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>


        <BoxContent className="max-w-md text-center w-full">
        <p className="card-title justify-center">รอดำเนินการ</p>
          <p className="text-4xl font-bold text-warning mb-2">{waitingQueues}</p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>
        <BoxContent className="max-w-md text-center w-full">
             <p className="card-title justify-center">เสร็จสิ้น</p>
          <p className="text-4xl font-bold text-success mb-2">{completedQueues}</p>
          <p className="text-base-content/70">รายการ</p>
        </BoxContent>
      </div>

      {/* Charts */}
   

      <div className="w-full">
        <BoxContent>
            <p className="card-title">แนวโน้มการจองรายสัปดาห์</p>
          <div className="h-64">
          </div>
        </BoxContent>
      </div>
    </div>
  );
}
