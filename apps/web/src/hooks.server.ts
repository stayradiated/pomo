import { building as isBuilding } from '$app/environment'

import { onInit } from './hooks.server.init.js'

if (!isBuilding) {
  void onInit()
}
