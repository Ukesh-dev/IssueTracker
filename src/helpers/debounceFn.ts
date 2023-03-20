export const debounceFn = <T extends (...args: any[]) => unknown>(
  fn: T,
  delay: number = 200
) => {
  let timerId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
