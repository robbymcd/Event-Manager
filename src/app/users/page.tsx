"use client";

import { useState, useEffect } from "react";

// Test page for users API
export default function TestPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    username: "temp",
    password: "temp",
    role: "admin",
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users"); // Fetch the users from your API
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json(); // Parse the response JSON
      setUsers(data); // Update the users state with the fetched data
    } catch (err) {
      console.log(err);
      setError("Failed to fetch users"); // Set error message if fetching fails
    }
  };

  // Add a new user via the API
  const addUser = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "POST", // Using POST method to add a new user
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser), // Send the new user data in the request body
      });

      if (!res.ok) {
        throw new Error("Failed to add user");
      }

      const data = await res.json(); // Get the newly created user from the response
      setUsers((prevUsers) => [...prevUsers, data]); // Add the new user to the list
      setNewUser({ username: "", password: "", role: "" }); // Reset the form fields
    } catch (err) {
      setError(err.message); // Set error message if adding the user fails
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users API Test</h1>

      {/* Display any errors */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Fetch and display users */}
      <button onClick={fetchUsers}>Fetch Users</button>

      <div>
        <h2>Users List</h2>
        <ul>
          {users.length === 0 ? (
            <li>No users found</li>
          ) : (
            users.map((user) => (
              <li key={user.id}>
                {user.username} - {user.role}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Add a new user form */}
      <h2>Add New User</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser(); // Add the new user when the form is submitted
        }}
      >
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Role: </label>
          <input
            type="text"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
          />
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}
