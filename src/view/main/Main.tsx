import { Box, render } from 'ink';
import { Item } from 'ink-select-input/build/SelectInput';
import React, { useContext, useEffect } from 'react';

import { APP_ACTIONS, AppContext, AppProvider } from '../context';

/**
 * interface representing selectable connections that are
 * passed into Main
 */
interface IMainComponentProps {
  connectionItems: Item[];
}

/**
 * Renders `state.component` which is controlled by the context api. It's a router
 * stand-in.
 *
 * @param props
 */
export const MainComponentContextWrapped = (props: IMainComponentProps) => {
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    dispatch({
      type: APP_ACTIONS.SET_CONNECTION_STRINGS,
      payload: props.connectionItems,
    });
  }, []);

  return <Box>{state.component}</Box>;
};

/**
 * Main entry point into the Ink application. Acts as a state initializer
 * so that MainComponentContextWrapped can store connection strings inside
 * of the context api
 *
 * @param props
 */
export const MainComponent = (props: IMainComponentProps) => {
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    dispatch({
      type: APP_ACTIONS.SET_CONNECTION_STRINGS,
      payload: props.connectionItems,
    });
  }, []);

  return (
    <>
      <AppProvider>
        <Box>
          <MainComponentContextWrapped connectionItems={props.connectionItems} />
        </Box>
      </AppProvider>
    </>
  );
};

/**
 * Export a function to be invoked by Main command.
 * @param connectionItems
 */
export const Main = (connectionItems) => {
  render(<MainComponent connectionItems={connectionItems} />);
};
