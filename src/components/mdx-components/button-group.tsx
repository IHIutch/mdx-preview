import type { VariantProps } from 'cva'
import { cva } from 'cva.config'
import React from 'react'

const buttonGroup = cva({
  base: 'usa-button-group',
  variants: {
    segmented: {
      true: 'usa-button-group--segmented',
    },
  },
})

export type ButtonGroupProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof buttonGroup>

export function ButtonGroup({
  children,
  className,
  segmented,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      {...props}
      className={buttonGroup({ segmented, className })}
      role="group"
    >
      {/* eslint-disable-next-line react/no-children-map */}
      {React.Children.map(children, child => (
        <div className="usa-button-group__item">
          {child}
        </div>
      ))}
    </div>
  )
}
