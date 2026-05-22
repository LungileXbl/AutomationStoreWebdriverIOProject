import type { Frameworks } from '@wdio/types';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import allureReporter from '@wdio/allure-reporter';
import { browser } from '@wdio/globals';
import 'dotenv/config';
import { getEnv } from './features/support/env.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reportsDir = path.join(__dirname, 'reports');
const screenshotsDir = path.join(reportsDir, 'screenshots');

for (const dir of [reportsDir, screenshotsDir]) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: ['./features/specs/**/*.feature'],
    exclude: [],
    maxInstances: 10,
    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: [
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--window-size=1920,1080',
                    '--disable-gpu'
                ]
            }
        }
    ],
    logLevel: 'warn',
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    baseUrl: getEnv('BASE_URL'),
    framework: 'cucumber',
    cucumberOpts: {
        require: ['./features/step-definitions/**/*.ts'],
        strict: true,
        timeout: 60000,
        failAmbiguousDefinitions: true
    },
    reporters: [
        [
            'allure',
            {
                outputDir: path.join(reportsDir, 'allure-results'),
                useCucumberStepReporter: true,
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: true,
                addConsoleLogs: true,
                reportedEnvironmentVars: {
                    NODE_VERSION: process.version,
                    BROWSER: 'chrome'
                }
            }
        ]
    ],

    async beforeScenario(world: unknown, _context: unknown) {
        await allureReporter.addStep('Preparing test scenario');

        const cucumberWorld = world as {
            pickle?: {
                name?: string;
                tags?: Array<{ name?: string }>;
            };
        };

        const scenarioName = cucumberWorld?.pickle?.name || 'unknown scenario';
        const tags = cucumberWorld?.pickle?.tags?.map((t) => t.name ?? '').filter(Boolean) || [];
        const preserveSession = tags.includes('@loggedIn');
        const scenarioContext = [
            `Starting scenario: "${scenarioName}"`,
            `Tags: ${tags.join(', ')} | preserveSession=${preserveSession}`
        ].join('\n');

        console.info(`\n${scenarioContext}`);
        await allureReporter.addAttachment('Scenario Context', scenarioContext, 'text/plain');
        await browser.deleteCookies();
    },

    async afterStep(
        step: Frameworks.PickleStep,
        _scenario: unknown,
        result: Frameworks.PickleResult
    ) {
        if (result.passed) {
            return;
        }

        const stepName = step.text ?? 'unknown step';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safeStep = stepName.replace(/[^a-z0-9-_]+/gi, '_').slice(0, 80);
        const screenshotPath = path.join(screenshotsDir, `FAILED_${safeStep}_${timestamp}.png`);

        try {
            const screenshot = await browser.takeScreenshot();
            const buffer = Buffer.from(screenshot, 'base64');
            fs.writeFileSync(screenshotPath, buffer);
            await allureReporter.addAttachment('Failure Screenshot', buffer, 'image/png');
            console.info(`Screenshot saved to: ${screenshotPath}`);
        } catch (err) {
            console.warn(`Failed to capture screenshot: ${(err as Error).message}`);
        }

        if (result.error) {
            await allureReporter.addAttachment('Error Details', result.error, 'text/plain');
        }

        try {
            const url = await browser.getUrl();
            await allureReporter.addAttachment('URL at failure', url, 'text/plain');
        } catch (err) {
            console.warn(`Failed to capture URL: ${(err as Error).message}`);
        }
    },

    async afterScenario(_world: unknown, _context: unknown) {
        try {
            await browser.execute(() => {
                // @ts-expect-error: window is defined in browser context
                window.localStorage.clear();
                // @ts-expect-error: window is defined in browser context
                window.sessionStorage.clear();
            });
        } catch (err) {
            console.warn('Failed to clear storage:', (err as Error).message);
        }

        await allureReporter.addStep('Finished test scenario');
    }
};
