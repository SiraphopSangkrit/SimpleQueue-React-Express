import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import { useState } from "react";
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.html5.mjs";
import "datatables.net-buttons/js/buttons.print.mjs";

DataTable.use(DT);

export function Table() {
  const [tableData] = useState([
    ["Tiger Nixon", "System Architect", "asdasda"],
    ["Garrett Winters", "Accountant", "asdasda33"],
  ]);

  return (
    <DataTable data={tableData} className="display" >
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>เบอร์โทร</th>
          <th>Line_id</th>
        </tr>
      </thead>
    </DataTable>
  );
}
