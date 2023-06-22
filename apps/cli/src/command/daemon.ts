import { CliCommand } from 'cilly'
import { server } from '@stayradiated/pomo-daemon'

const daemonCmd = new CliCommand('daemon')
  .withDescription('Starts the daemon')
  .withHandler(() => {
    server.start()
  })

export { daemonCmd }
