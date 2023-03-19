const possibleStatus = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To-do" },
  { id: "inProgress", label: "In Progress" },
  { id: "done", label: "Done" },
  { id: "cancelled", label: "Cancelled" },
]
type StatusSelectProps = {
  value: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  noEmptyOption?: boolean
}

export function StatusSelect({
  value,
  onChange,
  noEmptyOption = false,
}: StatusSelectProps) {
  return (
    <select value={value} onChange={onChange} className="status-select">
      {noEmptyOption ? null : (
        <option value="">Select a status to filter</option>
      )}
      {possibleStatus.map((status) => (
        <option value={status.id} key={status.id}>
          {status.label}
        </option>
      ))}
    </select>
  )
}
