import OpenAI from 'openai'
import { z } from 'zod'
import { errorBoundary, errorBoundarySync } from '@stayradiated/error-boundary'

const getOpenAi = (apiKey: string) => {
  return new OpenAI({
    apiKey,
  })
}

const $ExtractPhoneCallInfoResult = z.object({
  name: z.string(),
  calls: z.array(
    z.object({
      date: z.string(),
      time: z.string(),
      durationMinutes: z.number(),
    }),
  ),
})

const $Response = z.object({
  choices: z.tuple([
    z.object({
      message: z.object({
        role: z.enum(['assistant']),
        function_call: z.object({
          name: z.string(),
          arguments: z.string(),
        }),
      }),
    }),
  ]),
})

type ExtractPhoneCallInfoResult = z.infer<typeof $ExtractPhoneCallInfoResult>

type ExtractPhoneCallInfoOptions = {
  openaiApiKey: string
  input: string
}

const extractPhoneCallInfo = async (
  options: ExtractPhoneCallInfoOptions,
): Promise<ExtractPhoneCallInfoResult | Error> => {
  const { openaiApiKey, input: userInput } = options

  const openai = getOpenAi(openaiApiKey)

  const messageList: OpenAI.Chat.Completions.ChatCompletionMessage[] = [
    {
      role: 'system',
      content: `Please extract the name and call log from the information that the user provides you.`,
    },
    {
      role: 'user',
      content: userInput,
    },
  ]

  const functionList: OpenAI.Chat.Completions.CompletionCreateParams.Function[] =
    [
      {
        name: 'extract_phone_call_info',
        description: `Extract the name and call log information. Ignore any cancelled calls.

###

Input:
  Shannon Patel
  Today
  10:42 Cancelled Call
  10:44 Outgoing Call
  36 minutes

Output:
  extract_phone_call_info({ name: "Shannon Patel", calls: [{ date: "Today", time: "10:44", durationMinutes: 36 }] })

###

Input:
  Iris Whitney
  Yesterday
  20:31 outgoing Call
  12 minutes
  23:09 Cancelled Call
  23:11 Incoming Call
  18 minutes

Output:
  extract_phone_call_info({ name: "Iris Whitney", calls: [{ date: "Yesterday", time: "20:31", durationMinutes: 12 }, { date: "Yesterday", time: "23:11", durationMinutes: 18 }] })

###

Input:
  Shawn Townsend
  10 July 2023
  15:59 Outgoing Call
  5 minutes
  16:04 Incoming Call
  7 minutes

Output:
  extractPhoneCallInfo({ name: "Shawn Townsend", calls: [{ date: "10 July 2023", time: "15:59", durationMinutes: 5 }, { date: "10 July 2023", time: "16:04", durationMinutes: 7 }] })

###`,
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the person who called.',
            },
            calls: {
              type: 'array',
              description: 'A list of calls',
              items: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string',
                    description:
                      'The date the call started. Example: "Today", "Yesterday" or "10 July 2023"',
                  },
                  time: {
                    type: 'string',
                    description:
                      'The time the call started. Example: "10:44", "23:11" or "15:59"',
                  },
                  durationMinutes: {
                    type: 'number',
                    description:
                      'The duration of the call rounded to the nearest minute.',
                  },
                },
              },
            },
          },
        },
      },
    ]

  const rawResponse = await errorBoundary(async () =>
    openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
      messages: messageList,
      functions: functionList,
      function_call: 'auto',
    }),
  )
  if (rawResponse instanceof Error) {
    return rawResponse
  }

  const response = errorBoundarySync(() => $Response.parse(rawResponse))
  if (response instanceof Error) {
    return response
  }

  const functionCallArguments =
    response.choices[0].message.function_call.arguments

  console.log('---')
  console.log(functionCallArguments)
  console.log('---')

  const extractPhoneCallInfoResult = errorBoundarySync(() =>
    $ExtractPhoneCallInfoResult.parse(JSON.parse(functionCallArguments)),
  )
  if (extractPhoneCallInfoResult instanceof Error) {
    return extractPhoneCallInfoResult
  }

  return {
    name: extractPhoneCallInfoResult.name,
    // Filter out any calls that have a duration of 0 minutes.
    calls: extractPhoneCallInfoResult.calls.filter(
      (call) => call.durationMinutes > 0,
    ),
  }
}

export { extractPhoneCallInfo }
