package main

import (
	"iserveuAssignment/internal/database"
	"iserveuAssignment/internal/scheduler" // New import
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

	// Initialize and start the email scheduler
	emailScheduler := scheduler.NewScheduler()
	if err := emailScheduler.Start(); err != nil {
		log.Printf("Warning: Failed to start scheduler: %v", err)
	} else {
		log.Println("Email scheduler started successfully")
	}

	// Create and initialize server
	srv := server.NewServer()
	srv.Initialize()
	srv.Run()
}
