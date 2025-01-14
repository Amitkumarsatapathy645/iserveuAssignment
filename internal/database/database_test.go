package database

import (
	"testing"
)

func TestConnectDB(t *testing.T) {
	ConnectDB()
	if DB == nil {
		t.Error("Failed to connect to the database")
	}
}
