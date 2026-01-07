import { atom } from 'signia'

const clock = atom('clock', Date.now())

setInterval(() => {
  clock.set(Date.now())
}, 5000)

export { clock }
