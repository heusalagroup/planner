import { parseNonEmptyString } from "../io/hyperify/core/types/String";

export const TEST_API_URL : string = parseNonEmptyString(process?.env?.TEST_API_URL) ?? 'http://localhost:3001';
