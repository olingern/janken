import { Item } from 'ink-select-input/build/SelectInput';
import React, { createContext, Dispatch, useReducer } from 'react';

import { IDatabaseProvider } from '../providers/shared';
import { DatabaseView } from './database-view/DatabaseView';
import { SelectDatabase } from './select-database/SelectDatabase';

/**
 * ACTIONS
 */
export enum APP_ACTIONS {
  SELECT_DATABASE = 'SELECT_DATABASE',
  SET_CONNECTION_STRINGS = 'SET_CONNECTION_STRING',
  SELECT_CONNECTION = 'SELECT_CONNECTION',
}

export interface ISelectInput extends Item {
  idx: number;
  value: string;
}

/**
 * APP STATE
 */
interface IAppState {
  connectionStrings: ISelectInput[];
  connectionIdx: number;
  component: JSX.Element;
  databaseProvider: IDatabaseProvider;
}

/**
 *
 */
interface IAppAction {
  type: APP_ACTIONS;
  payload?: any;
}

/**
 *
 */
interface IContext {
  state: IAppState;
  dispatch: Dispatch<IAppAction>;
}

/**
 * Initial state
 */
const initialState: IAppState = {
  connectionIdx: 0,
  connectionStrings: [],
  databaseProvider: null,
  component: <SelectDatabase />,
};

/**
 *
 */
const AppContext = createContext<IContext>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: IAppState, action: IAppAction): IAppState => {
  switch (action.type) {
    case APP_ACTIONS.SELECT_DATABASE:
      return { ...state, component: <SelectDatabase /> };

    case APP_ACTIONS.SET_CONNECTION_STRINGS:
      return { ...state, connectionStrings: action.payload };

    case APP_ACTIONS.SELECT_CONNECTION:
      return {
        ...state,
        databaseProvider: action.payload,
        component: <DatabaseView />,
      };

    default:
      return { ...state };
  }
};

const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export { AppProvider, AppContext };
