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
export function handleStdout(outputStream: stream.Readable): Promise<string> {
    return new Promise((res, _rej) => {
        outputStream.on('data', (data) => res(data.toString()?.trim()))
    })
}

export const testConfig = [
    {
        connectionName: "Test",
        connectionString: "postgres://postgres:postgres@localhost/pgdb"
    }
]

export function writeTestConfigSync() {
    writeConfigSync(testConfig)
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export const keys = {
    up: '\x1B\x5B\x41',
    down: '\x1B\x5B\x42',
    left: '\x1B\x5B\x44',
    right: '\x1B\x5B\x43',
    enter: '\x0D',
    space: '\x20'
}