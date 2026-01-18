import type { Label } from '@stayradiated/pomo-doc'
import { Box, Text, render } from 'ink'
import React, { useCallback, useState } from 'react'
import { ConfirmInput } from '#src/components/confirm-input.js'

type MergeQuestionProps = {
  label: Label
  pointCount: number
  onSubmit: (value: boolean) => void
}

const MergeQuestion = (props: MergeQuestionProps) => {
  const { label, pointCount, onSubmit } = props

  const [value, setValue] = useState<string>('')
  const [answer, setAnswer] = useState<string | undefined>(undefined)

  const handleSubmit = useCallback(
    (submitValue: boolean) => {
      if (!submitValue) {
        setAnswer('Exiting without deleting…')
        onSubmit(false)
        return
      }

      setAnswer('Deleting label!')
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
          • Used by{' '}
          <Text color={pointCount > 0 ? 'red' : 'green'}>
            {pointCount} point(s){' '}
          </Text>
        </Text>

        <Box>
          <Text>Are you sure you want to delete this label? (y/N) </Text>

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
  pointCount: number
}

const confirmDialog = async (
  options: ConfirmDialogOptions,
): Promise<boolean> => {
  const { label, pointCount } = options

  return new Promise((resolve) => {
    const onSubmit = (value: boolean) => {
      resolve(value)
      instance.unmount()
    }

    const instance = render(
      <MergeQuestion
        label={label}
        pointCount={pointCount}
        onSubmit={onSubmit}
      />,
    )
  })
}

export { confirmDialog }
