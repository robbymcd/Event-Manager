// app/users/page.tsx
import pool from "@/lib/db";

export default async function UsersPage() {
  const { rows: users } = await pool.query("SELECT * FROM users");

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        <>here</>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
