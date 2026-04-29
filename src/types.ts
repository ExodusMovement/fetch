export interface CreateFetchivalOptions {
  fetch: FetchLike | null
}

export interface ExperimentalCreateFetchivalOptions {
  fetch?: ExperimentalFetchLike
}

export interface FetchivalOptions extends Omit<RequestInit, 'body' | 'headers' | 'method'> {
  body?: string
  headers?: Record<string, string>
  responseAs?: 'json' | 'response' | 'text'
}

export interface ExperimentalFetchivalOptions extends FetchivalOptions {
  timeout?: number
}

export interface FetchivalError extends Error {
  response: ResponseLike
}

export interface ResponseLike {
  status: number
  statusText: string
  json(): Promise<JsonValue>
  text(): Promise<string>
}

export interface Fetchival {
  (url: UrlInput, opts?: FetchivalOptions): FetchivalClient
  fetch: FetchLike | null
}

export interface ExperimentalFetchival {
  (link: URL, opts?: ExperimentalFetchivalOptions): ExperimentalFetchivalClient
  fetch: ExperimentalFetchLike
}

export interface FetchivalClient {
  (sub: string, opts?: FetchivalOptions): FetchivalClient
  get(params?: LegacyQueryParams): Promise<FetchivalResult>
  post(data?: JsonValue): Promise<FetchivalResult>
  put(data?: JsonValue): Promise<FetchivalResult>
  patch(data?: JsonValue): Promise<FetchivalResult>
  delete(): Promise<FetchivalResult>
}

export interface ExperimentalFetchivalClient {
  (sub: string, opts?: ExperimentalFetchivalOptions): ExperimentalFetchivalClient
  head(params?: QueryParams): Promise<FetchivalResult>
  get(params?: QueryParams): Promise<FetchivalResult>
  post(data?: JsonValue): Promise<FetchivalResult>
  put(data?: JsonValue): Promise<FetchivalResult>
  patch(data?: JsonValue): Promise<FetchivalResult>
  delete(): Promise<FetchivalResult>
  method(method: ClientMethod, arg?: JsonValue | QueryParams): Promise<FetchivalResult>
}

export type ClientMethod = 'delete' | 'get' | 'head' | 'patch' | 'post' | 'put'
export type ExperimentalFetchLike = (
  input: URL,
  init?: RequestInit & { timeout?: number }
) => Promise<ResponseLike>
export type FetchivalResult = JsonValue | ResponseLike | null | string
export type FetchLike = (input: UrlInput, init?: RequestInit) => Promise<ResponseLike>
export type HttpMethod = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT'
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }
export type JsonPrimitive = boolean | null | number | string
export type LegacyQueryParams = Record<string, JsonPrimitive>
export type QueryParams = Map<string, QueryValue> | Record<string, QueryValue>
export type QueryValue = boolean | null | number | string
export type UrlInput = RequestInfo | URL | string
