var colorStatus = (status: number) => {
  const out: { [index: number]: string } = {
    7: `\x1B[35m${status}\x1B[0m`,
    5: `\x1B[31m${status}\x1B[0m`,
    4: `\x1B[33m${status}\x1B[0m`,
    3: `\x1B[36m${status}\x1B[0m`,
    2: `\x1B[32m${status}\x1B[0m`,
    1: `\x1B[32m${status}\x1B[0m`,
    0: `\x1B[33m${status}\x1B[0m`,
  }
  const calculateStatus = (status / 100) | 0
  return out[calculateStatus]
}

export interface LoggerOptions {
  cached: boolean
  crawledSites: number
}

export const logger = (logStats: LoggerOptions) => {
  return async function loggerInner(c: any, next: any): Promise<void> {
    const { method, path } = c.req
    const start = performance.now()
    console.info(`<-- ${method} ${path}`)
    await next()
    const took: number = performance.now() - start
    let tookStr: string = ''
    if (took >= 1000) tookStr = (took / 1000).toFixed(3) + 's'
    else tookStr = took.toFixed(2) + 'ms'

    if (!logStats.cached && logStats.crawledSites > 0)
      console.info(
        `    requested ${logStats.crawledSites} ${
          logStats.crawledSites > 1 ? 'sites' : 'site'
        }`
      )
    console.info(
      `--> ${method} ${path} ${colorStatus(c.res.status)} ${tookStr} ${
        logStats.cached ? '| Cached' : ''
      }`
    )
    logStats.cached = false
    logStats.crawledSites = 0
  }
}
