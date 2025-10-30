import {  useEffect, useState } from "react";
import { Table } from "../../components/Table";
import { getAllCustomers } from "../../api/CustomerAPI";
import type { CustomerProps } from "../../api/CustomerAPI";

export function Customer() {

  const [customers, setCustomers] =  useState<CustomerProps[]>([]);

  useEffect(() => {
   const fetchCustomers = async () => {
     const customers = await getAllCustomers();
     setCustomers(customers);
     console.log("Customers fetched successfully:", customers);
   };
   fetchCustomers();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">Customer</h1>
       
      </div>
 
      <div className="w-full">
        <Table data={customers} />
      </div>
    </div>
  );
}
