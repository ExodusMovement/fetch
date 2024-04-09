exports.createFetchWithHeaders =
  ({ fetch, headers }) =>
  (url, opts = {}) =>
    fetch(url, {
      ...opts,
      headers: {
        ...headers,
        ...opts.headers,
      },
    })
