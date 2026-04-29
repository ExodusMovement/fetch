const fetchImplementation: typeof globalThis.fetch = (i, ...r) => globalThis.fetch(i, ...r)

export = fetchImplementation
