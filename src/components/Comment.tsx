import { useQuery } from "@tanstack/react-query"
import { fetchUsers } from "../api/issuesApi"
import { Issue, IssueCommentsProps, User } from "../api/types"
import { defaultUsers } from "../helpers/defaultData"
import { relativeDate } from "../helpers/relativeDate"

export default function Comment({
  comment,
  createdBy,
  createdDate,
}: IssueCommentsProps) {
  const commentQuery = useQuery<User>(["comment", { createdBy }], () =>
    fetchUsers(createdBy)
  )
  // const commentQuery = defaultUsers

  if (commentQuery.isLoading)
    return (
      <div className="comment">
        <div>
          <div className="comment-header">Loading...</div>
        </div>
      </div>
    )

  return (
    <div className="comment">
      {/* <img src={commentQuery[0].profilePictureUrl} alt="Commenter Avatar" />
      <div>
        <div className="comment-header">
          <span>{commentQuery[0].name}</span> commented{" "}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div> */}

      <img src={commentQuery.data?.profilePictureUrl} alt="Commenter Avatar" />
      <div>
        <div className="comment-header">
          <span>{commentQuery.data?.name}</span> commented{" "}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  )
}
