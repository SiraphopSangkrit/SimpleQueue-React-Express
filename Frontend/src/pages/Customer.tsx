import { Table } from "../components/Table";
import { CustomerModal } from "../components/Modals/CustomerModal";
import { Input } from "../components/Inputs/Input";

export function Customer() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">Customer</h1>
       
      </div>
 
      <div className="w-full">
        <Table />
      </div>
    </div>
  );
}
