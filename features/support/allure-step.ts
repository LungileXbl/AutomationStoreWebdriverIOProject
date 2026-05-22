import allureReporter from '@wdio/allure-reporter';
import { Status } from 'allure-js-commons';

export async function allureStep<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
    allureReporter.startStep(name);
    try {
        const result = await fn();
        allureReporter.endStep(Status.PASSED);
        return result;
    } catch (error) {
        allureReporter.endStep(Status.FAILED);
        throw error;
    }
}

export function allureExpectStep(description: string, passed: boolean): void {
    allureReporter.startStep(description);
    allureReporter.endStep(passed ? Status.PASSED : Status.FAILED);
}

export async function expectStep(
    description: string,
    assertion: () => void | Promise<void>
): Promise<void> {
    try {
        await assertion();
        allureExpectStep(description, true);
    } catch (error) {
        allureExpectStep(description, false);
        throw error;
    }
}
