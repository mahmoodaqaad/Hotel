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
    if (typeof data === 'object' && 'toNumber' in data && typeof (data as any).toNumber === 'function') {
        return (data as any).toNumber() as unknown as T;
    }

    // Handle Date objects
    if (data instanceof Date) {
        return data.toISOString() as unknown as T;
    }

    // Handle objects
    if (typeof data === 'object') {
        const result: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                result[key] = serializePrisma((data as any)[key]);
            }
        }
        return result as T;
    }

    return data;
}
