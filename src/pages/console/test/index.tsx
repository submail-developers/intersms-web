import React, { useState } from 'react'
import { DatePicker, Form } from 'antd'
import type { DatePickerProps } from 'antd'
import type { Dayjs } from 'dayjs'
import type { RangePickerProps } from 'antd/es/date-picker'

const { RangePicker } = DatePicker

export default function Test() {
  const [form] = Form.useForm()

  const disabledDate: RangePickerProps['disabledDate'] = (
    current,
    { from },
  ) => {
    if (from) {
      return Math.abs(current.diff(from, 'days')) >= 7
    }

    return false
  }

  return (
    <Form name='basic' form={form} wrapperCol={{ span: 24 }} autoComplete='off'>
      <RangePicker disabledDate={disabledDate} />
    </Form>
  )
}
