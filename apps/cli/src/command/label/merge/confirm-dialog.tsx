import React, { useCallback, useState } from 'react'
import { render, Box, Text } from 'ink'
import type { Instance } from 'ink'
import type { Label } from '@stayradiated/pomo-doc'
import { ConfirmInput } from '#src/components/confirm-input.js'

type MergeQuestionProps = {
  srcLabel: Label
  destLabel: Label
  onSubmit: (value: boolean) => void
}

const MergeQuestion = (props: MergeQuestionProps) => {
  const { srcLabel, destLabel, onSubmit } = props

  const [value, setValue] = useState<string>('')
  const [answer, setAnswer] = useState<string | undefined>(undefined)

  const handleSubmit = useCallback(
    (submitValue: boolean) => {
      if (!submitValue) {
        setAnswer('Exiting without merging…')
        onSubmit(false)
        return
      }

      setAnswer('Merging labels!')
      onSubmit(true)
    },
    [setAnswer],
  )

  return (
    <>
      <Box flexDirection="column">
        <Text color="yellow">
          • <Text color="magenta">{srcLabel.id.slice(0, 7)}</Text>{' '}
          <Text color="red">{srcLabel.name}</Text>
        </Text>
        <Text color="yellow">
          → <Text color="magenta">{destLabel.id.slice(0, 7)}</Text>{' '}
          <Text color="green">{destLabel.name}</Text>
        </Text>

        <Box>
          <Text>Are you sure you want to merge? (y/N) </Text>

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
  srcLabel: Label
  destLabel: Label
}

const confirmDialog = async (
  options: ConfirmDialogOptions,
): Promise<boolean> => {
  const { srcLabel, destLabel } = options

  return new Promise((resolve) => {
    let instance: Instance

    const onSubmit = (value: boolean) => {
      resolve(value)
      instance.unmount()
    }

    instance = render(
      <MergeQuestion
        srcLabel={srcLabel}
        destLabel={destLabel}
        onSubmit={onSubmit}
      />,
    )
  })
}

export { confirmDialog }
