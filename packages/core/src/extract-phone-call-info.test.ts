import assert from 'node:assert'
import * as process from 'node:process'
import { describe, expect, test } from 'vitest'
import { extractPhoneCallInfo } from './extract-phone-call-info.js'

const openaiApiKey = process.env['OPENAI_API_KEY']
assert(openaiApiKey, 'OPENAI_API_KEY environment variable is required')

type Example = {
  description: string
  content: string
  expected: {
    name: string
    calls: Array<{
      date: string
      time: string
      durationMinutes: number
    }>
  }
}

const exampleList: Example[] = [
  {
    description: 'Outgoing call from Today',
    content: `12:16
< Search
< Recent
Edit
ST
Shawn Townsend
message
iPhone
video
mail
Today
10:44 Outgoing Call
36 minutes
iPhone RECENT
+64 22 821 1239
FaceTime
home
shawn@townsend.com
Notes
Favourites
Recent
Contacts
Keypad
Voicemail`,
    expected: {
      name: 'Shawn Townsend',
      calls: [
        {
          date: 'Today',
          time: '10:44',
          durationMinutes: 36,
        },
      ],
    },
  },
  {
    description: 'Outgoing call from Yesterday',
    content: `12:22
{Recent
Edit
CD
Courtney Drake
message
WhatsApp
video
mail
Yesterday
22:32 Outgoing Call
27 minutes
WhatsApp
+33 6 98 99 11
mobile
+33 6 66 72 44 03
WhatsApp RECENT
+33 6 98 99 11 30
FaceTime
home
courtney.drake@gmail.com
Favourites
Recent
Contacts
Keypad
Voicemail`,
    expected: {
      name: 'Courtney Drake',
      calls: [
        {
          date: 'Yesterday',
          time: '22:32',
          durationMinutes: 27,
        },
      ],
    },
  },
  {
    description: 'Incoming call from yesterday',
    content: `12:23
. a 70
{Recent
Edit
FG
Florine Gentry
Mish Guru
message
call
video
mail
Yesterday
08:46 Incoming Call
8 minutes
NZ
+64 27 909 1298
German RECENT
+49 163 3200485
FaceTime
home
jlagentry@gmail.com
Notes
Favourites
Recent
g
Contacts
Keypad
Voicemail`,
    expected: {
      name: 'Florine Gentry',
      calls: [
        {
          date: 'Yesterday',
          time: '08:46',
          durationMinutes: 8,
        },
      ],
    },
  },
  {
    description: 'Outgoing call from 2 days ago',
    content: `12:23
{Recent
Edit
CD
Courtney Drake
message
WhatsApp
video
mail
14 July 2023
22:20 Outgoing Call
8 minutes
WhatsApp
+33 6 98 99 11
mobile
+33 6 66 72 44 03
WhatsApp RECENT
+33 6 98 99 11 30
FaceTime
home
courtney.drake@gmail.com
Favourites
Recent
Contacts
Keypad
Voicemail`,
    expected: {
      name: 'Courtney Drake',
      calls: [
        {
          date: '14 July 2023',
          time: '22:20',
          durationMinutes: 8,
        },
      ],
    },
  },
  {
    description: 'Multiple outgoing call from 3 days ago',
    content: `12:23
. ₴ 69
< Recent
Edit
ST
Shawn Townsend
message
iPhone
video
mail
10 July 2023
08:30 Outgoing Call
3 minutes
08:06 Outgoing Call
10 minutes
iPhone RECEND
+64 22 821 1239
FaceTime
home
shawn@townsend.com
Notes
Favourites
Recent
Contacts
Keypad
Voicemail`,
    expected: {
      name: 'Shawn Townsend',
      calls: [
        {
          date: '10 July 2023',
          time: '08:30',
          durationMinutes: 3,
        },
        {
          date: '10 July 2023',
          time: '08:06',
          durationMinutes: 10,
        },
      ],
    },
  },
  {
    description: 'Incoming & Outgoing call from 4 days ago',
    content: `12:24
. ₴ 69
{Recent
Edit
ST
Shawn Townsend
message
call
video
mail
9 July 2023
11:33 Outgoing Call
10 minutes
11:33 Cancelled Call
11:19 Incoming Call
12 minutes
11:18 Cancelled Call
11:17 Cancelled Call
iPhone RECENT
+64 22 821 1239
FaceTime
home
shawn@townsend.com
Favourites
Recent
Contacts
Keypad
Voicemail`,
    expected: {
      name: 'Shawn Townsend',
      calls: [
        {
          date: '9 July 2023',
          time: '11:33',
          durationMinutes: 10,
        },
        {
          date: '9 July 2023',
          time: '11:19',
          durationMinutes: 12,
        },
      ],
    },
  },
  {
    description: 'Incoming video call from today',
    content: `12:42
~ Phone
< Calls
..!| 4G 57
Contact Info
Edit
Courtney Drake
+33 6 98 99 11 30
message
audio
video
Hey there! I am using WhatsApp.
Today
12:24
• Incoming Video Call
17 minutes, 34 seconds (125.9 MB)
Media, Links, and Docs
Starred Messages
595 >
2 >
Mute
No >
Wallpaper & Sound
Save to Camera Roll
)
Default
Encryption
Messages and calls are endsto-end`,
    expected: {
      name: 'Courtney Drake',
      calls: [
        {
          date: 'Today',
          time: '12:24',
          durationMinutes: 17,
        },
      ],
    },
  },
]

describe('extractPhoneCallInfo', () => {
  test.each(exampleList)('$description', async (example) => {
    const actual = await extractPhoneCallInfo({
      openaiApiKey,
      input: example.content,
    })
    expect(actual).toEqual(example.expected)
  })
})
