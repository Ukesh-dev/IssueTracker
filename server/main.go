package main

import (
	"database/sql"
	"encoding/json"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Issues struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Number      int    `json:"number"`
	Status      string `json:"status"`
	Assignee    string `json:"assignee"`
	LabelID     int    `json:"label_id"`
	Comments    int    `json:"comments"`
	CreatedBy   string `json:"createdBy"`
	CreatedDate string `json:"createdDate"`
}

type Label struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

type Comments struct {
	ID          string `json:"id"`
	IssueId     string `json:"issue_id"`
	Comment     string `json:"comment"`
	CreatedById string `json:"createdById"`
	CreatedBy   string `json:"createdBy"`
	CreatedDate string `json:"createdDate"`
}

type User struct {
	ID                string `json:"id"`
	Name              string `json:"name"`
	Email             string `json:"email"`
	ContactNo         string `json:"contactNo"`
	ProfilePictureURL string `json:"profilePictureUrl"`
}

type PossibleStatus struct {
	ID    string `json:"id"`
	Label string `json:"label"`
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func getIssues(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sql = "SELECT d.id, d.title, d.`number`, d.`status`, u1.user_name AS assignee, d.label_id, " +
		"(SELECT COUNT(*) FROM issues_comments s WHERE s.issue_id = d.id ) AS a, u2.user_name AS created_by, " +
		"d.created_date FROM issues d LEFT JOIN users u1 ON d.assignee_id = u1.id " +
		"LEFT JOIN users u2 ON d.created_by_id = u2.id"

	enableCors(&w)
	var issues []Issues
	result, err := db.Query(sql)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var i Issues
		err := result.Scan(&i.ID, &i.Title, &i.Number, &i.Status, &i.Assignee, &i.LabelID, &i.Comments, &i.CreatedBy,
			&i.CreatedDate)
		if err != nil {
			panic(err.Error())
		}
		issues = append(issues, i)
	}
	json.NewEncoder(w).Encode(issues)
}

func getIssue(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sql = "SELECT d.id, d.title, d.`number`, d.`status`, u1.user_name AS assignee, d.label_id, " +
		"(SELECT COUNT(*) FROM issues_comments s WHERE s.issue_id = d.id ) AS a, u2.user_name AS created_by, " +
		"d.created_date FROM issues d LEFT JOIN users u1 ON d.assignee_id = u1.id " +
		"LEFT JOIN users u2 ON d.created_by_id = u2.id " +
		"WHERE d.id=?"
	enableCors(&w)
	params := mux.Vars(r)
	result, err := db.Query(sql, params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var i Issues
	for result.Next() {
		err := result.Scan(&i.ID, &i.Title, &i.Number, &i.Status, &i.Assignee, &i.LabelID, &i.Comments, &i.CreatedBy,
			&i.CreatedDate)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(i)
}

func getUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sql = "SELECT * FROM users WHERE id=?"
	enableCors(&w)
	params := mux.Vars(r)
	result, err := db.Query(sql, params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var u User
	for result.Next() {
		err := result.Scan(&u.ID, &u.Name, &u.Email, &u.ContactNo, &u.ProfilePictureURL)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(u)
}

func getLabels(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sql = "SELECT id, `name`, `color` FROM label"
	enableCors(&w)
	var labels []Label
	result, err := db.Query(sql)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var l Label
		err := result.Scan(&l.ID, &l.Name, &l.Color)
		if err != nil {
			panic(err.Error())
		}
		labels = append(labels, l)
	}
	json.NewEncoder(w).Encode(labels)
}

func getLabelById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sql = "SELECT id, `name`, `color` FROM label WHERE id=?"
	enableCors(&w)
	params := mux.Vars(r)
	result, err := db.Query(sql, params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var l Label
	for result.Next() {
		err := result.Scan(&l.ID, &l.Name, &l.Color)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(l)
}

func getCommentsByIssuesId(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sql = "SELECT i.id, i.issue_id, i.`comment`, i.created_by_user_id, u.user_name AS created_by, i.created_date " +
		"FROM issues_comments i LEFT JOIN users u ON i.created_by_user_id = u.id WHERE issue_id=?"
	enableCors(&w)
	var com []Comments
	params := mux.Vars(r)
	result, err := db.Query(sql, params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var l Comments
	for result.Next() {
		err := result.Scan(&l.ID, &l.IssueId, &l.Comment, &l.CreatedById, &l.CreatedBy, &l.CreatedDate)
		if err != nil {
			panic(err.Error())
		}
		com = append(com, l)
	}
	json.NewEncoder(w).Encode(com)
}

func getPossibleStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sql = "SELECT * FROM possible_status"
	enableCors(&w)
	var PS []PossibleStatus
	result, err := db.Query(sql)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var l PossibleStatus
		err := result.Scan(&l.ID, &l.Label)
		if err != nil {
			panic(err.Error())
		}
		PS = append(PS, l)
	}
	json.NewEncoder(w).Encode(PS)
}

var db *sql.DB
var err error

func main() {
	db, err = sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/issue_tracker")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	router := mux.NewRouter()
	router.HandleFunc("/api/issues", getIssues).Methods("GET")
	router.HandleFunc("/api/issues/{id}", getIssue).Methods("GET")

	router.HandleFunc("/api/labels", getLabels).Methods("GET")
	router.HandleFunc("/api/labels/{id}", getLabelById).Methods("GET")

	router.HandleFunc("/api/possibleStatus", getPossibleStatus).Methods("GET")

	router.HandleFunc("/api/users/{id}", getUser).Methods("GET")

	router.HandleFunc("/api/issues/{id}/comments", getCommentsByIssuesId).Methods("GET")
	http.ListenAndServe(":8000", router)
}
