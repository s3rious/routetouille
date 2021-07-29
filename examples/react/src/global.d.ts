declare module '*.module.css' {
  const content: Record<string, string>
  export default content
}

declare module '*.module.scss' {
  const content: Record<string, string>
  export default content
}

type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never
}

type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U
