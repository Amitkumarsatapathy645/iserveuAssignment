package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"

	"iserveuAssignment/internal/database"

	"github.com/xuri/excelize/v2"
)

type Student struct {
	ID          int     `json:"id"`
	StudentName string  `json:"student_name"`
	Address     string  `json:"address"`
	Mark        float64 `json:"mark"`
}

func (s *Server) handleFileUpload(w http.ResponseWriter, r *http.Request) {
	// Set maximum upload size to 10MB
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Check if file is an Excel file
	if filepath.Ext(handler.Filename) != ".xlsx" {
		http.Error(w, "Only Excel files (.xlsx) are allowed", http.StatusBadRequest)
		return
	}

	// Read the Excel file
	xlsx, err := excelize.OpenReader(file)
	if err != nil {
		http.Error(w, "Error reading Excel file", http.StatusBadRequest)
		return
	}

	// Get all rows from the first sheet
	rows, err := xlsx.GetRows(xlsx.GetSheetName(0))
	if err != nil {
		http.Error(w, "Error reading Excel rows", http.StatusInternalServerError)
		return
	}

	// Skip header row
	for i := 1; i < len(rows); i++ {
		row := rows[i]
		if len(row) < 4 {
			continue // Skip invalid rows
		}

		// Parse the mark as float64
		var mark float64
		fmt.Sscanf(row[3], "%f", &mark)

		// Insert into database
		_, err = database.DB.Exec(
			"INSERT INTO students (student_name, address, mark) VALUES ($1, $2, $3)",
			row[1], row[2], mark,
		)
		if err != nil {
			http.Error(w, "Error inserting data into database", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "File processed successfully",
	})
}

func (s *Server) getStudents(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, student_name, address, mark FROM students")
	if err != nil {
		http.Error(w, "Error retrieving students", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var students []Student
	for rows.Next() {
		var student Student
		err := rows.Scan(&student.ID, &student.StudentName, &student.Address, &student.Mark)
		if err != nil {
			http.Error(w, "Error scanning student data", http.StatusInternalServerError)
			return
		}
		students = append(students, student)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(students)
}
