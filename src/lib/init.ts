import fs from 'fs';

import { getHomeDir } from './rootUser';

const homeDir = getHomeDir();
const configDir = `${homeDir}/.yaba`;
export const configLoc = `${configDir}/config.json`;

/**
 * Interface that represents a single connections string
 */
export interface IConfig {
  connectionName: string;
  connectionString: string;
}

/**
 *
 */
export function configExistsSync(): boolean {
  return fs.existsSync(configLoc);
}

/**
 * Writes the config synchronously
 *
 * @param config
 */
export function writeConfigSync(config: IConfig[]): boolean {
  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir);
    }

    const configJSON = JSON.stringify(config, null, 2);
    fs.writeFileSync(configLoc, configJSON);
  } catch (e) {
    console.log(e);
  }

  return true;
}

/**
 * Loads the config synchronously
 */
export function loadConfigSync(): IConfig[] | null {
  if (!fs.existsSync(configDir) || !fs.existsSync(configLoc)) {
    return [];
  }

  const config: IConfig[] = JSON.parse(fs.readFileSync(configLoc).toString());

  return config;
}
