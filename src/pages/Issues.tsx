import LabelList from "../components/LabelList"
import { useState } from "react"
import { StatusSelect } from "../components/StatusSelect"
import { Link } from "react-router-dom"
import { Labels } from "../api/types"
import IssuesList from "../components/IssueList"

export default function Issues() {
  const [labels, setLabels] = useState<string[]>([])
  const [status, setStatus] = useState("")
  const [pageNum, setPageNum] = useState(1)

  return (
    <main>
      <section>
        <IssuesList
          labels={labels}
          status={status}
          pageNum={pageNum}
          setPageNum={setPageNum}
        />
      </section>
      <aside>
        <div>
          <LabelList
            selected={labels}
            toggle={(label: Labels) => {
              setLabels((currentLabels) =>
                currentLabels.includes(label.id)
                  ? currentLabels.filter(
                      (currentLabel) => currentLabel !== label.id
                    )
                  : currentLabels.concat(label.id)
              )
              setPageNum(1)
            }}
          />

          <hr />
        </div>

        <div className="status">
          {/* <h3>Status</h3> */}
          <StatusSelect
            value={status}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setStatus(event.target.value)
              setPageNum(1)
            }}
          />
          <hr />
        </div>
        {/* <Link className="button" to="/add">
            Add Issue
          </Link> */}
      </aside>
    </main>
  )
}
