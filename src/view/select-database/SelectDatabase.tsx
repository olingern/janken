import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { Item } from 'ink-select-input/build/SelectInput';
import React, { useContext, useEffect } from 'react';

import { getDatabaseProviderInstance } from '../../providers';
import { APP_ACTIONS, AppContext } from '../context';

export const SelectDatabase = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {});

  const handleSelect = async (item: Item): Promise<void> => {
    const connectionString: string = item.value as string;
    const database = getDatabaseProviderInstance(connectionString);
    await database.connect();
    dispatch({ type: APP_ACTIONS.SELECT_CONNECTION, payload: database });
  };

  return (
    <Box minWidth="30%" padding={1} flexDirection="column" borderStyle="single" width="50%">
      <Box paddingBottom={1}>
        <Text>Connections</Text>
      </Box>
      <SelectInput items={state.connectionStrings} onSelect={handleSelect} />
    </Box>
  );
};
