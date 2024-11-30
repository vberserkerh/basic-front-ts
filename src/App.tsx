import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaSun, FaMoon } from "react-icons/fa";

Modal.setAppElement("#root");

type User = {
  id: number | null;
  email: string;
  username: string;
  name: string;
  password: string;
  levelId: number;
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [formData, setFormData] = useState<Omit<User, "id">>({
    email: "",
    username: "",
    name: "",
    password: "",
    levelId: 1,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<User>("/api/users", formData);
      setUsers((prev) => [...prev, response.data]);
      setModalIsOpen(false);
      setFormData({
        email: "",
        username: "",
        name: "",
        password: "",
        levelId: 1,
      });
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-xl font-bold">User List</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded bg-gray-200 dark:bg-gray-800"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </header>

        <main className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Registered Users</h2>
            <button
              onClick={() => setModalIsOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow"
            >
              Add User
            </button>
          </div>

          {users.length > 0 ? (
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-4 border rounded shadow bg-white dark:bg-gray-800"
                >
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No users found.</p>
          )}
        </main>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleFormChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleFormChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleFormChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleFormChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
          <input
            type="number"
            name="levelId"
            placeholder="Level ID"
            value={formData.levelId}
            onChange={handleFormChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
            required
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setModalIsOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default App;