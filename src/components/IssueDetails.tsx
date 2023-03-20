import { useQueries, useQuery } from "@tanstack/react-query"
import { GoIssueClosed, GoIssueOpened } from "react-icons/go"
import { useParams } from "react-router-dom"
import { fetchIssueComments, fetchIssueDetail } from "../api/issuesApi"
import { Issue, IssueCommentsProps, IssueNumberProps } from "../api/types"
import {
  defaultComments,
  defaultIssue,
  possibleStatus,
} from "../helpers/defaultData"
import { relativeDate } from "../helpers/relativeDate"
import Comment from "./Comment"
import { Label } from "./Label"

export const IssueNumber = ({
  title,
  number,
  status = "todo",
  createdBy,
  createdDate,
  comments,
}: IssueNumberProps) => {
  const statusObject = possibleStatus.find((pstatus) => pstatus.id === status)
  return (
    <header>
      <h2>
        {title} <span>#{number}</span>
      </h2>
      <div>
        <span
          className={
            status === "done" || status === "cancelled" ? "closed" : "open"
          }
        >
          {status === "done" || status === "cancelled" ? (
            <GoIssueClosed />
          ) : (
            <GoIssueOpened />
          )}
          {statusObject?.label}
        </span>
        <span className="created-by">{createdBy}</span>
        opened this issue {relativeDate(createdDate)} · {comments.length}{" "}
        comments
      </div>
    </header>
  )
}
export default function IssueDetails() {
  const { number } = useParams()
  const issueQuery = useQuery<IssueNumberProps>(["issues", number], () =>
    fetchIssueDetail(number!)
  )
  // const issueQuery = defaultIssue
  const issueComments = useQuery<IssueCommentsProps[]>(
    ["issues", number, "comments"],
    () => fetchIssueComments(`${number}`)
  )
  // const issueComments = defaultComments
  //TODO Pagination

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>{issueQuery.isSuccess && <IssueNumber {...issueQuery.data} />}</>
      )}
      <main>
        <section>
          {issueComments.data &&
            issueComments.data.map((comments) => (
              <Comment
                key={comments.id}
                id={comments.id}
                issue_id={comments.issue_id}
                comment={comments.comment}
                createdBy={comments.createdBy}
                createdDate={comments.createdDate}
              />
            ))}
        </section>
        <aside className="issue-detail">
          <div className="issue-detail--assignee">
            <div>Assignee</div>
            {!issueQuery.isLoading && (
              <span>
                {issueQuery.isSuccess ? issueQuery.data.assignee : "none"}
              </span>
            )}
          </div>
          <div className="issue_detail--labels">
            <div>Labels</div>
            {!issueQuery.isLoading && (
              <span>
                {issueQuery.isSuccess
                  ? issueQuery.data.labels.map((label) => (
                      <Label
                        label={label}
                        style={{
                          borderRadius: "999px",
                          padding: ".1rem .3rem",
                          border: "solid 1px",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      />
                    ))
                  : "none"}
              </span>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}

// <IssueNumber {...issueQuery} />

// <main>
//   <section>
//     {issueComments.map((comments) => (
//       <Comment
//         key={comments.id}
//         id={comments.id}
//         issue_id={comments.issue_id}
//         comment={comments.comment}
//         createdBy={comments.createdBy}
//         createdDate={comments.createdDate}
//       />
//     ))}
//   </section>
//   <aside className="issue-detail">
//     <div className="issue-detail--assignee">
//       <div>Assignee</div>
//       <span>{issueQuery.assignee ? issueQuery.assignee : "none"}</span>
//     </div>
//     <div className="issue_detail--labels">
//       <div>Labels</div>
//       <span>
//         {issueQuery.labels
//           ? issueQuery.labels.map((label) => (
//               <Label
//                 label={label}
//                 style={{
//                   borderRadius: "999px",
//                   padding: ".1rem .3rem",
//                   border: "solid 1px",
//                   textAlign: "center",
//                   whiteSpace: "nowrap",
//                 }}
//               />
//             ))
//           : "none"}
//       </span>
//     </div>
//   </aside>
