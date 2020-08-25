import { Box, Text, useApp, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Item } from 'ink-select-input/build/SelectInput';
import React, { useContext, useEffect, useReducer } from 'react';
import { IDatabaseProvider } from 'src/providers/shared';

import { AppContext } from '../context';
import { TableView } from '../table-view/TableView';
import {
  IDatabaseSetShowColumnsPayload,
  IDatabaseViewAction,
  IDatabaseViewState,
  IDatabaseViewStateSelectedTable,
} from './DatabaseViewInterfaces';

const recordsPerPage = 10;

const initialDatabaseViewState: IDatabaseViewState = {
  allHeadings: [],
  columnBounds: {
    lower: 0,
    upper: 3,
  },
  display: {
    tableSelection: true,
    tableRows: false,
  },
  selectedTable: {
    name: '',
    headings: [],
    allRows: [],
    shownRows: [],
    page: 0,
    totalPages: 0,
  },
  shownColumns: [],
  tables: [],
};

async function getDataFromTable(
  provider: IDatabaseProvider,
  table: string,
  page: number,
  lower: number,
  upper: number,
) {
  const tableQuery = await provider.getAllFromTable(table, page * recordsPerPage);

  const selectedTable = {
    headings: Array.from(tableQuery.columns),
    allRows: tableQuery.records,
    shownRows: tableQuery.records.slice(0, recordsPerPage),
    page,
    totalPages: tableQuery.records.length / recordsPerPage,
  };

  const shownColumns = tableQuery.columns.slice(lower, upper);

  return {
    allHeadings: tableQuery.columns,
    display: {
      tableSelection: false,
      tableRows: true,
    },
    selectedTable,
    shownColumns,
  };
}

/**
 * Reducer to handle actions local to DatabaseView component
 *
 * @param state
 * @param action
 */
function databaseViewReducer(state: IDatabaseViewState, action: IDatabaseViewAction): IDatabaseViewState {
  switch (action.type) {
    case 'SET_TABLES':
      return { ...state, tables: action.payload };

    case 'SELECT_TABLE':
      return {
        ...state,
        allHeadings: action.payload.allHeadings,
        selectedTable: action.payload.selectedTable,
        shownColumns: action.payload.shownColumns,
        display: action.payload.display,
      };

    case 'SET_DISPLAY':
      return {
        ...state,
        display: action.payload,
      };

    case 'SET_SHOWN_COLUMNS':
      return {
        ...state,
        shownColumns: action.payload.shownColumns,
        columnBounds: action.payload.columnBounds,
      };

    case 'SET_SHOWN_ROWS':
      return {
        ...state,
        selectedTable: action.payload,
      };
  }
}

export function getNewBounds(headingLen: number, passedLower: number, passedUpper: number) {
  const lower = passedLower > 0 ? passedLower : 0;
  const upper = passedUpper < headingLen ? passedUpper : headingLen;

  return { lower, upper };
}

/**
 * Exported component that is mounted via context api
 */
export const DatabaseView: React.FC = () => {
  const { state } = useContext(AppContext);
  const { exit } = useApp();
  const [dbViewState, dbViewDispatch] = useReducer(databaseViewReducer, initialDatabaseViewState);

  /**
   *
   */
  useEffect(() => {
    const fetchTables = async () => {
      let tables = [];
      try {
        tables = await state.databaseProvider.getTableList();
      } catch (e) {
        // TODO: Provide error display area inside of App. Right now,
        //       error will not be logged unless we exit the app.
        exit();
        throw new Error(e);
      }

      dbViewDispatch({ type: 'SET_TABLES', payload: tables });
    };

    fetchTables();
  }, []);

  /**
   *
   * @param lower
   * @param upper
   */
  const handleBounds = (passedLower: number, passedUpper: number) => {
    const headingLen = dbViewState.allHeadings.length - 1;

    const { lower, upper } = getNewBounds(headingLen, passedLower, passedUpper);

    const payload: IDatabaseSetShowColumnsPayload = {
      shownColumns: dbViewState.allHeadings.slice(lower, upper),
      columnBounds: {
        lower,
        upper,
      },
    };

    dbViewDispatch({ type: 'SET_SHOWN_COLUMNS', payload });
  };

  /**
   * Handle user input
   */
  useInput(async (_input, key) => {
    if (key.escape) {
      const payload = { tableSelection: true, tableRows: false };
      dbViewDispatch({ type: 'SET_DISPLAY', payload });
    }

    /**
     * HANDLE RIGHT ARROW FOR SCROLLING THROUGH COLUMNS
     */
    if (key.rightArrow && dbViewState.display.tableRows) {
      if (dbViewState.columnBounds.upper < dbViewState.allHeadings.length - 1) {
        handleBounds(dbViewState.columnBounds.lower + 1, dbViewState.columnBounds.upper + 1);
      }
    }

    /**
     * HANDLE LEFT ARROW FOR SCROLLING THROUGH COLUMNS
     */
    if (key.leftArrow && dbViewState.display.tableRows) {
      if (dbViewState.columnBounds.lower > 0) {
        handleBounds(dbViewState.columnBounds.lower - 1, dbViewState.columnBounds.upper - 1);
      }
    }

    /**
     * HANDLE UP ARROW FOR PAGING THROUGH RECORDS
     */
    if (key.upArrow && dbViewState.display.tableRows) {
      const newPage = dbViewState.selectedTable.page - 1;

      if (newPage >= 0) {
        const rowPayload: IDatabaseViewStateSelectedTable = {
          ...dbViewState.selectedTable,
          shownRows: dbViewState.selectedTable.allRows.slice(
            newPage * recordsPerPage,
            newPage * recordsPerPage + recordsPerPage,
          ),
          page: newPage,
        };
        dbViewDispatch({ type: 'SET_SHOWN_ROWS', payload: rowPayload });
      }
    }

    /**
     * HANDLE DOWN ARROW FOR PAGING THROUGH RECORDS
     */
    if (key.downArrow && dbViewState.display.tableRows) {
      const newPage = dbViewState.selectedTable.page + 1;
      const lowerArrayBounds = newPage * recordsPerPage;

      if (dbViewState.selectedTable.allRows.length > lowerArrayBounds) {
        const rowPayload: IDatabaseViewStateSelectedTable = {
          ...dbViewState.selectedTable,
          shownRows: dbViewState.selectedTable.allRows.slice(
            newPage * recordsPerPage,
            newPage * recordsPerPage + recordsPerPage,
          ),
          page: newPage,
        };
        dbViewDispatch({ type: 'SET_SHOWN_ROWS', payload: rowPayload });
      } else {
        getDataFromTable(
          state.databaseProvider,
          dbViewState.selectedTable.name,
          newPage,
          dbViewState.columnBounds.lower,
          dbViewState.columnBounds.upper,
        );
      }
    }
  });

  /**
   * Handle a user selecting a table to view
   *
   * @param item
   */
  const handleSelect = async (item: Item) => {
    const tableQuery = await state.databaseProvider.getAllFromTable(item.label, 0);

    const selectedTable = {
      allRows: tableQuery.records,
      headings: Array.from(tableQuery.columns),
      name: item.value as string,
      page: 0,
      shownRows: tableQuery.records.slice(0, recordsPerPage),
      totalPages: tableQuery.records.length / recordsPerPage,
    };

    const shownColumns = tableQuery.columns.slice(dbViewState.columnBounds.lower, dbViewState.columnBounds.upper);

    const payload = {
      allHeadings: tableQuery.columns,
      selectedTable,
      shownColumns,
      display: {
        tableSelection: false,
        tableRows: true,
      },
    };

    dbViewDispatch({ type: 'SELECT_TABLE', payload });
  };

  /**
   * TODOS:
   * - theming
   * - adjustable widths? would need a resize mode like i3
   */
  return (
    <Box width="100%">
      <Box minHeight={30} flexDirection="row" width="100%" padding={1}>
        <Box
          minWidth="30%"
          padding={1}
          flexDirection="column"
          borderColor={dbViewState.display.tableSelection ? 'greenBright' : 'grey'}
          borderStyle="single"
          width="30%"
        >
          <Box paddingBottom={1}>
            <Text>Tables</Text>
          </Box>
          <SelectInput items={dbViewState.tables} onSelect={handleSelect} />
        </Box>
        <Box minHeight={30} width="70%" flexDirection="column">
          <TableView
            borderColor={dbViewState.display.tableRows ? 'greenBright' : 'grey'}
            headings={dbViewState.shownColumns}
            rows={dbViewState.selectedTable.shownRows}
          />
        </Box>
      </Box>
    </Box>
  );
};
