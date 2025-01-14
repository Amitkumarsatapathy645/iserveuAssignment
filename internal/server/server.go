package server

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

type Server struct {
	router *mux.Router
}

func NewServer() *Server {
	return &Server{
		router: mux.NewRouter(),
	}
}

func (s *Server) Initialize() {
	s.setupRoutes()
}

func (s *Server) setupRoutes() {
	s.router.HandleFunc("/api/upload", s.handleFileUpload).Methods("POST")
	s.router.HandleFunc("/api/students", s.getStudents).Methods("GET")
}

func (s *Server) Run() {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, s.router))
}
