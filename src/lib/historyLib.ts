import { parse, type HTMLElement } from 'node-html-parser';
import { table, type TableUserConfig } from 'table';

interface Options {
  newPatients?: boolean;
  isOneDay?: boolean;
}
export const parseDataAndPrint = (
  body: string,
  { isOneDay, newPatients }: Options
) => {
  const root = parse(body);
  const selectedElements = root.querySelectorAll(':has(> h5, > table)');

  selectedElements.forEach((el) => {
    const tableEl = el.querySelector('table');
    if (!tableEl || tableEl.classList.contains('toggletable')) return;

    const title = el.querySelector('h5')?.text || '';
    if (newPatients && !title.includes('신환 분배 현황')) return;
    if (isOneDay && title.includes('기간별 현황')) return;

    const tableData = extractTableData(tableEl, title);

    const columnLength = tableData[0].length;
    const columns: TableUserConfig['columns'] =
      columnLength > 24
        ? Array.from({ length: columnLength }, (value, index) =>
            index + 1 === columnLength ? { width: 12 } : { width: 2 }
          )
        : {};

    console.info(
      table(tableData, {
        columns,
        columnDefault: { alignment: 'right' },
        ...(title && { header: { content: title } }),
      })
    );
  });
};

const extractTableData = (tableEl: HTMLElement, title: string) => {
  const parsedData: string[][] = [];

  tableEl.querySelectorAll('tr').forEach((row, rowIndex) => {
    const rowData: string[] = [];
    row.querySelectorAll('th, td').forEach((cell, cellIndex) => {
      rowData.push(cell.textContent?.trim());
    });
    parsedData.push(rowData);
  });

  return parsedData;
};
