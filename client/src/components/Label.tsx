import { Labels } from "../api/types"
import { defaultLabels } from "../helpers/defaultData"

export function Label({
  label,
  style,
}: {
  label: Labels
  style?: React.CSSProperties
}) {
  const labelsQuery = defaultLabels.find(
    (queryLable) => queryLable.name === label.name
  )

  return (
    <span className={`${label.name} ${label.color}`} style={style}>
      {labelsQuery?.name}
    </span>
  )
}
