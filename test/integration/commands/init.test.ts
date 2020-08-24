/**
 * 
 */
import test, { ExecutionContext } from 'ava';
import execa from 'execa';

import { loadConfigSync } from '../../../src/lib/init';
import { handleStdout, removeConfigSync } from './helpers';


const cli = `${process.cwd()}/bin/run`;

/**
 * Expected stdout messages
 */
const expected = {
    one: "Name of this connection:",
    two: "Database connection string:",
    configWritten: "Config written",
    configExists: "File already exists. Overwrite? (y/n):"
}

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

    t.true(writtenConfig.length === 1)
    t.true(writtenConfig[0].connectionName === inResponses.connectionName)
    t.true(writtenConfig[0].connectionString === inResponses.connectionString)
}

/**
 * Test creating an initial config
 */
test.serial('Initializes a config when one does not exist', async (t) => {

    const { stdout, stdin, kill } = execa(cli, ['init']);

    // Connection name
    t.true(await handleStdout(stdout) === expected.one)
    stdin.write(inResponses.connectionName);
    stdin.write("\n")


    // Connection string
    t.true(await handleStdout(stdout) === expected.two)
    stdin.write(inResponses.connectionString)
    stdin.write("\n")

    // Success
    t.true(await handleStdout(stdout) === expected.configWritten)

    checkConfig(t)
    kill('SIGTERM', { forceKillAfterTimeout: 1000 })
});

/**
 * Test overwriting a config
 */
test('Initializes a config and asks if the user wants to overwrite', async (t) => {
    let ifConditionEvaluated = false;
    let elseConditionEvaluated = false;

    t.plan(15)

    async function initializeConfig(invocationNumber: number) {
        const { stdout, stdin, kill } = execa(cli, ['init']);

        // name
        t.true(await handleStdout(stdout) === expected.one)
        await stdin.write(inResponses.connectionName);
        await stdin.write("\n")

        // Connection string
        t.true(await handleStdout(stdout) === expected.two)
        await stdin.write(inResponses.connectionString)
        await stdin.write("\n")

        if (invocationNumber === 1) {
            // Config written
            t.true(await handleStdout(stdout) === expected.configWritten)
            ifConditionEvaluated = true;
        } else {
            // Config exists
            t.true(await handleStdout(stdout) === expected.configExists)

            // answer yes
            await stdin.write("y")
            await stdin.write("\n")

            // Config exists
            t.true(await handleStdout(stdout) === expected.configWritten)
            elseConditionEvaluated = true;
        }
        
        kill('SIGTERM', { forceKillAfterTimeout: 1000 })
    }

    await initializeConfig(1);
    checkConfig(t)

    // TODO: WRITE A TEST WHERE THE NAME OF THE CONNECTION AND 
    //       CONNECTION STRING ARE DIFFERENT THAN THE ORIGINAL.
    await initializeConfig(2);
    checkConfig(t)

    // Sanity checks due to branching. t.plan assertion should 
    // catch any anomolies as well but this would help with a 
    // specific branch failure.
    t.true(ifConditionEvaluated)
    t.true(elseConditionEvaluated)
});
