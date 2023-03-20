package main

import (
	"database/sql"
	"encoding/json"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Post struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	Body  string `json:"body"`
}

type Issues struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Number      int    `json:"number"`
	Status      string `json:"status"`
	Assignee    string `json:"assignee"`
	Comments    []Post `json:"comments"`
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

type Label struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

var posts []Post
var users []User

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func getIssues(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sql = "SELECT d.id, d.title, d.`number`, d.`status`, u1.user_name AS assignee, u2.user_name AS created_by, d.created_date FROM issues d LEFT JOIN users u1 ON d.assignee_id = u1.id LEFT JOIN users u2 ON d.created_by_id = u2.id"
	enableCors(&w)
	var issues []Issues
	result, err := db.Query(sql)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var issue Issues
		err := result.Scan(&issue.ID, &issue.Title, &issue.Number, &issue.Status, &issue.Assignee, &issue.CreatedBy, &issue.CreatedDate)
		if err != nil {
			panic(err.Error())
		}
		issues = append(issues, issue)
	}
	json.NewEncoder(w).Encode(issues)
}

func getIssue(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var sql = "SELECT d.id, d.title, d.`number`, d.`status`, u1.user_name AS assignee, u2.user_name AS created_by, d.created_date FROM issues d LEFT JOIN users u1 ON d.assignee_id = u1.id LEFT JOIN users u2 ON d.created_by_id = u2.id WHERE d.id=?"
	enableCors(&w)
	params := mux.Vars(r)
	result, err := db.Query(sql, params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var issue Issues
	for result.Next() {
		err := result.Scan(&issue.ID, &issue.Title, &issue.Number, &issue.Status, &issue.Assignee, &issue.CreatedBy, &issue.CreatedDate)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(issue)
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

var db *sql.DB
var err error

func main() {
	db, err = sql.Open("mysql", "root:S@garM@t81@tcp(127.0.0.1:3306)/issue_tracker")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	router := mux.NewRouter()
	posts = append(posts, Post{ID: "1", Title: "My post", Body: "Content of post"})

	router.HandleFunc("/api/issues", getIssues).Methods("GET")
	router.HandleFunc("/api/issues/{id}", getIssue).Methods("GET")

	router.HandleFunc("/api/labels", getLabels).Methods("GET")

	router.HandleFunc("/users/{id}", getUser).Methods("GET")
	http.ListenAndServe(":8000", router)
}
