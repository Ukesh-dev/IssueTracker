import { useQuery } from "@tanstack/react-query"
import { fetchAllLabels } from "../api/issuesApi"
import { Labels } from "../api/types"
import { useLabelsData } from "../helpers/hooks/useLabelsData"

type LabelListProps = {
  selected: string[]
  toggle: (labelId: Labels) => void
}
export default function LabelList({ selected, toggle }: LabelListProps) {
  const labelsQuery = useQuery<Labels[]>(["labels"], fetchAllLabels)
  // const labelsQuery = useLabelsData()
  return (
    <div className="labels">
      <h3>Labels</h3>
      {labelsQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {labelsQuery.data &&
            labelsQuery.data.map((label) => (
              <li key={label.id}>
                <button
                  onClick={() => toggle(label)}
                  className={`label ${
                    selected.includes(label.id) ? "selected " : ""
                  }${label.color}`}
                >
                  {label.name}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
