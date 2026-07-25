/**
 * Check if an optional GraphQL argument was provided by the client. An argument is absent both when
 * it is omitted and when it is sent as an explicit null, which is what the frontend does.
 * It is a type guard so the caller gets the value narrowed to its non nullable type.
 */
export const isProvided = <T>(value: T | null | undefined): value is T => value !== undefined && value !== null;
