import * as React from "react";

// Table component
const Table: React.FC<React.HTMLProps<HTMLTableElement>> = ({ children, ...props }) => (
  <table {...props}>{children}</table>
);

// TableBody component
const TableBody: React.FC<React.TdHTMLAttributes<HTMLBodyElement>> = ({ children,...props }) => <tbody>{children}</tbody>;

// TableCell component
const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, ...props }) => (
  <td {...props}>{children}</td>
);

// TableHead component (For <th> elements)
const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableHeaderCellElement>> = ({ children, ...props }) => (
  <th {...props}>{children}</th>
);

// TableHeader component (For <thead>)
const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
);

// TableRow component
const TableRow: React.FC<React.HTMLProps<HTMLTableRowElement>> = ({ children, ...props }) => (
  <tr {...props}>{children}</tr>
);

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
