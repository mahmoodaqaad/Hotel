/**
 * Recursively converts Prisma Decimal objects to standard JavaScript numbers.
 * This is necessary because Next.js cannot serialize Decimal objects when
 * passing data from Server Components to Client Components.
 */
export function serializePrisma<T>(data: T): T {
    if (data === null || data === undefined) {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => serializePrisma(item)) as unknown as T;
    }

    // Handle Prisma Decimal
    if (data && typeof data === 'object' && 'toNumber' in data && typeof (data as { toNumber: unknown }).toNumber === 'function') {
        return (data as { toNumber: () => number }).toNumber() as unknown as T;
    }

    // Handle Date objects
    if (data instanceof Date) {
        return data.toISOString() as unknown as T;
    }

    // Handle objects
    if (data && typeof data === 'object') {
        const result = {} as Record<string, unknown>;
        const obj = data as Record<string, unknown>;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = serializePrisma(obj[key]);
            }
        }
        return result as unknown as T;
    }

    return data;
}
