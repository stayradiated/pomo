import { version } from "$lib/constants.js";
import { json } from '@sveltejs/kit'

const GET = async () => {
  return json({ version })
}

export { GET }
