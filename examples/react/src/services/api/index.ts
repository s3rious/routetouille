async function makeCall<Data, Result>(method: string, url: string, data: Data, result: Result): Promise<Result> {
  return await new Promise((resolve, reject) => {
    console.info(`Sending \`${method}\` to \`${url}\`...`, data)

    setTimeout(() => {
      if (result instanceof Error) {
        console.info(`... unsuccessfully!`, result)
        return reject(result)
      }

      console.info(`... successfully!`, result)
      resolve(result)
    }, 1000)
  })
}

async function GET<Data, Result>(url: string, data: Data, result: Result): Promise<Result> {
  return await makeCall('GET', url, data, result)
}

async function POST<Data, Result>(url: string, data: Data, result: Result): Promise<Result> {
  return await makeCall('POST', url, data, result)
}

async function PATCH<Data, Result>(url: string, data: Data, result: Result): Promise<Result> {
  return await makeCall('PATCH', url, data, result)
}

async function DELETE<Data, Result>(url: string, data: Data, result: Result): Promise<Result> {
  return await makeCall('DELETE', url, data, result)
}

export { GET, POST, PATCH, DELETE }
