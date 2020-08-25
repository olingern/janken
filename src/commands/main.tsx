import { IConfig, loadConfigSync } from '../lib/init';
import { Main } from '../view/main/Main';

export const command = '$0';
export const describe = 'Default command';
export const builder = {};

export interface IConfigConnectionItem {
  idx: number;
  label: string;
  value: string;
}

/**
 * Helper function that transforms user's config
 * into selectable items
 *
 * @param connections
 */
export function transformConfigToItems(connections: IConfig[]): IConfigConnectionItem[] {
  return connections.map((c, idx) => {
    return {
      idx,
      label: c.connectionName,
      value: c.connectionString,
    };
  });
}

/**
 * Handler invoked via yargs
 *
 * @param argv
 */
export const handler = function (_argv: any) {
  const connections = loadConfigSync();

  if (connections === null || connections.length < 1) {
    // TODO: provide some feedback and error handling here.
    process.stdout.write("There doesn't appear to be a config setup yet.\n");

    process.exit(1);
  }

  Main(transformConfigToItems(connections));
};
