type OmitTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>

export type { OmitTimestamps }
