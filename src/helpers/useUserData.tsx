import { useQuery } from "@tanstack/react-query"
import { fetchUsers } from "../api/issuesApi"

export function useUserData(userId: string) {
  const usersData = useQuery(["users", userId], () => fetchUsers(userId), {
    staleTime: 1000 * 60 * 5,
  })

  return usersData
}
