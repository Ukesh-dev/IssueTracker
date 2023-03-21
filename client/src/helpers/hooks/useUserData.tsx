import { useQuery } from "@tanstack/react-query"
import { fetchUsers } from "../../api/issuesApi"
import { User } from "../../api/types"

export function useUserData(userId: string) {
  const usersData = useQuery<User>(
    ["users", userId],
    () => fetchUsers(userId),
    {
      staleTime: 1000 * 60 * 5,
    }
  )

  return usersData
}
