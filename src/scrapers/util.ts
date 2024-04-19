const idGenerator = function (id: string) {
  // Takes an id and returns a 16 character string of 0x000... + id
  try {
    if (!id.match(/^[0-9]+$/)) return '0'
    return id.padStart(15, '0')
  } catch (err) {
    console.log(id)
    return 'n/a'
  }
}
let AgentArray = [
  'astra',
  'breach',
  'brimstone',
  'chamber',
  'cypher',
  'deadlock',
  'fade',
  'gekko',
  'harbor',
  'iso',
  'jett',
  'kayo',
  'killjoy',
  'neon',
  'omen',
  'phoenix',
  'raze',
  'reyna',
  'sage',
  'skye',
  'sova',
  'viper',
  'yoru',
]

fetch('https://valorant-api.com/v1/agents')
  .then((res) => res.json())
  .then((data) => {
    AgentArray = data.data
      .map((agent: any) => agent.displayName.toLowerCase().replace('/', ''))
      .sort()
    console.log('Agents Updated')
  })

// Requests the api for the given url and returns json data
export async function requestSelf<T>(path: string | string[]): Promise<T> {
  if (Array.isArray(path)) {
    const data = await Promise.all(
      path.map(async (p) => {
        const response = await fetch(
          `http://localhost:${process.env.PORT}/${p}`
        )
        return response.json()
      })
    )

    return data.map((d) => d.data) as T
  }
  const response = await fetch(`http://localhost:${process.env.PORT}/${path}`)
  const data = await response.json()

  return data.data as T
}

export { idGenerator, AgentArray }
