import { existsSync, unlinkSync } from 'fs';
import * as stream from 'stream';

import { configLoc, writeConfigSync } from '../../../src/lib/init';

export const cli = `${process.cwd()}/bin/run`;


export function removeConfigSync() {
    if (existsSync(configLoc)) {
        unlinkSync(configLoc)
    }
}

/**
 * A basic handler function to turn stdout into promise based responses for config
 * initialization. 
 * 
 *  
 * @param outputStream output stream
 */
export function handleStdout(outputStream: stream.Readable) {
    return new Promise((res, _rej) => {
        outputStream.on('data', (data) => res(data.toString()?.trim()))
    })
}

export const testConfig = [
    {
        connectionName: "Test",
        connectionString: "postgres://user:pass@localhost/db"
    }
]

export function writeTestConfigSync() {
    writeConfigSync(testConfig)
}

/**
 * Credit: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
 * @param ms 
 */
export function sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}