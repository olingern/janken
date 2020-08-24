import React from 'react';
import { Text, Box } from 'ink';

interface ITableViewRowProps {
  value: string;
}

export const TableViewRow: React.FC<ITableViewRowProps> = (props) => {
  return (
    <Box width={20} paddingX={1} paddingBottom={1} borderColor="grey">
      <Text wrap="truncate">{props.value}</Text>
    </Box>
  );
};
