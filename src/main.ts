import { server } from './server'
import { CONFIGURATIONS } from './config'
import { db } from './db'

async function main() {
  await db.connect()

  server.listen(CONFIGURATIONS.SERVER.PORT)
}

main()
