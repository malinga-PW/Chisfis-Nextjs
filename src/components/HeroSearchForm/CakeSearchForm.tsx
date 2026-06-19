'use client'

import clsx from 'clsx'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ButtonSubmit, DateRangeField, LocationInputField, TimePickerField } from './ui'

interface Props {
  className?: string
  formStyle: 'default' | 'small'
}

export const CakeSearchForm = ({ className, formStyle = 'default' }: Props) => {
  const router = useRouter()
  const [deliveryTime, setDeliveryTime] = useState('10:00 AM')

  const handleFormSubmit = (formData: FormData) => {
    const formDataEntries = Object.fromEntries(formData.entries())
    const location = formDataEntries['location'] as string
    let url = '/cakes'
    if (location) {
      url = url + `?location=${encodeURIComponent(location)}`
    }
    router.push(url)
  }

  return (
    <Form
      className={clsx(
        'relative z-10 flex w-full rounded-full bg-white [--form-bg:var(--color-white)] dark:bg-neutral-800 dark:[--form-bg:var(--color-neutral-800)]',
        className,
        formStyle === 'small' && 'custom-shadow-1',
        formStyle === 'default' && 'shadow-xl dark:shadow-2xl'
      )}
      action={handleFormSubmit}
    >
      <LocationInputField className="hero-search-form__field-after flex-1" fieldStyle={formStyle} />
      <DateRangeField
        className="hero-search-form__field-before hero-search-form__field-after flex-1"
        fieldStyle={formStyle}
        isOnlySingleDate
      />
      <TimePickerField
        className="hero-search-form__field-before hero-search-form__field-after flex-1"
        fieldStyle={formStyle}
        value={deliveryTime}
        onChange={setDeliveryTime}
      />
      <ButtonSubmit fieldStyle={formStyle} className="z-10" />
    </Form>
  )
}
