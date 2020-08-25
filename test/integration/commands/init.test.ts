/**
 * 
 */
import test, { ExecutionContext } from 'ava';
import execa from 'execa';

import { questions } from '../../../src/commands/init';
import { loadConfigSync } from '../../../src/lib/init';
import { delay, keys, removeConfigSync } from './helpers';


const cli = `${process.cwd()}/bin/run`;



const inResponses = {
    connectionName: "test-connection",
    connectionString: "postgres://user:pass@localhost/db"
}


/**
 * Remove config before each test
 */
test.beforeEach(async () => {
    removeConfigSync()
})

test.afterEach(async () => {
    removeConfigSync()
})

function checkConfig(t: ExecutionContext) {
    const writtenConfig = loadConfigSync();
    if (!writtenConfig || writtenConfig === null) {
        t.fail("writtenConfig is not defined inside of checkConfig")
    }
    
    t.true(writtenConfig!.length === 1)
    t.true(writtenConfig![0].connectionName === inResponses.connectionName)
    t.true(writtenConfig![0].connectionString === inResponses.connectionString)
}

/**
 * Test creating an initial config
 */
test.skip('Initializes a config when one does not exist', async (t) => {

    const { stdout, stdin, kill } = execa(cli, ['init']);

    await delay(500)

    // Connection name
    t.is(stdout.read().toString(), questions.nameOfThisConnection)
    stdin.write(inResponses.connectionName);
    stdin.write(keys.enter)
    
    await delay(500)

    // Connection string
    t.is(stdout.read().toString(), questions.databaseConnectionStr)
    stdin.write(inResponses.connectionString)
    stdin.write(keys.enter)

    await delay(500)
    checkConfig(t)
    kill('SIGTERM', { forceKillAfterTimeout: 1000 })
});

/**
 * Test overwriting a config
 */
test.skip('Initializes a config and asks if the user wants to overwrite', async (t) => {

    let got: string = "";

    async function initializeConfig(invocationNumber: number) {
        const { stdout, stdin, kill } = execa(cli, ['init']);

        await delay(1000)

        // name
        got = stdout.read().toString()

        t.is(got, questions.nameOfThisConnection)
        await stdin.write(inResponses.connectionName);
        await stdin.write(keys.enter)

        await delay(1000)
        got = stdout.read().toString()

        // Connection string
        t.is(got, questions.databaseConnectionStr)
        await stdin.write(inResponses.connectionString)
        stdin.write(keys.enter)

        if (invocationNumber > 1) {
            await delay(500)
            got = stdout.read().toString()
            t.is(got, questions.fileAlreadyExists)

            // answer yes
            stdin.write("y")
            stdin.write(keys.enter)
        }

        await delay(1000)
        kill('SIGTERM', { forceKillAfterTimeout: 1000 })
    }

    await initializeConfig(1);
    await delay(1500)

    checkConfig(t)

    // TODO: WRITE A TEST WHERE THE NAME OF THE CONNECTION AND 
    //       CONNECTION STRING ARE DIFFERENT THAN THE ORIGINAL.
    await initializeConfig(2);
    checkConfig(t)
});
