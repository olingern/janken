/**
 * Credit:
 * This code is from Yarn v1
 * https://github.com/yarnpkg/yarn/blob/eb2b565bb9b948e87b11119482ebc184a9d66141/src/util/root-user.js
 */
import { homedir } from 'os';
import path from 'path';

/**
 *
 */
function getUid(): number | null {
  if (process.platform !== 'win32' && process.getuid) {
    return process.getuid();
  }

  return null;
}

/**
 *
 * @param uid
 */
export function isRootUser(uid: number | null): boolean {
  return uid === 0;
}

/**
 *
 */
export function getHomeDir() {
  const ROOT_USER = isRootUser(getUid());

  return ROOT_USER ? path.resolve('/usr/local/share') : homedir();
}
