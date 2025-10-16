"use client"

import * as React from 'react'
import { FormProvider, type UseFormReturn } from 'react-hook-form'

export function RHFProvider({ form, children }: { form: UseFormReturn<any, any, any>; children: React.ReactNode }) {
  return <FormProvider {...form}>{children}</FormProvider>
}
