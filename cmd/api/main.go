package main

import (
	"iserveuAssignment/internal/database"
	"iserveuAssignment/internal/server"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database connection
	if err := database.InitDB(); err != nil {
		log.Fatal(err)
	}

	// Create and initialize server
	srv := server.NewServer()
	srv.Initialize()
	srv.Run()
}
