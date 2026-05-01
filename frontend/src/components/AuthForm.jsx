import React, { useState } from "react";
import api from "../api/axios";

const AdminSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/admin/signup", form);

      alert("Account created successfully ✅");
      console.log(res.data);

      // redirect (optional)
      window.location.href = "/admin/login";

    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.message || "Signup failed");
      } else {
        setError("Server not reachable");
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#4f6ef7",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default AdminSignup;