import fetch from "node-fetch";

export function waitForHost(url, interval = 1000, attempts = 10) {
  const sleep = ms => new Promise(r => setTimeout(r, ms))

  let count = 1

  return new Promise(async (resolve, reject) => {
    while (count < attempts) {

      await sleep(interval)

      try {
        const response = await fetch(url)
        if (response.ok) {
          if (response.status === 200) {
            resolve()
            break
          }
        } else {
          count++
        }
      } catch {
        count++
        console.log(`Still down, trying ${count} of ${attempts}`)
      }
    }

    reject(new Error(`Server is down: ${count} attempts tried`))
  })
}
