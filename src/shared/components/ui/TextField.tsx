import { forwardRef, type InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, className, ...props }, ref) => (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} ref={ref} className={className ?? 'field-input'} {...props} />
      {error && <p className="field-error">{error}</p>}
    </div>
  ),
)
TextField.displayName = 'TextField'
