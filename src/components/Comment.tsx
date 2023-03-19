import { fetchUsers } from "../api/issuesApi"
import { IssueCommentsProps } from "../api/types"
import { relativeDate } from "../helpers/relativeDate"

export default function Comment({
  comment,
  createdBy,
  createdDate,
}: IssueCommentsProps) {
  const userQuery = fetchUsers(createdBy)

  if (userQuery.isLoading)
    return (
      <div className="comment">
        <div>
          <div className="comment-header">Loading...</div>
        </div>
      </div>
    )

  return (
    <div className="comment">
      <img src={userQuery.data.profilePictureUrl} alt="Commenter Avatar" />
      <div>
        <div className="comment-header">
          <span>{userQuery.data.name}</span> commented{" "}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  )
}
