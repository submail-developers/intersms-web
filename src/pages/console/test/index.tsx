import React, { useState } from 'react'
import { DatePicker, Form } from 'antd'
import type { DatePickerProps } from 'antd'
import type { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker

type RangeValue = [Dayjs | null, Dayjs | null] | null

export default function Test() {
  const [form] = Form.useForm()
  const [value, setValue] = useState<RangeValue>(null)

  const disabledDate: DatePickerProps['disabledDate'] = (current, { from }) => {
    if (from) {
      return Math.abs(current.diff(from, 'days')) >= 7
    }

    return false
  }

  return (
    <Form name='basic' form={form} wrapperCol={{ span: 24 }} autoComplete='off'>
      <RangePicker
        value={value}
        disabledDate={disabledDate}
        onChange={setValue}
      />
    </Form>
  )
}
