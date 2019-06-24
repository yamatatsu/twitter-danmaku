const inquirer = require('inquirer')
const Twitter = require('twitter')
const WebSocket = require('ws')

main()

async function main() {
  const keys = await getTwitterKeys()
  const port = await getPort()
  const keyword = await getKeyword()

  const client = new Twitter(keys)

  const wss = new WebSocket.Server({ port })
  console.info('start server', { port })

  wss.on('connection', function connection(ws) {
    console.info('connection start')
  })

  wss.broadcast = function broadcast(data) {
    let cnt = 0
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
        cnt++
      }
    })
    console.info(`broadcast for ${cnt} clients.`)
  }

  console.info('start streaming')
  client.stream('statuses/filter', { track: keyword }, (stream) => {
    stream.on('data', (event) => {
      if (!event) return
      if (event.retweeted_status) return
      if (!/javascript/i.test(event.text)) return

      const text = event.text.replace('\n', '')

      console.info(`get tweeet. "${text}"`)
      wss.broadcast(text)
    })

    stream.on('error', (error) => {
      console.error(error)
      throw error
    })
  })
}

async function getTwitterKeys() {
  const keys = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  }
  if (Object.values(keys).every(Boolean)) return keys

  return await inquirer.prompt([
    { name: 'consumer_key', type: 'password' },
    { name: 'consumer_secret', type: 'password' },
    { name: 'access_token_key', type: 'password' },
    { name: 'access_token_secret', type: 'password' },
  ])
}

async function getPort() {
  if (process.env.PORT) return process.env.PORT

  const { port } = await inquirer.prompt([
    { name: 'port', type: 'input', default: '8080' },
  ])
  return port
}

async function getKeyword() {
  const { keyword } = await inquirer.prompt([
    { name: 'keyword', type: 'input', default: 'javascript' },
  ])
  return keyword
}
