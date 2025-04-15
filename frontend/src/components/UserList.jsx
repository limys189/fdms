import React, { useState, useEffect } from "react";
import { executeQuery } from "../services/apiService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) {
        params.username = searchTerm;
      }

      const result = await executeQuery("getUserList", params);
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error || "사용자 목록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div>
      <h2>사용자 목록</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="사용자명 검색..."
        />
        <button type="submit">검색</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>사용자명</th>
            <th>이메일</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">사용자가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
