'use client'
import { useId } from 'react'
import { Button } from './button.js'
import { Progress } from './progress.js'
export interface UploadAttachment {
  id: string
  name: string
  state: 'queued' | 'uploading' | 'complete' | 'error'
  /** Percentage from 0 to 100. Omit when the upload's progress is unknown. */
  progress?: number
  error?: string
}
export interface FileUploadProps {
  label: string
  hint?: string
  error?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  attachments: readonly UploadAttachment[]
  onFilesSelected: (files: File[]) => void
  onRetry?: (id: string) => void
  onRemove?: (id: string) => void
}
/** File selection and upload status. Validation, storage, cancellation and transfer belong to the host. */
export function FileUpload({
  label,
  hint,
  error,
  accept,
  multiple,
  disabled,
  attachments,
  onFilesSelected,
  onRetry,
  onRemove,
}: FileUploadProps) {
  const id = useId()
  return (
    <div className="cui-stack cui-file-upload">
      <div className="cui-field">
        <label htmlFor={id} className="cui-label">
          {label}
        </label>
        <input
          id={id}
          className="cui-input"
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-note` : undefined}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? [])
            event.target.value = ''
            if (files.length) onFilesSelected(files)
          }}
        />
        {(error || hint) && (
          <p id={`${id}-note`} className={error ? 'cui-negative' : 'cui-secondary'}>
            {error || hint}
          </p>
        )}
      </div>
      <ul className="cui-attachment-list" aria-label={`${label} files`}>
        {attachments.map((file) => (
          <li key={file.id} className="cui-attachment">
            <div className="cui-stack">
              <span>{file.name}</span>
              {file.state === 'uploading' ? (
                <Progress label={`Uploading ${file.name}`} value={file.progress} />
              ) : (
                <span className={file.state === 'error' ? 'cui-negative' : 'cui-secondary'}>
                  {file.state === 'error'
                    ? file.error || 'Upload failed.'
                    : file.state === 'complete'
                      ? 'Uploaded'
                      : 'Queued'}
                </span>
              )}
            </div>
            <div className="cui-row">
              {file.state === 'error' && onRetry && (
                <Button
                  variant="quiet"
                  disabled={disabled}
                  aria-label={`Retry ${file.name}`}
                  onClick={() => onRetry(file.id)}
                >
                  Retry
                </Button>
              )}
              {onRemove && (
                <Button
                  variant="quiet"
                  disabled={disabled}
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onRemove(file.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
