export type Result<T> = {
  data: T[],
  page: number,
  limit: number,
  total: number
}
