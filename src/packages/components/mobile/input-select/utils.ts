export function getValue<T>(value?: Array<T> | T | null) {
  return value !== undefined
    ? ((Array.isArray(value)
        ? value
        : [value].filter((v) => v != null)) as Array<T>)
    : undefined;
}
