export function getEnv(name: string): string {
    const value = process.env[name];
    if (value === undefined || value === '') {
        throw new Error(
            `Required environment variable "${name}" is not set. ` +
                `Add it to your .env file (see .env.example) or your CI secrets.`
        );
    }
    return value;
}
