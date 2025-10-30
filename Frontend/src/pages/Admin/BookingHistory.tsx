import { Table } from "../../components/Table";


export function Customer() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">Booking History</h1>
       
      </div>
 
      <div className="w-full">
        <Table data={[]} />
      </div>
    </div>
  );
}
