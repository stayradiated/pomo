const streamList = [
  {
    "id": "e52d778b-1500-4405-b43a-aff4910020af",
    "name": "country",
    "createdAt": "2023-06-03 06:17:00",
    "updatedAt": null
  },
  {
    "id": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "name": "location",
    "createdAt": "2023-06-03 06:18:22",
    "updatedAt": null
  },
  {
    "id": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "name": "project",
    "createdAt": "2023-06-03 06:20:40",
    "updatedAt": null
  },
  {
    "id": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "name": "task",
    "createdAt": "2023-06-03 06:20:40",
    "updatedAt": null
  },
  {
    "id": "e3a36988-d98d-4438-91c9-52e18901c9ab",
    "name": "Strava",
    "createdAt": "2023-06-11 11:11:44",
    "updatedAt": null
  }
]

 const pointList = [
  {
    "id": "35b77d87-0a0d-486d-a11f-0ae67bdcaa13",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "antlers",
    "startedAt": "2023-06-04T06:46:02.723Z",
    "createdAt": "2023-06-04 06:46:02",
    "updatedAt": "2023-06-04T07:22:56.222Z"
  },
  {
    "id": "0e40d322-66b4-4df3-afe9-b4fd7d9b5ce2",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "To get antlers building via Github Actions.",
    "startedAt": "2023-06-04T06:46:02.758Z",
    "createdAt": "2023-06-04 06:46:02",
    "updatedAt": "2023-06-04T07:22:56.259Z"
  },
  {
    "id": "d1933056-c1e0-4c65-bda6-5b34c673d71a",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "// Marika's Apartment\nThe Sunday Marche",
    "startedAt": "2023-06-04T07:22:56.186Z",
    "createdAt": "2023-06-04 07:22:56",
    "updatedAt": "2023-06-04T09:32:24.648Z"
  },
  {
    "id": "7001ffe7-4ff8-4687-a1e7-3ee453813464",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "// antlers",
    "startedAt": "2023-06-04T07:22:56.222Z",
    "createdAt": "2023-06-04 07:22:56",
    "updatedAt": "2023-06-04T09:32:24.688Z"
  },
  {
    "id": "0a5d6317-38ab-40fa-9221-afef27a65c7a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "// To get antlers building via Github Actions.",
    "startedAt": "2023-06-04T07:22:56.259Z",
    "createdAt": "2023-06-04 07:22:56",
    "updatedAt": "2023-06-04T09:32:24.727Z"
  },
  {
    "id": "c7709448-164f-4b6a-b88d-9ffcbebed5f6",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Marika's Apartment",
    "startedAt": "2023-06-04T09:32:24.648Z",
    "createdAt": "2023-06-04 09:32:24",
    "updatedAt": "2023-06-05T08:44:32.487Z"
  },
  {
    "id": "6ff811b7-5d86-44df-9b4b-99b4d06ee78f",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "antlers",
    "startedAt": "2023-06-04T09:32:24.688Z",
    "createdAt": "2023-06-04 09:32:24",
    "updatedAt": "2023-06-05T08:10:04.329Z"
  },
  {
    "id": "db0ea35a-38c1-4c02-84e0-877a41d9b12c",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "To get antlers building via Github Actions.",
    "startedAt": "2023-06-04T09:32:24.727Z",
    "createdAt": "2023-06-04 09:32:24",
    "updatedAt": "2023-06-05T08:10:04.378Z"
  },
  {
    "id": "80ccf482-9478-4840-9bbf-05e8cbb1c2b5",
    "streamId": "e3a36988-d98d-4438-91c9-52e18901c9ab",
    "value": "Morning Walk",
    "startedAt": "2023-06-05T06:19:40.000Z",
    "createdAt": "2023-06-11 11:15:07",
    "updatedAt": null
  },
  {
    "id": "27a44d6f-81d9-4ac5-9d3d-ab5152b04f67",
    "streamId": "e3a36988-d98d-4438-91c9-52e18901c9ab",
    "value": "",
    "startedAt": "2023-06-05T07:32:06.000Z",
    "createdAt": "2023-06-11 11:15:07",
    "updatedAt": null
  },
  {
    "id": "422921c0-a86b-4bcd-8140-35efd45a0f98",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn",
    "startedAt": "2023-06-05T08:10:04.329Z",
    "createdAt": "2023-06-05 08:10:04",
    "updatedAt": "2023-06-05T08:44:32.528Z"
  },
  {
    "id": "fe82f3d4-9157-4c79-a41d-a08d3a719312",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Catch up slack messages and plan tasks for today",
    "startedAt": "2023-06-05T08:10:04.378Z",
    "createdAt": "2023-06-05 08:10:04",
    "updatedAt": "2023-06-05T08:44:32.568Z"
  },
  {
    "id": "29363655-9985-47e0-bfd2-f9ceb29ad8ac",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Walking to the Cafe",
    "startedAt": "2023-06-05T08:44:32.487Z",
    "createdAt": "2023-06-05 08:44:32",
    "updatedAt": "2023-06-05T09:14:51.794Z"
  },
  {
    "id": "2e1c8833-2c0b-4240-8e49-b58981a72622",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "// Runn",
    "startedAt": "2023-06-05T08:44:32.528Z",
    "createdAt": "2023-06-05 08:44:32",
    "updatedAt": "2023-06-05T09:14:51.835Z"
  },
  {
    "id": "c041a4c4-0556-44eb-8b5f-26175f9de698",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "// Catch up slack messages and plan tasks for today",
    "startedAt": "2023-06-05T08:44:32.568Z",
    "createdAt": "2023-06-05 08:44:32",
    "updatedAt": "2023-06-05T09:14:51.874Z"
  },
  {
    "id": "9a08d0eb-096b-4871-8726-4dc47b7d37c3",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Café 4e Vague",
    "startedAt": "2023-06-05T09:14:51.794Z",
    "createdAt": "2023-06-05 09:14:51",
    "updatedAt": "2023-06-05T10:34:06.215Z"
  },
  {
    "id": "6f71b750-244f-4ba1-a6c5-5f98552b6ee6",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn",
    "startedAt": "2023-06-05T09:14:51.835Z",
    "createdAt": "2023-06-05 09:14:51",
    "updatedAt": "2023-06-05T09:33:55.777Z"
  },
  {
    "id": "558575cd-56fd-49e1-bd3e-42c72886f5b6",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Check in with Francesco and make sure he isn't blocked",
    "startedAt": "2023-06-05T09:14:51.874Z",
    "createdAt": "2023-06-05 09:14:51",
    "updatedAt": "2023-06-05T09:17:43.097Z"
  },
  {
    "id": "c99c8d86-2b0f-482d-af50-024846b1d945",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Reply to Carter's questions\n\\[ ] Check in with Francesco and make sure he isn't blocked",
    "startedAt": "2023-06-05T09:17:43.097Z",
    "createdAt": "2023-06-05 09:17:43",
    "updatedAt": "2023-06-05T09:23:05.845Z"
  },
  {
    "id": "bf86fc1a-8362-4241-9e59-7bb65c073098",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Reply to Tim's suggestion about HRS\n\\[ ] Check in with Francesco and make sure he isn't blocked\n\\[ ] Reply to Priscilla's message",
    "startedAt": "2023-06-05T09:23:05.845Z",
    "createdAt": "2023-06-05 09:23:05",
    "updatedAt": "2023-06-05T09:25:29.051Z"
  },
  {
    "id": "9db25823-3849-44c7-85a9-2d759e428890",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Reply to Priscilla's message\n\\[ ] Check in with Francesco and make sure he isn't blocked",
    "startedAt": "2023-06-05T09:25:29.051Z",
    "createdAt": "2023-06-05 09:25:29",
    "updatedAt": "2023-06-05T09:33:55.813Z"
  },
  {
    "id": "e4bc21bd-74bd-4916-b40f-118ff1b8258f",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn | Integration",
    "startedAt": "2023-06-05T09:33:55.777Z",
    "createdAt": "2023-06-05 09:33:55",
    "updatedAt": "2023-06-05T10:34:06.252Z"
  },
  {
    "id": "1e118d17-b1b3-4ea4-8333-d8170ef050d8",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Update linear tickets, add more details to those with the #draft label.",
    "startedAt": "2023-06-05T09:33:55.813Z",
    "createdAt": "2023-06-05 09:33:55",
    "updatedAt": "2023-06-05T10:34:06.288Z"
  },
  {
    "id": "c3bcff58-1a92-4964-be1b-0b8a7a6665cb",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Travelling around the city",
    "startedAt": "2023-06-05T10:34:06.215Z",
    "createdAt": "2023-06-05 10:34:06",
    "updatedAt": "2023-06-05T11:18:22.382Z"
  },
  {
    "id": "692e3a9c-19b4-4677-a00b-ade03cdf1ef7",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n// Runn | Integration",
    "startedAt": "2023-06-05T10:34:06.252Z",
    "createdAt": "2023-06-05 10:34:06",
    "updatedAt": "2023-06-05T11:18:22.419Z"
  },
  {
    "id": "66c24319-d599-44ad-a578-2e7461e1cdf3",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Need to get a copy of the bike shed key made for Marika's apartment building.\n// Update linear tickets, add more details to those with the #draft label.",
    "startedAt": "2023-06-05T10:34:06.288Z",
    "createdAt": "2023-06-05 10:34:06",
    "updatedAt": "2023-06-05T11:18:22.454Z"
  },
  {
    "id": "582d55a3-dfc8-4571-a5e2-46c279477aa6",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "L'Aclmeiste",
    "startedAt": "2023-06-05T11:18:22.382Z",
    "createdAt": "2023-06-05 11:18:22",
    "updatedAt": "2023-06-05T12:39:57.330Z"
  },
  {
    "id": "39aca824-332d-4c92-a3af-d6b76314fea3",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn | Integration",
    "startedAt": "2023-06-05T11:18:22.419Z",
    "createdAt": "2023-06-05 11:18:22",
    "updatedAt": "2023-06-05T12:39:57.370Z"
  },
  {
    "id": "9e0d4828-b1d7-48e5-9f97-62eb02ffeb6d",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Update linear tickets, add more details to those with the #draft label.",
    "startedAt": "2023-06-05T11:18:22.454Z",
    "createdAt": "2023-06-05 11:18:22",
    "updatedAt": "2023-06-05T12:39:57.409Z"
  },
  {
    "id": "780cdb30-a534-4080-9367-dca46d3bb219",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City",
    "startedAt": "2023-06-05T12:39:57.330Z",
    "createdAt": "2023-06-05 12:39:57",
    "updatedAt": "2023-06-05T13:22:20.342Z"
  },
  {
    "id": "83053e8a-bdd9-4855-9b3f-1801c089fffa",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life",
    "startedAt": "2023-06-05T12:39:57.370Z",
    "createdAt": "2023-06-05 12:39:57",
    "updatedAt": "2023-06-05T13:22:20.383Z"
  },
  {
    "id": "6fdeaff7-f83d-476c-b735-3c1294393260",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Walk back to Marika's apartment, pick up something for lunch on the way.",
    "startedAt": "2023-06-05T12:39:57.409Z",
    "createdAt": "2023-06-05 12:39:57",
    "updatedAt": "2023-06-05T13:22:20.422Z"
  },
  {
    "id": "9681e124-6c2c-40ae-ac25-0d330ddb0558",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Jardin Public",
    "startedAt": "2023-06-05T13:22:20.342Z",
    "createdAt": "2023-06-05 13:22:20",
    "updatedAt": "2023-06-05T14:07:53.244Z"
  },
  {
    "id": "19b296dc-d7e4-43f4-95d4-7319784cd618",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn | Integrations",
    "startedAt": "2023-06-05T13:22:20.383Z",
    "createdAt": "2023-06-05 13:22:20",
    "updatedAt": "2023-06-05T14:07:53.280Z"
  },
  {
    "id": "92749de5-0128-440d-af71-1b43102ba85d",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Publish a PR with my prototype of the \"Selective Sync\" modal",
    "startedAt": "2023-06-05T13:22:20.422Z",
    "createdAt": "2023-06-05 13:22:20",
    "updatedAt": "2023-06-05T14:07:53.317Z"
  },
  {
    "id": "ae225a16-0809-480b-be07-1a30320a4803",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City",
    "startedAt": "2023-06-05T14:07:53.244Z",
    "createdAt": "2023-06-05 14:07:53",
    "updatedAt": "2023-06-05T15:19:59.813Z"
  },
  {
    "id": "0b57465b-e4d8-4089-894c-d34a9a6b3600",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n// Runn | Integrations",
    "startedAt": "2023-06-05T14:07:53.280Z",
    "createdAt": "2023-06-05 14:07:53",
    "updatedAt": "2023-06-05T15:19:59.849Z"
  },
  {
    "id": "e68309f1-6331-41db-a942-248284bee2a6",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Walking back to Marika's apartment",
    "startedAt": "2023-06-05T14:07:53.317Z",
    "createdAt": "2023-06-05 14:07:53",
    "updatedAt": "2023-06-05T15:19:59.884Z"
  },
  {
    "id": "65623d04-bb78-4add-becb-6045069a5d65",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Marika's Apartment",
    "startedAt": "2023-06-05T15:19:59.813Z",
    "createdAt": "2023-06-05 15:19:59",
    "updatedAt": "2023-06-05T16:59:15.200Z"
  },
  {
    "id": "189feb8e-8cea-4665-ba9a-2e02a89427dd",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn | Integrations",
    "startedAt": "2023-06-05T15:19:59.849Z",
    "createdAt": "2023-06-05 15:19:59",
    "updatedAt": "2023-06-05T16:29:37.008Z"
  },
  {
    "id": "8629f15f-dccf-4460-9f98-081e56758165",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Figuring out what to work on",
    "startedAt": "2023-06-05T15:19:59.884Z",
    "createdAt": "2023-06-05 15:19:59",
    "updatedAt": "2023-06-05T15:24:05.512Z"
  },
  {
    "id": "57958ec1-f6ff-4b3b-affb-9991d898e8df",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Fix linting error in PR #16712",
    "startedAt": "2023-06-05T15:24:05.512Z",
    "createdAt": "2023-06-05 15:24:05",
    "updatedAt": "2023-06-05T15:26:53.075Z"
  },
  {
    "id": "a5300875-dc4b-4703-b5cc-6a56a9dc911c",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Review Francesco's PR #11659",
    "startedAt": "2023-06-05T15:26:53.075Z",
    "createdAt": "2023-06-05 15:26:53",
    "updatedAt": "2023-06-05T16:29:37.048Z"
  },
  {
    "id": "8610266e-268e-4ee1-8258-59f51048837e",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n// Runn | Integrations",
    "startedAt": "2023-06-05T16:29:37.008Z",
    "createdAt": "2023-06-05 16:29:37",
    "updatedAt": "2023-06-05T16:39:23.294Z"
  },
  {
    "id": "12a6b498-f954-46f2-9a4f-fa7043bb88f8",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Helping Marika sell her table\n// Review Francesco's PR #11659",
    "startedAt": "2023-06-05T16:29:37.048Z",
    "createdAt": "2023-06-05 16:29:37",
    "updatedAt": "2023-06-05T16:39:23.330Z"
  },
  {
    "id": "2531780c-490b-4b74-af8d-2dc912ef17e2",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn | Integrations",
    "startedAt": "2023-06-05T16:39:23.294Z",
    "createdAt": "2023-06-05 16:39:23",
    "updatedAt": "2023-06-05T16:59:15.237Z"
  },
  {
    "id": "de3483ea-33ef-4fd7-a69c-8552dfca592a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Review Francesco's PR #11659",
    "startedAt": "2023-06-05T16:39:23.330Z",
    "createdAt": "2023-06-05 16:39:23",
    "updatedAt": "2023-06-05T16:59:15.274Z"
  },
  {
    "id": "1387054e-a7a7-46fe-8700-e27b824044d0",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Auchan\n// Marika's Apartment",
    "startedAt": "2023-06-05T16:59:15.200Z",
    "createdAt": "2023-06-05 16:59:15",
    "updatedAt": "2023-06-05T17:47:36.062Z"
  },
  {
    "id": "71eabf0e-2a9a-44bd-a333-6885912418fd",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Grocery Shopping\n// Runn | Integrations",
    "startedAt": "2023-06-05T16:59:15.237Z",
    "createdAt": "2023-06-05 16:59:15",
    "updatedAt": "2023-06-05T17:47:36.101Z"
  },
  {
    "id": "2689c407-23e4-4e88-86ad-3b3b14415689",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Pick up some cardboard for wrapping tables + stuff for dinner\n// Review Francesco's PR #11659",
    "startedAt": "2023-06-05T16:59:15.274Z",
    "createdAt": "2023-06-05 16:59:15",
    "updatedAt": "2023-06-05T17:47:36.138Z"
  },
  {
    "id": "da06fa6e-aa34-4ea8-bdfd-5e7e48b171fd",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Marika's Apartment",
    "startedAt": "2023-06-05T17:47:36.062Z",
    "createdAt": "2023-06-05 17:47:36",
    "updatedAt": "2023-06-06T12:02:25.407Z"
  },
  {
    "id": "0ab56a31-3174-42a8-ab91-c56153fb748b",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn | Integrations",
    "startedAt": "2023-06-05T17:47:36.101Z",
    "createdAt": "2023-06-05 17:47:36",
    "updatedAt": "2023-06-05T18:23:32.911Z"
  },
  {
    "id": "7be58c6f-d060-42e6-93d6-b89c72a62626",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Review Francesco's PR #11659",
    "startedAt": "2023-06-05T17:47:36.138Z",
    "createdAt": "2023-06-05 17:47:36",
    "updatedAt": "2023-06-05T18:01:45.490Z"
  },
  {
    "id": "87a694c5-cdd6-466d-a753-f4e8eead4092",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Handover",
    "startedAt": "2023-06-05T18:01:45.490Z",
    "createdAt": "2023-06-05 18:01:45",
    "updatedAt": "2023-06-05T18:23:32.950Z"
  },
  {
    "id": "f768f4c0-17b9-41f8-938c-8177dba16a82",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n// Runn | Integrations",
    "startedAt": "2023-06-05T18:23:32.911Z",
    "createdAt": "2023-06-05 18:23:32",
    "updatedAt": "2023-06-06T05:17:57.877Z"
  },
  {
    "id": "25041e3f-c8a9-4994-b93e-e714c4392e1a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Cooking dinner with Marika",
    "startedAt": "2023-06-05T18:23:32.950Z",
    "createdAt": "2023-06-05 18:23:32",
    "updatedAt": "2023-06-06T05:17:57.917Z"
  },
  {
    "id": "78994e6c-713e-4ddf-bfe1-f8dc65c8d273",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Pomo\n// Life\n// Runn | Integrations",
    "startedAt": "2023-06-06T05:17:57.877Z",
    "createdAt": "2023-06-06 05:17:57",
    "updatedAt": "2023-06-06T06:13:24.540Z"
  },
  {
    "id": "9b3b4add-e953-43dd-8012-b491f41f0cdc",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Improve parsing of status doc.\nShouldn't need to walk the tree - just do a shallow loop through the children\nof the root node.\nIs there a way to preserve the original text?\nMaybe markdown is too much.",
    "startedAt": "2023-06-06T05:17:57.917Z",
    "createdAt": "2023-06-06 05:17:57",
    "updatedAt": "2023-06-06T06:13:24.575Z"
  },
  {
    "id": "56c19e41-614a-4c69-8917-f58beca6d3c9",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn",
    "startedAt": "2023-06-06T06:13:24.540Z",
    "createdAt": "2023-06-06 06:13:24",
    "updatedAt": "2023-06-06T07:51:21.518Z"
  },
  {
    "id": "3ad40b7c-0a8e-472e-9cae-a8f1c949da87",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Virtual coffee with Andria.Plus helping her out with writing tests for a node endpoint.",
    "startedAt": "2023-06-06T06:13:24.575Z",
    "createdAt": "2023-06-06 06:13:24",
    "updatedAt": "2023-06-06T07:51:21.558Z"
  },
  {
    "id": "57b6909b-b4b4-4f3b-9bb9-c744d99973d6",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life",
    "startedAt": "2023-06-06T07:27:00.000Z",
    "createdAt": "2023-06-06 07:51:21",
    "updatedAt": "2023-06-06T07:51:35.205Z"
  },
  {
    "id": "9f07fbfd-e4c2-4228-a739-765e8ce453f4",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Cleaning up the apartment before Marika's landlord gets here",
    "startedAt": "2023-06-06T07:27:00.000Z",
    "createdAt": "2023-06-06 07:51:21",
    "updatedAt": "2023-06-06T07:51:35.241Z"
  },
  {
    "id": "1083abe9-6bdb-454c-ad37-583dab5a72d5",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn",
    "startedAt": "2023-06-06T07:51:26.823Z",
    "createdAt": "2023-06-06 07:51:35",
    "updatedAt": "2023-06-06T10:43:16.916Z"
  },
  {
    "id": "443edc79-12db-4fd6-b892-4a1f7a1e4412",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Planning my day",
    "startedAt": "2023-06-06T07:51:26.823Z",
    "createdAt": "2023-06-06 07:51:35",
    "updatedAt": "2023-06-06T08:09:34.952Z"
  },
  {
    "id": "0369ce84-bc9a-4d5c-bc75-5ca364522f0a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Replying to Francesco's comments on PR #11659",
    "startedAt": "2023-06-06T08:04:15.977Z",
    "createdAt": "2023-06-06 08:09:34",
    "updatedAt": "2023-06-06T08:12:21.003Z"
  },
  {
    "id": "0136448e-2bf0-4b3e-8613-cb5d8c60bf6a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Replying to Francesco's comments on PR #11660",
    "startedAt": "2023-06-06T08:10:14.440Z",
    "createdAt": "2023-06-06 08:12:21",
    "updatedAt": "2023-06-06T08:12:46.126Z"
  },
  {
    "id": "c05d8a64-f7a0-4714-bf54-150a00b7d556",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Raise a PR to remove any useCallback hooks from the Integrations code",
    "startedAt": "2023-06-06T08:12:22.511Z",
    "createdAt": "2023-06-06 08:12:46",
    "updatedAt": "2023-06-06T08:34:26.102Z"
  },
  {
    "id": "9cac446c-d16f-42b0-841b-23dc072ef6fd",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Planning out what to work on next",
    "startedAt": "2023-06-06T08:34:02.135Z",
    "createdAt": "2023-06-06 08:34:26",
    "updatedAt": "2023-06-06T09:07:56.980Z"
  },
  {
    "id": "8b6fd782-ccee-42eb-8c92-382fcebb5921",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Figure out why my `runn rs` command keeps getting stuck",
    "startedAt": "2023-06-06T09:07:33.630Z",
    "createdAt": "2023-06-06 09:07:56",
    "updatedAt": "2023-06-06T09:20:45.792Z"
  },
  {
    "id": "648b760d-8181-41d1-b471-b5bb9c119660",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Create PR for updating the `docker-compose.dev.yml` file",
    "startedAt": "2023-06-06T09:20:32.052Z",
    "createdAt": "2023-06-06 09:20:45",
    "updatedAt": "2023-06-06T09:26:16.014Z"
  },
  {
    "id": "f8e235e4-8448-4d4f-b42d-38ddddd47d62",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Review Francesco's PR #11659",
    "startedAt": "2023-06-06T09:26:05.458Z",
    "createdAt": "2023-06-06 09:26:16",
    "updatedAt": "2023-06-06T09:39:22.126Z"
  },
  {
    "id": "f08c532c-dab0-4a27-872f-0ac261d69edf",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Create PR for FAST-1636🤖 [Back-End] Refactor to only calculate contract cost when config exists",
    "startedAt": "2023-06-06T09:39:00.765Z",
    "createdAt": "2023-06-06 09:39:22",
    "updatedAt": "2023-06-06T10:10:30.998Z"
  },
  {
    "id": "cc19cf85-08e0-413d-aaa5-604143e9b4e2",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Create PR for FAST-1640👥 [Front-End] Remove Sync Config Modal",
    "startedAt": "2023-06-06T10:00:08.648Z",
    "createdAt": "2023-06-06 10:10:31",
    "updatedAt": "2023-06-06T10:33:22.066Z"
  },
  {
    "id": "7fb3fe48-195e-40e1-b152-7c38ab5364ca",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Write PR description for PR #11672",
    "startedAt": "2023-06-06T10:33:03.420Z",
    "createdAt": "2023-06-06 10:33:22",
    "updatedAt": "2023-06-06T10:43:16.970Z"
  },
  {
    "id": "77773e7b-2977-4543-ba1b-c58c33b2560e",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n// Runn",
    "startedAt": "2023-06-06T10:43:04.906Z",
    "createdAt": "2023-06-06 10:43:16",
    "updatedAt": "2023-06-06T12:02:25.459Z"
  },
  {
    "id": "fc1585b0-414b-430a-8763-deebc18dca77",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "// Write PR description for PR #11672",
    "startedAt": "2023-06-06T10:43:04.906Z",
    "createdAt": "2023-06-06 10:43:16",
    "updatedAt": "2023-06-06T12:02:25.509Z"
  },
  {
    "id": "a3b72a73-92bc-467e-bb3c-e7db99289f91",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Café Soukke",
    "startedAt": "2023-06-06T12:01:47.325Z",
    "createdAt": "2023-06-06 12:02:25",
    "updatedAt": "2023-06-06T15:02:01.117Z"
  },
  {
    "id": "c20ebdb6-bd8f-4571-b706-90d407c5e80e",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn",
    "startedAt": "2023-06-06T12:01:47.325Z",
    "createdAt": "2023-06-06 12:02:25",
    "updatedAt": "2023-06-06T15:02:01.170Z"
  },
  {
    "id": "4c02c6d1-3285-4963-b8f3-5e1973e6a207",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Reply to Francesco's questions about how to build the front-end",
    "startedAt": "2023-06-06T12:01:47.325Z",
    "createdAt": "2023-06-06 12:02:25",
    "updatedAt": "2023-06-06T12:08:33.173Z"
  },
  {
    "id": "0f8ca517-1cdc-41b1-8cf2-507c54a1a6e0",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Create a ticket for displaying the sync status on the front-end",
    "startedAt": "2023-06-06T12:08:23.201Z",
    "createdAt": "2023-06-06 12:08:33",
    "updatedAt": "2023-06-06T12:18:44.220Z"
  },
  {
    "id": "2fbf955e-ab91-43da-a81f-7a58fdac185b",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Update my draft PR descriptions and get them ready for review",
    "startedAt": "2023-06-06T12:18:16.251Z",
    "createdAt": "2023-06-06 12:18:44",
    "updatedAt": "2023-06-06T12:32:30.893Z"
  },
  {
    "id": "3212eae8-6cca-4cda-94b2-fa469ea0e6de",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Experiment with showing Live Sync Progress",
    "startedAt": "2023-06-06T12:32:21.550Z",
    "createdAt": "2023-06-06 12:32:30",
    "updatedAt": "2023-06-06T13:44:23.543Z"
  },
  {
    "id": "568dbccf-d0e4-4af3-896a-8103c92d49a8",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Review Francesco's PR #11676\n\n> feat(integrations): Show sync status modal when adding an integration",
    "startedAt": "2023-06-06T13:44:02.472Z",
    "createdAt": "2023-06-06 13:44:23",
    "updatedAt": "2023-06-06T15:02:01.233Z"
  },
  {
    "id": "a5976fd7-84df-40c5-9e6b-cef60fa83460",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City",
    "startedAt": "2023-06-06T15:01:44.744Z",
    "createdAt": "2023-06-06 15:02:01",
    "updatedAt": "2023-06-06T15:28:11.541Z"
  },
  {
    "id": "2cc58e60-cad9-47f5-8a60-2fe0aa131503",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Runn -->",
    "startedAt": "2023-06-06T15:01:44.744Z",
    "createdAt": "2023-06-06 15:02:01",
    "updatedAt": "2023-06-06T15:28:11.595Z"
  },
  {
    "id": "c3d93802-9349-44cf-9819-d11068e44391",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Walking back to Marika's place\n\n<!-- Review Francesco's PR #11676 -->\n\n<!-- > feat(integrations): Show sync status modal when adding an integration -->",
    "startedAt": "2023-06-06T15:01:44.744Z",
    "createdAt": "2023-06-06 15:02:01",
    "updatedAt": "2023-06-06T15:28:11.646Z"
  },
  {
    "id": "ba48f077-5f12-4929-8dd8-c3fb91401043",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Marika's Apartment",
    "startedAt": "2023-06-06T15:27:56.933Z",
    "createdAt": "2023-06-06 15:28:11",
    "updatedAt": "2023-06-07T06:48:20.498Z"
  },
  {
    "id": "6cd78e04-334c-4a55-b7e2-0d0acec3b0cd",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn",
    "startedAt": "2023-06-06T15:27:56.933Z",
    "createdAt": "2023-06-06 15:28:11",
    "updatedAt": "2023-06-06T15:43:02.589Z"
  },
  {
    "id": "9867ca1d-f368-438c-90ae-53e3406df84a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Review Francesco's PR #11676\n\n> feat(integrations): Show sync status modal when adding an integration",
    "startedAt": "2023-06-06T15:27:56.933Z",
    "createdAt": "2023-06-06 15:28:11",
    "updatedAt": "2023-06-06T15:43:02.627Z"
  },
  {
    "id": "f21578e3-d4bc-41fd-b534-a7315789d62c",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Pomo\n\n<!-- Runn -->",
    "startedAt": "2023-06-06T15:42:28.334Z",
    "createdAt": "2023-06-06 15:43:02",
    "updatedAt": "2023-06-06T15:48:33.870Z"
  },
  {
    "id": "e5fe4b20-cc0a-4971-9dfe-9c0b4291a114",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Add support for showing how many hours have been worked today",
    "startedAt": "2023-06-06T15:42:28.334Z",
    "createdAt": "2023-06-06 15:43:02",
    "updatedAt": "2023-06-06T15:48:33.908Z"
  },
  {
    "id": "b1a62bed-76cb-49b5-9951-19c5ebce4c9f",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Running\n\n<!-- Runn -->",
    "startedAt": "2023-06-06T15:47:58.930Z",
    "createdAt": "2023-06-06 15:48:33",
    "updatedAt": "2023-06-06T17:13:04.646Z"
  },
  {
    "id": "b23bb99b-b2c4-4a38-9bab-8009a9a7b9e3",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Go for a run around Bordeaux\n\n<!-- Handover -->",
    "startedAt": "2023-06-06T15:47:58.930Z",
    "createdAt": "2023-06-06 15:48:33",
    "updatedAt": "2023-06-06T17:13:04.687Z"
  },
  {
    "id": "ab5d743d-1eb5-41bb-8870-47da909b081e",
    "streamId": "e3a36988-d98d-4438-91c9-52e18901c9ab",
    "value": "Evening Run",
    "startedAt": "2023-06-06T15:56:29.000Z",
    "createdAt": "2023-06-11 11:15:07",
    "updatedAt": null
  },
  {
    "id": "1ee12316-08d7-4f74-8a35-466d33e5bbae",
    "streamId": "e3a36988-d98d-4438-91c9-52e18901c9ab",
    "value": "",
    "startedAt": "2023-06-06T16:55:08.000Z",
    "createdAt": "2023-06-11 11:15:07",
    "updatedAt": null
  },
  {
    "id": "53ce354e-d0a7-4fd4-8a86-0e3f378788fc",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Runn -->",
    "startedAt": "2023-06-06T17:12:35.384Z",
    "createdAt": "2023-06-06 17:13:04",
    "updatedAt": "2023-06-06T18:41:19.371Z"
  },
  {
    "id": "46816fc4-24ed-4712-bd4a-69c57a6fb339",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Prepare a quiche for dinner.\n\n- Find a recipe\n- Purchase ingredients\n- Make quiche!\n\n<!-- Handover -->",
    "startedAt": "2023-06-06T17:12:35.384Z",
    "createdAt": "2023-06-06 17:13:04",
    "updatedAt": "2023-06-06T18:41:19.407Z"
  },
  {
    "id": "398dad17-e654-4be7-beba-762b78eb18f2",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Pomo\n\n<!-- Life -->\n\n<!-- Runn -->",
    "startedAt": "2023-06-06T18:34:27.186Z",
    "createdAt": "2023-06-06 18:41:19",
    "updatedAt": "2023-06-06T18:42:54.671Z"
  },
  {
    "id": "1c5f8297-5bb9-41cf-a39e-efdd284c4256",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Add a way to filter the `pomo log` command to just a certain stream.\n\n<!-- Prepare a quiche for dinner. -->\n\n<!--  -->\n\n<!-- - Find a recipe -->\n\n<!-- - Purchase ingredients -->\n\n<!-- - Make quiche! -->\n\n<!-- Handover -->",
    "startedAt": "2023-06-06T18:34:27.186Z",
    "createdAt": "2023-06-06 18:41:19",
    "updatedAt": "2023-06-06T18:42:54.707Z"
  },
  {
    "id": "9bb0baa5-188b-4512-87ac-acd2fa3c660c",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Pomo -->\n\nLife\n\n<!-- Runn -->",
    "startedAt": "2023-06-06T18:42:36.609Z",
    "createdAt": "2023-06-06 18:42:54",
    "updatedAt": "2023-06-07T06:24:06.662Z"
  },
  {
    "id": "b8e0659b-e474-4a01-b453-4bfcfd8f2a2b",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "<!-- Add a way to filter the `pomo log` command to just a certain stream. -->\n\nPrepare a quiche for dinner.\n\n- Find a recipe\n- Purchase ingredients\n- Make quiche!\n\n<!-- Handover -->",
    "startedAt": "2023-06-06T18:42:36.609Z",
    "createdAt": "2023-06-06 18:42:54",
    "updatedAt": "2023-06-07T06:24:06.698Z"
  },
  {
    "id": "7280d2da-7019-4fd7-b6f9-ddc712873ace",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn\n\n<!-- Pomo -->\n\n<!-- Life -->",
    "startedAt": "2023-06-07T06:23:43.630Z",
    "createdAt": "2023-06-07 06:24:06",
    "updatedAt": "2023-06-07T06:48:20.534Z"
  },
  {
    "id": "fd036146-8882-4e81-a88e-ea18a71fb2e3",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Reading slack\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T06:23:43.630Z",
    "createdAt": "2023-06-07 06:24:06",
    "updatedAt": "2023-06-07T06:48:20.569Z"
  },
  {
    "id": "4575b8de-9461-4076-8b94-9e51178cd28f",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-07T06:47:43.744Z",
    "createdAt": "2023-06-07 06:48:20",
    "updatedAt": "2023-06-07T07:24:57.541Z"
  },
  {
    "id": "4c713c01-a3f9-48ef-accb-c54355caa9f6",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Runn -->\n\n<!-- Pomo -->\n\nLife",
    "startedAt": "2023-06-07T06:47:43.744Z",
    "createdAt": "2023-06-07 06:48:20",
    "updatedAt": "2023-06-07T07:24:34.618Z"
  },
  {
    "id": "18f40a9b-1122-4617-a8e0-946a515f5ff8",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Morning walk to the café\n\n<!-- Respond to Carter's comments on Linear  -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T06:47:43.744Z",
    "createdAt": "2023-06-07 06:48:20",
    "updatedAt": "2023-06-07T07:24:34.653Z"
  },
  {
    "id": "5a2eb8c9-2efc-46b6-84ea-c3c9315bd5a1",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Runn -->\n\nPomo",
    "startedAt": "2023-06-07T07:24:13.987Z",
    "createdAt": "2023-06-07 07:24:34",
    "updatedAt": "2023-06-07T07:28:33.553Z"
  },
  {
    "id": "104ce5a1-889e-49a8-bc01-29d8f8ddc76a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "<!-- Respond to Carter's comments on Linear  -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->\n\nFilter HTML comments from pomo logs",
    "startedAt": "2023-06-07T07:24:13.987Z",
    "createdAt": "2023-06-07 07:24:34",
    "updatedAt": "2023-06-07T07:28:33.593Z"
  },
  {
    "id": "5f8cdae6-419d-468c-8476-ca71270c3460",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "La Pelle Café \n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-07T07:24:44.785Z",
    "createdAt": "2023-06-07 07:24:57",
    "updatedAt": "2023-06-07T18:24:35.177Z"
  },
  {
    "id": "41d6b2a4-12a4-4cfb-9952-2ea825d376b0",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T07:28:25.429Z",
    "createdAt": "2023-06-07 07:28:33",
    "updatedAt": "2023-06-07T09:28:23.459Z"
  },
  {
    "id": "19e99b67-557c-4e7c-b0de-bc26ea16e372",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Respond to Carter's comments on Linear \n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T07:28:25.429Z",
    "createdAt": "2023-06-07 07:28:33",
    "updatedAt": "2023-06-07T08:47:24.722Z"
  },
  {
    "id": "87113707-8d3d-4359-8664-e91a2ef6653d",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Meeting with Francesco and Carter to discuss #feat-integrations\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T08:00:00.000Z",
    "createdAt": "2023-06-07 08:47:24",
    "updatedAt": "2023-06-07T08:47:59.427Z"
  },
  {
    "id": "5462fe50-ba2f-4aed-8b72-31b61f0cb07b",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Linear: Responding to Carter's comments\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T08:47:26.200Z",
    "createdAt": "2023-06-07 08:47:59",
    "updatedAt": "2023-06-07T09:03:10.889Z"
  },
  {
    "id": "adece48d-8d04-4e64-bf20-1bb3dbd43ad3",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Debug: Investigate why @runn/seed is inserting duplicate ProjectMembers\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T09:02:55.860Z",
    "createdAt": "2023-06-07 09:03:10",
    "updatedAt": "2023-06-07T09:28:23.512Z"
  },
  {
    "id": "278a332d-e410-48fb-b502-31cf315a2380",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Runn -->\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T09:28:13.884Z",
    "createdAt": "2023-06-07 09:28:23",
    "updatedAt": "2023-06-07T09:42:58.147Z"
  },
  {
    "id": "a7c952b6-2e76-49f7-b1f7-3d952023b584",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Taking a break\n\n<!-- Debug: Investigate why @runn/seed is inserting duplicate ProjectMembers -->\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T09:28:13.884Z",
    "createdAt": "2023-06-07 09:28:23",
    "updatedAt": "2023-06-07T09:42:58.201Z"
  },
  {
    "id": "67f27913-2358-4634-9131-af51da4ba9ba",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Life -->\n\nRunn\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T09:42:50.571Z",
    "createdAt": "2023-06-07 09:42:58",
    "updatedAt": "2023-06-07T11:18:53.242Z"
  },
  {
    "id": "383bd0c8-7305-4a51-8f5d-804a6e2184fb",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "<!-- Taking a break -->\n\nDebug: Investigate why @runn/seed is inserting duplicate ProjectMembers\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T09:42:50.571Z",
    "createdAt": "2023-06-07 09:42:58",
    "updatedAt": "2023-06-07T10:09:36.525Z"
  },
  {
    "id": "3dcb72cf-e9de-47fd-85ab-363ac89940dc",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Jardin Public\n\n<!-- La Pelle Café  -->\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-07T09:43:00.000Z",
    "createdAt": "2023-06-07 18:24:35",
    "updatedAt": "2023-06-07T18:25:46.565Z"
  },
  {
    "id": "c6b35b64-6650-4940-b2f9-ef99ad49e56c",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "<!-- Taking a break -->\n\npair-programming: with Francesco\n\n<!-- Debug: Investigate why @runn/seed is inserting duplicate ProjectMembers -->\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T10:09:19.012Z",
    "createdAt": "2023-06-07 10:09:36",
    "updatedAt": "2023-06-07T10:17:40.338Z"
  },
  {
    "id": "84e37de7-9b06-4351-b73e-63dc62965912",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "<!-- Taking a break -->\n\nDebug: Investigate why @runn/seed is inserting duplicate ProjectMembers\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T10:17:35.528Z",
    "createdAt": "2023-06-07 10:17:40",
    "updatedAt": "2023-06-07T11:18:53.294Z"
  },
  {
    "id": "4906db1d-fcf6-4461-a131-b7635e9a33cf",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Runn -->\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T11:18:40.894Z",
    "createdAt": "2023-06-07 11:18:53",
    "updatedAt": "2023-06-07T11:43:00.164Z"
  },
  {
    "id": "968b383a-4e17-4d37-a9cd-d5060748be12",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Lunch time!\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T11:18:40.894Z",
    "createdAt": "2023-06-07 11:18:53",
    "updatedAt": "2023-06-07T11:43:00.215Z"
  },
  {
    "id": "d859d94e-1840-4616-b03b-636b0c1d009b",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City\n\n<!-- La Pelle Café  -->\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-07T11:19:00.000Z",
    "createdAt": "2023-06-07 18:25:46",
    "updatedAt": null
  },
  {
    "id": "b2d60331-2a67-444b-a725-2f8f1f887493",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Marika's Apartment",
    "startedAt": "2023-06-07T11:42:24.188Z",
    "createdAt": "2023-06-07 11:43:00",
    "updatedAt": "2023-06-07T13:56:19.474Z"
  },
  {
    "id": "7611f51c-bcdb-4841-a410-c073c14a2216",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Runn -->\n\nPomo",
    "startedAt": "2023-06-07T11:42:24.188Z",
    "createdAt": "2023-06-07 11:43:00",
    "updatedAt": "2023-06-07T12:12:02.552Z"
  },
  {
    "id": "7d165686-b5c0-451a-b600-07206f937929",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Find a decent TUI library to use\n\n<!-- Lunch time! -->\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T11:42:24.188Z",
    "createdAt": "2023-06-07 11:43:00",
    "updatedAt": "2023-06-07T12:12:02.587Z"
  },
  {
    "id": "330906fb-0724-4339-8b14-f3cd95198f08",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Life -->\n\nRunn\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T12:11:35.928Z",
    "createdAt": "2023-06-07 12:12:02",
    "updatedAt": "2023-06-07T13:56:19.525Z"
  },
  {
    "id": "a2adb074-85c3-451f-a32f-b1d2bf605460",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Review Francesco's PR #11676\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T12:11:35.928Z",
    "createdAt": "2023-06-07 12:12:02",
    "updatedAt": "2023-06-07T12:28:55.976Z"
  },
  {
    "id": "9ddac34e-968a-4041-b828-ec3f71ceaae9",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "github: Add descriptions for my draft PRs\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T12:28:41.183Z",
    "createdAt": "2023-06-07 12:28:55",
    "updatedAt": "2023-06-07T12:48:52.503Z"
  },
  {
    "id": "a8e2b1c5-d4fc-4a0f-b2e1-7888b448cc6b",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "github: Review Francesco's PR\n\n<!-- github: Add descriptions for my draft PRs -->\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T12:48:40.525Z",
    "createdAt": "2023-06-07 12:48:52",
    "updatedAt": "2023-06-07T12:55:16.967Z"
  },
  {
    "id": "f02a4480-01d1-49f6-a18f-555c74de4e63",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "github: Add descriptions for my draft PRs\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T12:55:13.132Z",
    "createdAt": "2023-06-07 12:55:16",
    "updatedAt": "2023-06-07T13:15:12.253Z"
  },
  {
    "id": "135a242b-9249-4ff4-93ff-c1025ae9f175",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Remove unused databases\n\n<!-- github: Add descriptions for my draft PRs -->\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T13:14:57.192Z",
    "createdAt": "2023-06-07 13:15:12",
    "updatedAt": "2023-06-07T13:56:19.576Z"
  },
  {
    "id": "37659d7c-2973-464e-93cc-3ec9fa8f31c7",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-07T13:55:53.868Z",
    "createdAt": "2023-06-07 13:56:19",
    "updatedAt": "2023-06-07T14:15:25.709Z"
  },
  {
    "id": "78a90c68-5bea-43cd-b232-6ba6ed4525a9",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Runn -->\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T13:55:53.868Z",
    "createdAt": "2023-06-07 13:56:19",
    "updatedAt": "2023-06-07T14:15:25.763Z"
  },
  {
    "id": "ce3747fb-91ea-4bc7-913e-c257dbb269bd",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Walking around\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T13:55:53.868Z",
    "createdAt": "2023-06-07 13:56:19",
    "updatedAt": "2023-06-07T14:15:25.814Z"
  },
  {
    "id": "c32c9a94-da3c-4dfa-a258-6120c5de9fe9",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Café Soukke\n\n<!-- City -->\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-07T14:14:45.441Z",
    "createdAt": "2023-06-07 14:15:25",
    "updatedAt": "2023-06-07T16:26:52.871Z"
  },
  {
    "id": "988d4384-e473-489d-b820-ae350c78c14e",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Life -->\n\nRunn\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T14:14:45.441Z",
    "createdAt": "2023-06-07 14:15:25",
    "updatedAt": "2023-06-07T16:26:52.908Z"
  },
  {
    "id": "be83e715-0fa7-4e40-a060-9a4a75a55f27",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "<!-- Walking around -->\n\nLinear: Responding to Carter's comments\n\n<!-- Linear: Create ticket for building out the \"Import Person\" modal -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T14:14:45.441Z",
    "createdAt": "2023-06-07 14:15:25",
    "updatedAt": "2023-06-07T16:26:52.944Z"
  },
  {
    "id": "f15cf943-5b00-47ae-8664-d6d4f2418e15",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-07T16:26:43.706Z",
    "createdAt": "2023-06-07 16:26:52",
    "updatedAt": "2023-06-07T17:12:13.252Z"
  },
  {
    "id": "2f890b5d-f88c-4998-a30f-301eda93549a",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Runn -->\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T16:26:43.706Z",
    "createdAt": "2023-06-07 16:26:52",
    "updatedAt": "2023-06-07T17:12:13.291Z"
  },
  {
    "id": "4d34d7fd-1e9a-42ac-bcd8-7dfae58362e9",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Walking around\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Linear: Create ticket for building out the \"Import Person\" modal -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T16:26:43.706Z",
    "createdAt": "2023-06-07 16:26:52",
    "updatedAt": "2023-06-07T17:12:13.331Z"
  },
  {
    "id": "fca14bda-c6f1-4596-9dde-2715ae3b504d",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "<!-- City -->\n\nMarika's Apartment",
    "startedAt": "2023-06-07T17:11:59.199Z",
    "createdAt": "2023-06-07 17:12:13",
    "updatedAt": null
  },
  {
    "id": "1d7b277a-2b5a-498c-b697-d59a47921edf",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Mojo\n\n<!-- Life -->\n\n<!-- Runn -->\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T17:11:59.199Z",
    "createdAt": "2023-06-07 17:12:13",
    "updatedAt": "2023-06-07T17:46:29.414Z"
  },
  {
    "id": "47f136b8-ac98-4554-aff6-109afd812d4d",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Learning about Mojo\n\n<!-- Linear: Responding to Carter's comments -->\n\n<!-- Linear: Create ticket for building out the \"Import Person\" modal -->\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T17:11:59.199Z",
    "createdAt": "2023-06-07 17:12:13",
    "updatedAt": "2023-06-07T17:46:29.455Z"
  },
  {
    "id": "c38e9d48-2f8f-4493-b9dd-4a7b1e1b1dd5",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Life -->\n\nRunn\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T17:46:16.053Z",
    "createdAt": "2023-06-07 17:46:29",
    "updatedAt": "2023-06-07T18:02:08.272Z"
  },
  {
    "id": "8066a880-1fcc-4fce-99fa-e38019a7a2a9",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Handover\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T17:46:16.053Z",
    "createdAt": "2023-06-07 17:46:29",
    "updatedAt": "2023-06-07T18:02:08.310Z"
  },
  {
    "id": "bf59317a-51f4-4154-bd3d-958b50a2d70c",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Life -->\n\nPomo",
    "startedAt": "2023-06-07T18:01:59.234Z",
    "createdAt": "2023-06-07 18:02:08",
    "updatedAt": null
  },
  {
    "id": "7caade79-97c1-453f-a2c0-4b8e3d9cbf13",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Add a way to filter the `pomo log` command to just a certain stream.",
    "startedAt": "2023-06-07T18:01:59.234Z",
    "createdAt": "2023-06-07 18:02:08",
    "updatedAt": null
  },
  {
    "id": "e28cefd2-ba2c-4014-b95f-bbb29d0d4f6f",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T18:39:58.629Z",
    "createdAt": "2023-06-07 18:40:06",
    "updatedAt": null
  },
  {
    "id": "d263cb5d-2497-4acf-9f1d-629ba43ca555",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Dishes\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T18:39:58.629Z",
    "createdAt": "2023-06-07 18:40:06",
    "updatedAt": null
  },
  {
    "id": "987dc552-8cef-4596-88e2-d4582f5ff628",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Life -->\n\nPomo",
    "startedAt": "2023-06-07T19:04:53.531Z",
    "createdAt": "2023-06-07 19:05:15",
    "updatedAt": null
  },
  {
    "id": "1d3ae473-9968-4d8a-8737-d084b718815d",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Add a way to filter the `pomo log` command to just a certain stream.",
    "startedAt": "2023-06-07T19:04:53.531Z",
    "createdAt": "2023-06-07 19:05:15",
    "updatedAt": null
  },
  {
    "id": "a0066c5f-126b-4eb8-877b-10cd696a57a0",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T19:32:33.240Z",
    "createdAt": "2023-06-07 19:32:47",
    "updatedAt": null
  },
  {
    "id": "8a42946a-2348-46b3-8ca0-aeb49a71b98c",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Spend time with Marika\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T19:32:33.240Z",
    "createdAt": "2023-06-07 19:32:47",
    "updatedAt": null
  },
  {
    "id": "83f60161-cf56-4e6e-8bf0-69511500bb09",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Life -->\n\nPomo",
    "startedAt": "2023-06-07T20:02:18.072Z",
    "createdAt": "2023-06-07 20:02:25",
    "updatedAt": null
  },
  {
    "id": "8fa059df-9c18-4f46-8c30-00c6a55a4c11",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "<!-- Spend time with Marika -->\n\nAdd a way to filter the `pomo log` command to just a certain stream.",
    "startedAt": "2023-06-07T20:02:18.072Z",
    "createdAt": "2023-06-07 20:02:25",
    "updatedAt": null
  },
  {
    "id": "dfad21ef-ef74-4d85-ab12-6accaab67454",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Pomo -->",
    "startedAt": "2023-06-07T20:10:54.178Z",
    "createdAt": "2023-06-07 20:11:00",
    "updatedAt": null
  },
  {
    "id": "29dc814c-4eb9-4f79-af2c-3b9f34f13c54",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Spend time with Marika\n\n<!-- Add a way to filter the `pomo log` command to just a certain stream. -->",
    "startedAt": "2023-06-07T20:10:54.178Z",
    "createdAt": "2023-06-07 20:11:00",
    "updatedAt": null
  },
  {
    "id": "3298b77d-6bcc-4642-b279-6809b229e71d",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Life -->\n\nPomo",
    "startedAt": "2023-06-08T05:12:23.602Z",
    "createdAt": "2023-06-08 05:12:32",
    "updatedAt": null
  },
  {
    "id": "3b9ec492-c016-4ca3-8eab-9870e2e89a81",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Add a way to filter the `pomo log` command to just a certain stream.",
    "startedAt": "2023-06-08T05:12:23.602Z",
    "createdAt": "2023-06-08 05:12:32",
    "updatedAt": null
  },
  {
    "id": "a5c58c1c-89cd-45d3-ab8c-0b6181a4a6f7",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn\n\n<!-- Life -->\n\n<!-- Pomo -->",
    "startedAt": "2023-06-08T06:02:14.128Z",
    "createdAt": "2023-06-08 06:02:20",
    "updatedAt": "2023-06-09T13:59:03.600Z"
  },
  {
    "id": "ca8399be-6f08-4364-8110-7f545a5098e9",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "<!-- Add a way to filter the `pomo log` command to just a certain stream. -->\n\nSlack",
    "startedAt": "2023-06-08T06:02:14.128Z",
    "createdAt": "2023-06-08 06:02:20",
    "updatedAt": null
  },
  {
    "id": "1accc09a-7299-4687-a135-2102f93651e6",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Life -->\n\nPomo",
    "startedAt": "2023-06-08T06:24:20.450Z",
    "createdAt": "2023-06-08 06:24:26",
    "updatedAt": null
  },
  {
    "id": "c9be8e0a-b4ea-4e94-9aa5-6f878f0a50fc",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Add a way to filter the `pomo log` command to just a certain stream.\n\n<!-- Slack -->",
    "startedAt": "2023-06-08T06:24:20.450Z",
    "createdAt": "2023-06-08 06:24:26",
    "updatedAt": null
  },
  {
    "id": "9b4a7c0b-de8a-47ef-bb04-3115bf90b199",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life",
    "startedAt": "2023-06-08T06:44:30.419Z",
    "createdAt": "2023-06-08 06:44:52",
    "updatedAt": null
  },
  {
    "id": "48bb155d-9d61-448b-afa8-cdadae08357f",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Let's head outside!\n\n<!-- Slack -->",
    "startedAt": "2023-06-08T06:44:30.419Z",
    "createdAt": "2023-06-08 06:44:52",
    "updatedAt": null
  },
  {
    "id": "74147e47-0275-4a92-a1bf-e663219d0152",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-08T07:00:00.000Z",
    "createdAt": "2023-06-08 07:16:22",
    "updatedAt": null
  },
  {
    "id": "5dd96887-4715-4eed-950c-97c9adf3c6e5",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Café 4e Vague\n\n<!-- City -->\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-08T07:16:24.551Z",
    "createdAt": "2023-06-08 07:17:16",
    "updatedAt": null
  },
  {
    "id": "b7fc519b-a37e-42c3-b5d5-235bc6675a79",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn\n\n<!-- Life -->",
    "startedAt": "2023-06-08T07:16:24.551Z",
    "createdAt": "2023-06-08 07:17:16",
    "updatedAt": null
  },
  {
    "id": "f699808a-3dc9-447a-babf-dde3ec829c83",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*linear*\n\nLet's head outside!",
    "startedAt": "2023-06-08T07:16:24.551Z",
    "createdAt": "2023-06-08 07:17:16",
    "updatedAt": null
  },
  {
    "id": "8f6da944-15a9-486b-bde6-9463661baf48",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Shell\n\n<!-- Runn -->\n\n<!-- Life -->",
    "startedAt": "2023-06-08T08:43:12.606Z",
    "createdAt": "2023-06-08 08:43:31",
    "updatedAt": null
  },
  {
    "id": "a4ed795d-7f13-4106-84b9-4e0c21615310",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Install Zoxide, Exa and Zeal\n\n<!-- *linear* -->\n\n<!-- Let's head outside! -->",
    "startedAt": "2023-06-08T08:43:12.606Z",
    "createdAt": "2023-06-08 08:43:31",
    "updatedAt": null
  },
  {
    "id": "4b426138-ac91-4670-aefc-4194ac910ba7",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn\n\n<!-- Life -->",
    "startedAt": "2023-06-08T08:55:03.113Z",
    "createdAt": "2023-06-08 08:55:32",
    "updatedAt": null
  },
  {
    "id": "7a50a915-5b24-441b-83b4-82cddd7a50e0",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*linear* showing an example of multiple people linked\n\n<!-- Let's head outside! -->",
    "startedAt": "2023-06-08T08:55:03.113Z",
    "createdAt": "2023-06-08 08:55:32",
    "updatedAt": null
  },
  {
    "id": "93ba041e-0bd8-41cd-b8d6-e45ff5db0e93",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*coding* FAST-1663 Automatically sync Merge Integration Services\n\n<!-- Let's head outside! -->",
    "startedAt": "2023-06-08T09:37:32.763Z",
    "createdAt": "2023-06-08 09:38:19",
    "updatedAt": null
  },
  {
    "id": "dc752c67-6862-401a-ad29-b534b0f03b1d",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*meeting*: Chatting with Carter about how to handle duplicate people\n\n<!-- *coding* FAST-1663 Automatically sync Merge Integration Services -->\n\n<!-- Let's head outside! -->",
    "startedAt": "2023-06-08T09:40:06.956Z",
    "createdAt": "2023-06-08 10:06:29",
    "updatedAt": null
  },
  {
    "id": "e0dc51bf-883b-4bb3-a70f-d1226fa0203b",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*coding* FAST-1663 Automatically sync Merge Integration Services\n\n<!-- Let's head outside! -->",
    "startedAt": "2023-06-08T10:06:32.385Z",
    "createdAt": "2023-06-08 10:06:35",
    "updatedAt": null
  },
  {
    "id": "dd5a28a7-2888-45e1-b8da-14b5c0677e88",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Runn -->\n\nLife",
    "startedAt": "2023-06-08T10:38:31.911Z",
    "createdAt": "2023-06-08 10:38:56",
    "updatedAt": null
  },
  {
    "id": "1bed0e33-13c9-4a88-8c8a-4f9a3a663306",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*walk* back to the apartment, maybe pick up something for lunch\n\n<!-- *coding* FAST-1663 Automatically sync Merge Integration Services -->",
    "startedAt": "2023-06-08T10:38:31.911Z",
    "createdAt": "2023-06-08 10:38:56",
    "updatedAt": null
  },
  {
    "id": "9de44904-c144-4595-a7d4-eccb418d02d6",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "<!-- City -->\n\nMarika's Apartment",
    "startedAt": "2023-06-08T10:48:00.000Z",
    "createdAt": "2023-06-08 11:08:21",
    "updatedAt": null
  },
  {
    "id": "bbd8ffff-5fbd-4e11-afee-9bc2e5eecc50",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*dishes* and *lunch*\n\n<!-- *coding* FAST-1663 Automatically sync Merge Integration Services -->",
    "startedAt": "2023-06-08T10:48:00.000Z",
    "createdAt": "2023-06-08 11:08:21",
    "updatedAt": null
  },
  {
    "id": "1227d18f-4496-4238-9a91-9148c89750e1",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn\n\n<!-- Life -->",
    "startedAt": "2023-06-08T11:29:56.994Z",
    "createdAt": "2023-06-08 11:30:19",
    "updatedAt": null
  },
  {
    "id": "fd5e6dc6-5f87-444f-acd8-9b05500332c7",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*pr* Get PR for FAST-1663 ready to review",
    "startedAt": "2023-06-08T11:29:56.994Z",
    "createdAt": "2023-06-08 11:30:19",
    "updatedAt": null
  },
  {
    "id": "8e975a88-e188-44d0-be50-38c3aa88852b",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*integration* Populate a FactorialHR account with a bunch of people",
    "startedAt": "2023-06-08T11:41:48.340Z",
    "createdAt": "2023-06-08 11:42:04",
    "updatedAt": null
  },
  {
    "id": "dd939f34-70b9-4f7c-bfe0-84d558c4e1a0",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Runn -->\n\nLife",
    "startedAt": "2023-06-08T13:09:06.462Z",
    "createdAt": "2023-06-08 13:09:16",
    "updatedAt": null
  },
  {
    "id": "76fc1ff5-a342-4519-b636-b264244a3a02",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Walk to the café\n\n<!-- *integration* Populate a FactorialHR account with a bunch of people -->",
    "startedAt": "2023-06-08T13:09:06.462Z",
    "createdAt": "2023-06-08 13:09:16",
    "updatedAt": null
  },
  {
    "id": "3feb8c89-be96-43d6-9135-df0aad9ba00b",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-08T13:09:18.205Z",
    "createdAt": "2023-06-08 13:09:22",
    "updatedAt": null
  },
  {
    "id": "7bc52d5f-18d9-47c9-8139-780e8c7192b0",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Café Juliena\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-08T13:27:00.000Z",
    "createdAt": "2023-06-08 14:19:41",
    "updatedAt": null
  },
  {
    "id": "d9d2496f-0feb-41a1-ab5e-4e78b06182a5",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Runn",
    "startedAt": "2023-06-08T13:27:00.000Z",
    "createdAt": "2023-06-08 14:19:41",
    "updatedAt": null
  },
  {
    "id": "edea0494-c0dc-4c7f-984f-5c49d82b04ee",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*meeting* helping Francesco with Hasura and Contract/Roles\n\n<!-- *integration* Populate a FactorialHR account with a bunch of people -->",
    "startedAt": "2023-06-08T13:27:00.000Z",
    "createdAt": "2023-06-08 14:19:41",
    "updatedAt": null
  },
  {
    "id": "e5768d73-1aaf-4131-b8d0-2905a3cf6d84",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "*integration* Populate a FactorialHR account with a bunch of people",
    "startedAt": "2023-06-08T13:45:00.000Z",
    "createdAt": "2023-06-08 14:20:15",
    "updatedAt": null
  },
  {
    "id": "371cf116-a421-4860-b703-99937110ea6b",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City\n\n<!-- Marika's Apartment -->",
    "startedAt": "2023-06-08T16:10:24.270Z",
    "createdAt": "2023-06-08 16:10:50",
    "updatedAt": null
  },
  {
    "id": "af3def49-12d2-49a8-bcea-18291e1c7b8c",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Runn -->",
    "startedAt": "2023-06-08T16:10:24.270Z",
    "createdAt": "2023-06-08 16:10:50",
    "updatedAt": null
  },
  {
    "id": "3644b172-4526-4e9c-9975-0cf7677bc7e8",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Walk back to the apartment, maybe go for a run this evening?",
    "startedAt": "2023-06-08T16:10:24.270Z",
    "createdAt": "2023-06-08 16:10:50",
    "updatedAt": null
  },
  {
    "id": "3acbe8c2-ab07-4e9a-a5d7-8464a8409150",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "<!-- City -->\n\nMarika's Apartment",
    "startedAt": "2023-06-08T16:43:14.328Z",
    "createdAt": "2023-06-08 16:43:22",
    "updatedAt": null
  },
  {
    "id": "9db27dfb-50c2-459c-aa2a-3ffe37fbe512",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Dishes",
    "startedAt": "2023-06-08T16:43:14.328Z",
    "createdAt": "2023-06-08 16:43:22",
    "updatedAt": null
  },
  {
    "id": "0d466eb4-b2f9-4d27-8c05-077d778a50c2",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Pomo\n\n<!-- Life -->\n\n<!-- Runn -->",
    "startedAt": "2023-06-08T17:00:24.660Z",
    "createdAt": "2023-06-08 17:00:43",
    "updatedAt": null
  },
  {
    "id": "5fec2e97-35a1-40c5-8ec9-9f4bcea78533",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Stream → Point → Line",
    "startedAt": "2023-06-08T17:00:24.660Z",
    "createdAt": "2023-06-08 17:00:43",
    "updatedAt": null
  },
  {
    "id": "97d48c13-ae8b-417d-ac56-2b332dfc2a13",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "Marika's Apartment",
    "startedAt": "2023-06-08T19:05:43.674Z",
    "createdAt": "2023-06-08 19:05:54",
    "updatedAt": null
  },
  {
    "id": "b6308f5b-76a1-490c-8a88-0a1b9fd4c7e4",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- Pomo -->\n\nLife\n\n<!-- Runn -->",
    "startedAt": "2023-06-08T19:05:43.674Z",
    "createdAt": "2023-06-08 19:05:54",
    "updatedAt": null
  },
  {
    "id": "1708af55-5df6-4de5-800f-4ef513de015b",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Taking a break\n\n<!-- Stream → Point → Line -->",
    "startedAt": "2023-06-08T19:05:43.674Z",
    "createdAt": "2023-06-08 19:05:54",
    "updatedAt": null
  },
  {
    "id": "3d3de2a6-fbac-45b1-8a9f-b524e1554461",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Pomo\n\n<!-- Life -->",
    "startedAt": "2023-06-08T19:14:31.673Z",
    "createdAt": "2023-06-08 19:14:43",
    "updatedAt": null
  },
  {
    "id": "eaec1f56-f472-4de0-be48-f3a9318d873a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "<!-- Taking a break -->\n\nStream → Point → Line",
    "startedAt": "2023-06-08T19:14:31.673Z",
    "createdAt": "2023-06-08 19:14:43",
    "updatedAt": null
  },
  {
    "id": "6f376edd-0cd7-4d0f-8e7c-b70b33322dbd",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life",
    "startedAt": "2023-06-08T20:50:00.352Z",
    "createdAt": "2023-06-08 20:50:08",
    "updatedAt": null
  },
  {
    "id": "7118779e-bced-4fd8-a406-c7a782f01bdd",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Rest.",
    "startedAt": "2023-06-08T20:50:00.352Z",
    "createdAt": "2023-06-08 20:50:08",
    "updatedAt": null
  },
  {
    "id": "3dc49ea3-67b8-4d4d-9828-de3d9be89915",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Pomo",
    "startedAt": "2023-06-09T05:06:39.006Z",
    "createdAt": "2023-06-09 05:06:51",
    "updatedAt": null
  },
  {
    "id": "209df4fa-0f4e-49c3-940f-f008d1c84651",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Render logs as a block of slices",
    "startedAt": "2023-06-09T05:06:39.006Z",
    "createdAt": "2023-06-09 05:06:51",
    "updatedAt": null
  },
  {
    "id": "954b8126-f7d3-407d-8ded-8cf2b040a07d",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Life\n\n<!-- Pomo -->",
    "startedAt": "2023-06-09T05:40:39.972Z",
    "createdAt": "2023-06-09 05:41:29",
    "updatedAt": null
  },
  {
    "id": "b0404e31-8c9e-4888-a7c5-ba14b2236a85",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Wrap up bed frame in cardboard & tidy up the apartment",
    "startedAt": "2023-06-09T05:40:39.972Z",
    "createdAt": "2023-06-09 05:41:29",
    "updatedAt": null
  },
  {
    "id": "77d8bbf8-ef27-46b0-9b75-555558069442",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "Pomo",
    "startedAt": "2023-06-09T08:18:42.636Z",
    "createdAt": "2023-06-09 08:19:09",
    "updatedAt": null
  },
  {
    "id": "c2067db9-cd0d-4d90-8cbe-ec472ee737a4",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "`pomo fix` should display a list of slices",
    "startedAt": "2023-06-09T08:18:42.636Z",
    "createdAt": "2023-06-09 08:19:09",
    "updatedAt": null
  },
  {
    "id": "3f14161e-315f-4773-b061-8128c1e10293",
    "streamId": "e52d778b-1500-4405-b43a-aff4910020af",
    "value": "> Bordeaux, FR",
    "startedAt": "2023-06-09T09:38:16.898Z",
    "createdAt": "2023-06-09 09:44:42",
    "updatedAt": null
  },
  {
    "id": "c590372c-6791-4277-a444-af8fc8e8bbb8",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> Marika's Apartment",
    "startedAt": "2023-06-09T09:38:16.898Z",
    "createdAt": "2023-06-09 09:44:42",
    "updatedAt": null
  },
  {
    "id": "bf9b9d28-94ab-4b93-8d0b-885aed5f7971",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Pomo",
    "startedAt": "2023-06-09T09:38:16.898Z",
    "createdAt": "2023-06-09 09:44:42",
    "updatedAt": null
  },
  {
    "id": "458af0c3-ebaf-48a0-8805-d1789853754e",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> pomo-cli\n\nInstead of trying to build a select input, let's make it easy to reference a\nslice by an ID.\n\nThe problem is that only the individual points have an ID.\n\nA slice just has a startedAt time. Maybe I could b64 encode the\nseconds/milliseconds of the time?",
    "startedAt": "2023-06-09T09:38:16.898Z",
    "createdAt": "2023-06-09 09:44:42",
    "updatedAt": null
  },
  {
    "id": "6bd66228-9804-4712-b727-2f63823302a8",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Life",
    "startedAt": "2023-06-09T10:36:00.254Z",
    "createdAt": "2023-06-09 10:36:55",
    "updatedAt": null
  },
  {
    "id": "6dc7e8c6-b013-4851-ae02-3af7e6bf2d07",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Lunch\n\nTime to eat! May need to pick up something from the auchan\n\n<!-- > pomo-cli -->\n\n<!--  -->\n\n<!-- Instead of trying to build a select input, let's make it easy to reference a -->\n\n<!-- slice by an ID. -->\n\n<!--  -->\n\n<!-- The problem is that only the individual points have an ID. -->\n\n<!--  -->\n\n<!-- A slice just has a startedAt time. Maybe I could b64 encode the -->\n\n<!-- seconds/milliseconds of the time? -->\n\n<!--  -->",
    "startedAt": "2023-06-09T10:36:00.254Z",
    "createdAt": "2023-06-09 10:36:55",
    "updatedAt": null
  },
  {
    "id": "c8ce1b13-5b94-4607-b62a-4add798de20a",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> City",
    "startedAt": "2023-06-09T11:05:00.000Z",
    "createdAt": "2023-06-09 12:09:49",
    "updatedAt": null
  },
  {
    "id": "e97753a7-2b68-4c72-9e32-65ae8b2b7adf",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Walking\n\nGoing to visit Charli & Tom's to get some lunch with Marika\n\n<!-- > pomo-cli -->\n\n<!--  -->\n\n<!-- Instead of trying to build a select input, let's make it easy to reference a -->\n\n<!-- slice by an ID. -->\n\n<!--  -->\n\n<!-- The problem is that only the individual points have an ID. -->\n\n<!--  -->\n\n<!-- A slice just has a startedAt time. Maybe I could b64 encode the -->\n\n<!-- seconds/milliseconds of the time? -->\n\n<!--  -->",
    "startedAt": "2023-06-09T11:05:00.000Z",
    "createdAt": "2023-06-09 12:09:49",
    "updatedAt": null
  },
  {
    "id": "8f3c7f04-a5ba-4175-a629-5cbb8ef0f55a",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> Juliena",
    "startedAt": "2023-06-09T11:20:00.000Z",
    "createdAt": "2023-06-09 12:10:22",
    "updatedAt": null
  },
  {
    "id": "73b5b16c-1464-4bd4-b818-ca8ee459fa08",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Lunch\n\nHaving lunch with Marika\n\n<!-- > pomo-cli -->\n\n<!--  -->\n\n<!-- Instead of trying to build a select input, let's make it easy to reference a -->\n\n<!-- slice by an ID. -->\n\n<!--  -->\n\n<!-- The problem is that only the individual points have an ID. -->\n\n<!--  -->\n\n<!-- A slice just has a startedAt time. Maybe I could b64 encode the -->\n\n<!-- seconds/milliseconds of the time? -->\n\n<!--  -->",
    "startedAt": "2023-06-09T11:20:00.000Z",
    "createdAt": "2023-06-09 12:10:22",
    "updatedAt": null
  },
  {
    "id": "2dadbb03-9061-4653-bf6b-5b92d9dd52bb",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Pomo\n\n<!-- > Life -->",
    "startedAt": "2023-06-09T12:10:55.039Z",
    "createdAt": "2023-06-09 12:12:07",
    "updatedAt": null
  },
  {
    "id": "88d1a3d2-50e1-4b9e-b76e-206613ab24f8",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> pomo-cli\n\nAdd UUIDs to each point.\nConsidering just using the same ID format as watson.",
    "startedAt": "2023-06-09T12:10:55.039Z",
    "createdAt": "2023-06-09 12:12:07",
    "updatedAt": null
  },
  {
    "id": "4e8829d6-6d37-45fc-a225-f0ac1310bcb2",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Social\n\n<!-- > Life -->",
    "startedAt": "2023-06-09T12:38:00.000Z",
    "createdAt": "2023-06-09 13:22:56",
    "updatedAt": null
  },
  {
    "id": "84d662b4-823d-4bf8-8b3a-7ccb975c6f68",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Phone Call with Jacob\n\n<!-- Add UUIDs to each point. -->\n\n<!-- Considering just using the same ID format as watson. -->",
    "startedAt": "2023-06-09T12:38:00.000Z",
    "createdAt": "2023-06-09 13:22:56",
    "updatedAt": "2023-06-09T13:58:43.998Z"
  },
  {
    "id": "6da9ca1f-5ad1-43ef-bbab-105b0b427d61",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Pomo\n\n<!-- > Life -->",
    "startedAt": "2023-06-09T13:22:57.699Z",
    "createdAt": "2023-06-09 13:23:09",
    "updatedAt": null
  },
  {
    "id": "c6309f8a-350e-4bd2-acca-81cf94f24c9b",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> pomo-cli\n\nAdd UUIDs to each point.\nConsidering just using the same ID format as watson.",
    "startedAt": "2023-06-09T13:22:57.699Z",
    "createdAt": "2023-06-09 13:23:09",
    "updatedAt": null
  },
  {
    "id": "836483a3-91cc-4029-8d77-5fceca6b1357",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> pomo-cli\n\nGet `pomo stats` outputting something I can display in tmux",
    "startedAt": "2023-06-09T14:00:46.229Z",
    "createdAt": "2023-06-09 14:01:44",
    "updatedAt": null
  },
  {
    "id": "2db7d899-2608-456f-ae8e-554b3f1c6bf9",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "City\n\n<!-- > Juliena -->",
    "startedAt": "2023-06-09T14:33:52.838Z",
    "createdAt": "2023-06-09 14:34:14",
    "updatedAt": null
  },
  {
    "id": "d39c48db-4555-4f13-a5e3-98f76ad57764",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "<!-- > Pomo -->\n\n> Life",
    "startedAt": "2023-06-09T14:33:52.838Z",
    "createdAt": "2023-06-09 14:34:14",
    "updatedAt": null
  },
  {
    "id": "f9d17cd4-978c-4ae9-ba21-b6723d69195a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Walking\n\nBack to the apartment with Marika\n\n<!-- > pomo-cli -->\n\n<!--  -->\n\n<!-- Get `pomo stats` outputting something I can display in tmux -->\n\n<!--  -->",
    "startedAt": "2023-06-09T14:33:52.838Z",
    "createdAt": "2023-06-09 14:34:14",
    "updatedAt": null
  },
  {
    "id": "30631ddc-42a6-48b3-ba42-5752fb284114",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> Marika's Apartment",
    "startedAt": "2023-06-09T14:50:00.000Z",
    "createdAt": "2023-06-09 15:04:09",
    "updatedAt": null
  },
  {
    "id": "115a2f36-ab57-48bd-9e00-9f5f9748fd0c",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Life\n\n<!-- > Pomo -->",
    "startedAt": "2023-06-09T14:50:00.000Z",
    "createdAt": "2023-06-09 15:04:09",
    "updatedAt": "2023-06-09T15:08:32.510Z"
  },
  {
    "id": "82ec7a48-231c-4829-8311-2de78e913346",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Rest\n\n<!-- > pomo-cli -->\n\n<!-- Get `pomo stats` outputting something I can display in tmux -->",
    "startedAt": "2023-06-09T14:50:00.000Z",
    "createdAt": "2023-06-09 15:04:09",
    "updatedAt": "2023-06-09T15:08:32.542Z"
  },
  {
    "id": "e853042a-c7be-4e3b-9d65-7dfd6be240f9",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Pomo",
    "startedAt": "2023-06-09T15:05:00.000Z",
    "createdAt": "2023-06-09 15:08:42",
    "updatedAt": null
  },
  {
    "id": "ab915da6-821e-452d-abe2-b84cda4c9233",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> pomo-cli\n\nGet `pomo stats` outputting something I can display in tmux",
    "startedAt": "2023-06-09T15:05:00.000Z",
    "createdAt": "2023-06-09 15:08:42",
    "updatedAt": null
  },
  {
    "id": "297b95ad-8064-4f11-b0b2-e2e6a8cffdc7",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Life",
    "startedAt": "2023-06-09T15:32:44.716Z",
    "createdAt": "2023-06-09 15:33:19",
    "updatedAt": null
  },
  {
    "id": "dfa29490-7f43-40af-a6f1-fb8421f478e7",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Rest",
    "startedAt": "2023-06-09T15:32:44.716Z",
    "createdAt": "2023-06-09 15:33:19",
    "updatedAt": null
  },
  {
    "id": "171790ea-7256-453c-b88c-21532d48aa30",
    "streamId": "e3a36988-d98d-4438-91c9-52e18901c9ab",
    "value": "Evening Run",
    "startedAt": "2023-06-09T16:18:22.000Z",
    "createdAt": "2023-06-11 11:15:07",
    "updatedAt": null
  },
  {
    "id": "656311b1-0d7e-4c2d-af5b-39de861517a6",
    "streamId": "e3a36988-d98d-4438-91c9-52e18901c9ab",
    "value": "",
    "startedAt": "2023-06-09T17:25:47.000Z",
    "createdAt": "2023-06-11 11:15:07",
    "updatedAt": null
  },
  {
    "id": "6f7685d5-5a16-47c3-823b-3026ff4e02cf",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Pomo",
    "startedAt": "2023-06-09T18:26:49.447Z",
    "createdAt": "2023-06-09 18:27:35",
    "updatedAt": null
  },
  {
    "id": "41013b74-80ab-45e8-aaf8-6c19478da887",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> pomo-cli\n\nCreate a strava integration to import data into a \"strava\" stream",
    "startedAt": "2023-06-09T18:26:49.447Z",
    "createdAt": "2023-06-09 18:27:35",
    "updatedAt": null
  },
  {
    "id": "68f2c031-6a3a-4938-8659-d3b28e52a393",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Life",
    "startedAt": "2023-06-09T18:47:51.699Z",
    "createdAt": "2023-06-09 18:48:07",
    "updatedAt": null
  },
  {
    "id": "53c644ab-0d76-428d-8c7f-730fb5507d01",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Dinner\n\nwith Marika :)\n\n<!-- > pomo-cli -->\n\n<!--  -->\n\n<!-- Create a strava integration to import data into a \"strava\" stream -->\n\n<!--  -->",
    "startedAt": "2023-06-09T18:47:51.699Z",
    "createdAt": "2023-06-09 18:48:07",
    "updatedAt": null
  },
  {
    "id": "88ff7667-8cc9-475e-b387-67430b54ca1a",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Pomo",
    "startedAt": "2023-06-11T05:53:15.902Z",
    "createdAt": "2023-06-11 05:53:46",
    "updatedAt": null
  },
  {
    "id": "8a7f0d6c-837d-45ff-a9bd-a0a6fb3d3aab",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Research\n\nLearn how to use Automerge\n\n<!-- > pomo-cli -->\n\n<!--  -->\n\n<!-- Create a strava integration to import data into a \"strava\" stream -->\n\n<!--  -->",
    "startedAt": "2023-06-11T05:53:15.902Z",
    "createdAt": "2023-06-11 05:53:46",
    "updatedAt": null
  },
  {
    "id": "07c581cf-08b4-47a5-a8c4-f0aa6153eb9c",
    "streamId": "e3a36988-d98d-4438-91c9-52e18901c9ab",
    "value": "Morning Run",
    "startedAt": "2023-06-11T07:45:04.000Z",
    "createdAt": "2023-06-11 11:15:07",
    "updatedAt": null
  },
  {
    "id": "c3cedd58-967a-4131-8ac2-17be24e2ff2c",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> City",
    "startedAt": "2023-06-11T07:45:04.000Z",
    "createdAt": "2023-06-11 11:36:25",
    "updatedAt": "2023-06-11T11:38:03.815Z"
  },
  {
    "id": "3476c98c-1cd5-415c-b169-3aa04ec20ddf",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Exercise",
    "startedAt": "2023-06-11T07:45:04.000Z",
    "createdAt": "2023-06-11 11:36:26",
    "updatedAt": "2023-06-11T11:38:03.844Z"
  },
  {
    "id": "85dd9c95-b22b-4268-88d5-b96f95342a23",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Run\n\nMorning run with Marika",
    "startedAt": "2023-06-11T07:45:04.000Z",
    "createdAt": "2023-06-11 11:36:26",
    "updatedAt": "2023-06-11T11:38:03.862Z"
  },
  {
    "id": "4df94107-2eba-45d3-8254-ab68ba2e019a",
    "streamId": "e3a36988-d98d-4438-91c9-52e18901c9ab",
    "value": "",
    "startedAt": "2023-06-11T08:22:45.000Z",
    "createdAt": "2023-06-11 11:15:07",
    "updatedAt": null
  },
  {
    "id": "d5a435c7-3e90-4492-adfc-7092f66dc307",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> Marika's Apartment",
    "startedAt": "2023-06-11T08:22:45.000Z",
    "createdAt": "2023-06-11 11:38:21",
    "updatedAt": null
  },
  {
    "id": "e5249007-dc46-46cd-b3aa-0a7b639f9dc6",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Life",
    "startedAt": "2023-06-11T08:22:45.000Z",
    "createdAt": "2023-06-11 11:38:21",
    "updatedAt": null
  },
  {
    "id": "33041df6-516b-4ce8-b92d-0f1f39fc6b12",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "Getting ready for the day",
    "startedAt": "2023-06-11T08:22:45.000Z",
    "createdAt": "2023-06-11 11:38:21",
    "updatedAt": null
  },
  {
    "id": "f2d59f51-e785-4425-b1c3-e8e801afd4bc",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> City",
    "startedAt": "2023-06-11T08:35:00.000Z",
    "createdAt": "2023-06-11 11:39:16",
    "updatedAt": null
  },
  {
    "id": "9cca55c6-ab3c-4f26-b1d8-1f3b8f96d131",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Walking\n\nto the café",
    "startedAt": "2023-06-11T08:35:00.000Z",
    "createdAt": "2023-06-11 11:39:16",
    "updatedAt": null
  },
  {
    "id": "f2521071-146b-4d56-b56a-212ce1805b59",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> Café La Pelle",
    "startedAt": "2023-06-11T09:50:00.000Z",
    "createdAt": "2023-06-11 10:05:14",
    "updatedAt": null
  },
  {
    "id": "546e631a-f3a3-4b3d-b483-ea6b7f6b049e",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Life",
    "startedAt": "2023-06-11T09:50:00.000Z",
    "createdAt": "2023-06-11 10:05:14",
    "updatedAt": null
  },
  {
    "id": "bf064b94-4494-47a1-adea-0032efd588dd",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Morning coffee\n\n<!-- > pomo-cli -->\n\n<!--  -->\n\n<!-- Create a strava integration to import data into a \"strava\" stream -->\n\n<!--  -->",
    "startedAt": "2023-06-11T09:50:00.000Z",
    "createdAt": "2023-06-11 10:05:14",
    "updatedAt": null
  },
  {
    "id": "70752ebe-87c6-4a4a-9992-7e55bc3182f6",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Pomo",
    "startedAt": "2023-06-11T10:05:16.870Z",
    "createdAt": "2023-06-11 10:05:26",
    "updatedAt": null
  },
  {
    "id": "5e868c51-baac-4454-84f2-07f666cfca4a",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> pomo-cli\n\nCreate a strava integration to import data into a \"strava\" stream",
    "startedAt": "2023-06-11T10:05:16.870Z",
    "createdAt": "2023-06-11 10:05:26",
    "updatedAt": null
  },
  {
    "id": "6022f951-69f3-4500-8213-c644b3eec66e",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> City",
    "startedAt": "2023-06-11T11:16:12.354Z",
    "createdAt": "2023-06-11 11:16:34",
    "updatedAt": null
  },
  {
    "id": "f091a5b2-0bad-4247-adcb-15181d8a9635",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Life",
    "startedAt": "2023-06-11T11:16:12.354Z",
    "createdAt": "2023-06-11 11:16:34",
    "updatedAt": null
  },
  {
    "id": "4ccdf216-c89e-459d-b4f4-a0ff3a96ec51",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Walking\n\nHeading back to the apartment",
    "startedAt": "2023-06-11T11:16:12.354Z",
    "createdAt": "2023-06-11 11:16:34",
    "updatedAt": null
  },
  {
    "id": "a772f742-73f0-4fef-aa57-e4c0c79b0b2b",
    "streamId": "1396e0ea-55c1-4abf-9056-c7a72af127f0",
    "value": "> Marika's Apartment",
    "startedAt": "2023-06-11T11:33:50.399Z",
    "createdAt": "2023-06-11 11:34:14",
    "updatedAt": null
  },
  {
    "id": "a96e3584-e62a-418c-9cba-00358f00b8af",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Pomo",
    "startedAt": "2023-06-11T11:33:50.399Z",
    "createdAt": "2023-06-11 11:34:14",
    "updatedAt": null
  },
  {
    "id": "dea0ba76-efa8-4e38-bd8e-8f2a4a53ca78",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> pomo-cli\n\nDebugging issues with the `pull-strava` command.",
    "startedAt": "2023-06-11T11:33:50.399Z",
    "createdAt": "2023-06-11 11:34:14",
    "updatedAt": null
  },
  {
    "id": "a2669f11-a040-4fd8-9503-ce262d5d4e38",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Life",
    "startedAt": "2023-06-11T11:40:07.127Z",
    "createdAt": "2023-06-11 11:40:22",
    "updatedAt": null
  },
  {
    "id": "b72f54cf-370e-457f-964b-d2dd737f5a07",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Lunch\n\nHelping Marika prepare lunch",
    "startedAt": "2023-06-11T11:40:07.127Z",
    "createdAt": "2023-06-11 11:40:22",
    "updatedAt": null
  },
  {
    "id": "78ad9bc6-8a98-4375-83fd-30ded51dd4e0",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Sleep",
    "startedAt": "2023-06-11T12:25:00.000Z",
    "createdAt": "2023-06-11 13:22:38",
    "updatedAt": null
  },
  {
    "id": "e316348e-70d1-481e-830f-bc5c2e6b71fc",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Nap\n\n20min nap",
    "startedAt": "2023-06-11T12:25:00.000Z",
    "createdAt": "2023-06-11 13:22:38",
    "updatedAt": null
  },
  {
    "id": "4a39d389-63ad-49a4-af18-5d2022c8eed8",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Life",
    "startedAt": "2023-06-11T12:45:00.000Z",
    "createdAt": "2023-06-11 13:23:18",
    "updatedAt": null
  },
  {
    "id": "513995a3-bf85-41ba-9f9d-7866682acc36",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Food, Dishes\n\nPreparing strawberries and cream with Marika",
    "startedAt": "2023-06-11T12:45:00.000Z",
    "createdAt": "2023-06-11 13:23:18",
    "updatedAt": null
  },
  {
    "id": "7c914734-2e64-4bad-988f-2d5b4400f5e5",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Shopping",
    "startedAt": "2023-06-11T13:23:21.208Z",
    "createdAt": "2023-06-11 13:24:27",
    "updatedAt": null
  },
  {
    "id": "bc551c11-325a-4950-b19b-f8e32ca51d2d",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Sandals\n\nOrder another pair of Xero Sandals",
    "startedAt": "2023-06-11T13:23:21.208Z",
    "createdAt": "2023-06-11 13:24:27",
    "updatedAt": null
  },
  {
    "id": "bf421eeb-22d6-4b05-98e0-679101deaedb",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> SIM Card\n\nHaving another crack at getting an SFR sim card...",
    "startedAt": "2023-06-11T13:43:30.842Z",
    "createdAt": "2023-06-11 14:10:55",
    "updatedAt": null
  },
  {
    "id": "9af1cc2d-f974-4a5c-8674-c5ff3797be74",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> Shirt\n\nGoing to order a Wool&Prince shirt",
    "startedAt": "2023-06-11T14:11:05.998Z",
    "createdAt": "2023-06-11 14:11:20",
    "updatedAt": null
  },
  {
    "id": "220aab9c-cdf2-45cd-9d65-5f6c8e471a9a",
    "streamId": "ab78502d-6bf9-46b7-8d02-14acd02f275a",
    "value": "> Pomo",
    "startedAt": "2023-06-11T14:45:14.015Z",
    "createdAt": "2023-06-11 14:46:22",
    "updatedAt": null
  },
  {
    "id": "64fa7a26-8009-4a47-9d45-0537992a7765",
    "streamId": "f69fd534-e80d-4d9f-bf10-4aabcc030db5",
    "value": "> pomo-web\n\nLet's build a basic web client for Pomo. \nGood chance to try out sveltekit.\n\nGoal: display current status",
    "startedAt": "2023-06-11T14:45:14.015Z",
    "createdAt": "2023-06-11 14:46:23",
    "updatedAt": null
  }
]

 export { streamList, pointList }

