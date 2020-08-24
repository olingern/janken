import React from 'react';
import { Box } from 'ink';
import { TableViewHeader } from './TableViewHeader';
import { TableViewRow } from './TableViewRow';
import { ForegroundColor } from 'chalk';

interface ITableViewProps {
  headings: string[];
  rows: any[];
  borderColor: typeof ForegroundColor;
}

export const TableView: React.FC<ITableViewProps> = (props) => {
  return props.headings.length > 0 ? (
    <Box minHeight={30} flexDirection="column" borderColor={props.borderColor} borderStyle="single">
      <TableViewHeader headings={props.headings} />
      <Box flexDirection="column">
        {props.rows?.map((row, rowIndex) => {
          return (
            <Box key={rowIndex}>
              {props.headings.map((heading, headingIndex) => {
                return (
                  <TableViewRow key={`heading-${headingIndex}-row-${rowIndex}`} value={row[heading]?.toString()} />
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  ) : (
    <></>
  );
};
