import React, { useCallback } from 'react'
import TextInput from 'ink-text-input'
import yn from 'yn'

const noop = () => {}

type ConfirmInputProps = {
  isChecked?: boolean
  placeholder?: string
  onChange?: (value: string) => void
  onSubmit?: (value: boolean) => void
  value?: string
}

const ConfirmInput = (props: ConfirmInputProps) => {
  const {
    isChecked = false,
    onChange = noop,
    onSubmit = noop,
    placeholder = '',
    value = '',
  } = props

  const handleSubmit = useCallback(
    (newValue: string) => {
      onSubmit(yn(newValue, { default: isChecked }))
    },
    [isChecked, onSubmit],
  )

  return (
    <TextInput
      {...props}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onSubmit={handleSubmit}
    />
  )
}

export { ConfirmInput }
