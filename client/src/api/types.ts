//* Format & types of the data.
export type User = {
  id: string
  name: string
  profilePictureUrl: string
}

export type Issue = {
  id: string
  title: string
  number: number
  status: string
  assignee: string
  comments: number
  createdBy: string
  createdDate: Date
  label_id: string
}
export type Labels = { id: string; name: string; color: string }

export type SearchType = {
  count: number
  items: Issue[]
}

export type IssueNumberProps = {
  title: string
  number: number
  assignee: string
  status: string | string[]
  createdBy: string
  createdDate: Date
  comments: string[]
  label_id: string
}
export type IssueCommentsProps = {
  comment: string
  createdBy: string
  createdDate: Date
  createdById: string
  id: string
  issue_id: string
}
export type possibleStatusType = { id: string; label: string }
