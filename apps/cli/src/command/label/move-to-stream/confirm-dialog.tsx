import type { Label, Stream } from '@stayradiated/pomo-doc'
import { Box, Text, render } from 'ink'
import React, { useCallback, useState } from 'react'
import { ConfirmInput } from '#src/components/confirm-input.js'

type MergeQuestionProps = {
  label: Label
  srcStream: Stream
  destStream: Stream
  onSubmit: (value: boolean) => void
}

const MergeQuestion = (props: MergeQuestionProps) => {
  const { label, srcStream, destStream, onSubmit } = props

  const [value, setValue] = useState<string>('')
  const [answer, setAnswer] = useState<string | undefined>(undefined)

  const handleSubmit = useCallback(
    (submitValue: boolean) => {
      if (!submitValue) {
        setAnswer('Exiting without merging…')
        onSubmit(false)
        return
      }

      setAnswer('Moving label!')
      onSubmit(true)
    },
    [onSubmit],
  )

  return (
    <>
      <Box flexDirection="column">
        <Text color="yellow">
          • <Text color="magenta">{label.id.slice(0, 7)}</Text>{' '}
          <Text color="green">{label.name}</Text>
        </Text>
        <Text color="yellow">
          • <Text color="magenta">{srcStream.id.slice(0, 7)}</Text>{' '}
          <Text color="green">{srcStream.name}</Text> →{' '}
          <Text color="magenta">{destStream.id.slice(0, 7)}</Text>{' '}
          <Text color="green">{destStream.name}</Text>
        </Text>

        <Box>
          <Text>Are you sure you want to move? (y/N) </Text>

          {answer === undefined ? (
            <ConfirmInput
              value={value}
              onChange={setValue}
              onSubmit={handleSubmit}
            />
          ) : (
            <>
              <Text>{value}</Text>
            </>
          )}
        </Box>
      </Box>
      <Box>
        <Text>{answer}</Text>
      </Box>
    </>
  )
}

type ConfirmDialogOptions = {
  label: Label
  srcStream: Stream
  destStream: Stream
}

const confirmDialog = async (
  options: ConfirmDialogOptions,
): Promise<boolean> => {
  const { label, srcStream, destStream } = options

  return new Promise((resolve) => {
    const onSubmit = (value: boolean) => {
      resolve(value)
      instance.unmount()
    }

    const instance = render(
      <MergeQuestion
        label={label}
        srcStream={srcStream}
        destStream={destStream}
        onSubmit={onSubmit}
      />,
    )
  })
}

export { confirmDialog }
