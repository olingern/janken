import { Item } from 'ink-select-input/build/SelectInput';

export interface IDatabaseViewStateDisplay {
  tableRows: boolean;
  tableSelection: boolean;
}

export interface IDatabaseViewStateSelectedTable {
  allRows: any[];
  headings: string[];
  name: string;
  page: number;
  shownRows: any[];
  totalPages: number;
}

export interface IDatabaseViewStateColumnBounds {
  lower: number;
  upper: number;
}

export interface IDatabaseViewState {
  allHeadings: string[];
  columnBounds: IDatabaseViewStateColumnBounds;
  display: IDatabaseViewStateDisplay;
  selectedTable: IDatabaseViewStateSelectedTable;
  shownColumns: string[];
  tables: Item[];
}

export interface IDatabaseSelectTablePayload {
  allHeadings: string[];
  selectedTable: IDatabaseViewStateSelectedTable;
  shownColumns: string[];
  display: IDatabaseViewStateDisplay;
}

export interface IDatabaseSetShowColumnsPayload {
  shownColumns: string[];
  columnBounds: IDatabaseViewStateColumnBounds;
}

export type IDatabaseViewAction =
  | { type: 'SET_TABLES'; payload: Item[] }
  | { type: 'SELECT_TABLE'; payload: IDatabaseSelectTablePayload }
  | { type: 'SET_DISPLAY'; payload: IDatabaseViewStateDisplay }
  | {
      type: 'SET_SHOWN_COLUMNS';
      payload: {
        shownColumns: string[];
        columnBounds: IDatabaseViewStateColumnBounds;
      };
    }
  | { type: 'SET_SHOWN_ROWS'; payload: IDatabaseViewStateSelectedTable };
