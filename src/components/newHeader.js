import { useState, useEffect } from "react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    // Clear the token from local storage
    // and redirect to the login page
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <header>
      <nav>
        <ul>
          {isAuthenticated ? (
            <>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/login" onClick={logout}>
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signup">Sign Up</a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
