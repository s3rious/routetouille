async function get<Data extends unknown, Result extends unknown>(
  url: string,
  data: Data,
  result: Result,
): Promise<Result> {
  console.info(`Sending \`GET\` to \`${url}\`...`, data)

  const call: Promise<Result> = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (result instanceof Error) {
        return reject(result)
      }

      resolve(result)
    }, 1000)
  })

  const success = await call

  console.info(`... successfully!`, success)

  return success
}

async function post<Data extends unknown, Result extends unknown>(
  url: string,
  data: Data,
  result: Result,
): Promise<Result> {
  console.info(`Sending \`POST\` to \`${url}\`...`, data)

  const call: Promise<Result> = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (result instanceof Error) {
        return reject(result)
      }

      resolve(result)
    }, 1000)
  })

  const success = await call

  console.info(`... successfully!`, success)

  return success
}

export { get, post }
