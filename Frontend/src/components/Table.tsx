import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import { useState, useEffect } from "react";
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.html5.mjs";
import "datatables.net-buttons/js/buttons.print.mjs";
import type { CustomerProps } from "../api/CustomerAPI";
DataTable.use(DT);

export function Table({ data }: { data: CustomerProps[] }) {
  const [tableData, setTableData] = useState<CustomerProps[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const columns = [
    {
      title: "ชื่อ",
      data: "customerName"
    },
    {
      title: "เบอร์โทร", 
      data: "customerPhone"
    },
    {
      title: "Line ID",
      data: "customerLineId",
      defaultContent: "-"
    }
  ];

  return (
    <DataTable 
      data={tableData} 
      columns={columns}
      className="display"
      options={{
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        order: [[0, 'asc']],
        language: {
          search: "ค้นหา:",
          lengthMenu: "แสดง _MENU_ รายการต่อหน้า",
          info: "แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ",
          infoEmpty: "แสดง 0 ถึง 0 จาก 0 รายการ",
          infoFiltered: "(กรองจาก _MAX_ รายการทั้งหมด)",
          paginate: {
            first: "หน้าแรก",
            last: "หน้าสุดท้าย", 
            next: "ถัดไป",
            previous: "ก่อนหน้า"
          },
          emptyTable: "ไม่มีข้อมูลในตาราง"
        }
      }}
    >
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>เบอร์โทร</th>
          <th>Line ID</th>
        </tr>
      </thead>
    </DataTable>
  );
}
