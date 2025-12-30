import { useEffect, useState, useCallback } from "react";
import axios from "axios";

function ApprovalRequests() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("access_token");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const fetchPendingUsers = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/users/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", res.data); // Debug

      // Backend returns { status: "success", data: [...] }
      if (res.data.data && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        console.error("Unexpected response format:", res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      setUsers([]); // Reset to empty array on error
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      } else if (err.response?.status === 403) {
        alert("Access Denied: You do not have permission to view this page.");
      } else {
        const errorMsg = err.response?.data?.detail || "Failed to load pending approvals";
        alert(`Error: ${errorMsg}`);
      }
    }
  }, [token]);


  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);


  const approveUser = async (id) => {
    try {
      await axios.post(
        `${API_URL}/admin/users/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPendingUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to approve user");
    }
  };

  const rejectUser = async (id) => {
    try {
      await axios.post(
        `${API_URL}/admin/users/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPendingUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to reject user");
    }
  };

  return (
    <div>
      <h2>Pending Employee Approvals</h2>

      {users.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => approveUser(u.id)}
                      style={{
                        padding: "6px 14px",
                        background: "#16a34a",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectUser(u.id)}
                      style={{
                        padding: "6px 14px",
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ApprovalRequests;
