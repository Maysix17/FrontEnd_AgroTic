import React from "react";
import Table from "../atoms/Table";
import TableRow from "../molecules/TableRow";
import type { ResultsTableProps } from "../../types/ResultsTableProps";

const ResultsTable: React.FC<ResultsTableProps> = ({ data, onView }) => {
  return (
    <Table headers={["Lote", "Cultivo", "Sensor", "Acciones"]}>
      {data.map((item, index) => (
        <TableRow key={index} item={item} onView={onView} />
      ))}
    </Table>
  );
};

export default ResultsTable;
