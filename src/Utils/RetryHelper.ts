import { Sleep } from "@ludeschersoftware/utils";

export async function retry<T>(
    task: () => Promise<T>,
    retries: number = 3,
    baseDelayMs: number = 300
): Promise<T> {
    let last_error: any;

    for (let i = 0; i < retries; i++) {
        try {
            return await task();
        } catch (err) {
            last_error = err;

            if (i < retries - 1) {
                await Sleep(baseDelayMs * Math.pow(2, i)); // 300, 600, 1200ms...
            }
        }
    }

    throw last_error;
}