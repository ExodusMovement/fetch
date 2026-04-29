import wretchModule = require('wretch')

const wretch = wretchModule.default

// Removes the .default property from the exported function to deconfuse bundlers
export = (url?: string, options?: WretchOptions) => wretch(url, options)

type WretchOptions = Parameters<typeof wretch>[1]
