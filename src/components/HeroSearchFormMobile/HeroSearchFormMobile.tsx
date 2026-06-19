'use client'

import { ButtonCircle } from '@/shared/Button'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonThird from '@/shared/ButtonThird'
import T from '@/utils/getT'
import { CloseButton, Dialog, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { FilterVerticalIcon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTimeoutFn } from 'react-use'
import { CakeTypeSelectField, DateRangeField, LocationInputField, TimePickerField } from '../HeroSearchForm/ui'

const HeroSearchFormMobile = ({ className }: { className?: string }) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1)
  const [showDialog, setShowDialog] = useState(false)
  const [deliveryTime, setDeliveryTime] = useState('10:00 AM')
  const [cakeType, setCakeType] = useState('All Types')

  function closeModal() {
    setShowModal(false)
  }

  function openModal() {
    setShowModal(true)
  }

  const handleFormSubmit = (formData: FormData) => {
    const formDataEntries = Object.fromEntries(formData.entries())
    const location = formDataEntries['location'] as string
    let url = '/cakes'
    if (location) {
      url = url + `?location=${encodeURIComponent(location)}`
    }
    router.push(url)
    closeModal()
  }

  const renderButtonOpenModal = () => {
    return (
      <button
        onClick={openModal}
        className="relative flex w-full items-center rounded-full border border-neutral-200 px-4 py-2 pe-11 shadow-lg dark:border-neutral-600"
      >
        <HugeiconsIcon icon={Search01Icon} size={20} color="currentColor" strokeWidth={1.5} />

        <div className="ms-4 flex-1 overflow-hidden text-start">
          <span className="block text-sm/5 font-medium">Delivery location</span>
          <span className="mt-px flex gap-2 text-sm/5 font-normal text-neutral-500 dark:text-neutral-400">
            Any location
          </span>
        </div>

        <span className="absolute end-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 transform items-center justify-center rounded-full border border-neutral-200 sm:flex dark:border-neutral-600 dark:text-neutral-300">
          <HugeiconsIcon icon={FilterVerticalIcon} size={20} color="currentColor" strokeWidth={1.5} />
        </span>
      </button>
    )
  }

  return (
    <div className={clsx(className, 'relative z-10 w-full max-w-lg')}>
      {renderButtonOpenModal()}
      <Dialog as="div" className="relative z-max" onClose={closeModal} open={showModal}>
        <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
          <div className="flex h-full">
            <DialogPanel
              transition
              className="relative flex-1 transition data-closed:translate-y-28 data-closed:opacity-0"
            >
              {showDialog && (
                <Form
                  action={handleFormSubmit}
                  className="relative flex h-full flex-1 flex-col justify-between px-4 py-6"
                >
                  <div className="absolute end-3 top-2 z-10">
                    <CloseButton color="light" as={ButtonCircle} className="size-7!">
                      <XMarkIcon className="size-4!" />
                    </CloseButton>
                  </div>

                  <div className="flex-1 space-y-6 pt-16">
                    <LocationInputField fieldStyle="default" />
                    <CakeTypeSelectField fieldStyle="default" value={cakeType} onChange={setCakeType} />
                    <DateRangeField fieldStyle="default" isOnlySingleDate />
                    <TimePickerField fieldStyle="default" value={deliveryTime} onChange={setDeliveryTime} />
                  </div>

                  <div className="flex justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
                    <ButtonThird
                      onClick={() => {
                        setShowDialog(false)
                        resetIsShowingDialog()
                      }}
                    >
                      {T['HeroSearchForm']['Clear all']}
                    </ButtonThird>
                    <ButtonPrimary type="submit">
                      <HugeiconsIcon icon={Search01Icon} size={16} />
                      <span>{T['HeroSearchForm']['search']}</span>
                    </ButtonPrimary>
                  </div>
                </Form>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default HeroSearchFormMobile
