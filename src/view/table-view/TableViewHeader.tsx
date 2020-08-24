import React from 'react';
import { Text, Box } from 'ink';

interface ITableViewHeaderProps {
  headings: string[];
}

export const TableViewHeader: React.FC<ITableViewHeaderProps> = (props) => {
  return (
    <Box flexDirection="row">
      {props.headings.map((heading: string) => {
        return (
          <Box width={20} padding={1} key={`heading-${heading}`}>
            <Text>{heading}</Text>
          </Box>
        );
      })}
    </Box>
  );
};
