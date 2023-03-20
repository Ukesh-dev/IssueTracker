import { useQuery } from "@tanstack/react-query"
import { fetchAllLabels } from "../../api/issuesApi"
import { defaultLabels } from "../defaultData"

export const useLabelsData = () => {
  const labelsData = useQuery(["labels"], () => fetchAllLabels(), {
    staleTime: 1000 * 60 * 60,
    placeholderData: defaultLabels,
  })
  return labelsData
}
