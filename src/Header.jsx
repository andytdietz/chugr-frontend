import { Modal } from "./Modal";
import { Signup } from "./Signup";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const [isSignupVisible, setIsSignupVisible] = useState(false);

  const handleClose = () => {
    setIsSignupVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  return (
    <div>
      <Modal show={isSignupVisible} onClose={handleClose}>
        <Signup />
      </Modal>
      <header style={{ paddingTop: "75px", paddingBottom: "15px" }}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              ChugR
            </Link>
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/" onClick={() => setIsSignupVisible(false)}>
                  Home
                </Link>
              </li>
              {localStorage.jwt === undefined ? (
                <>
                  <li className="nav-item">
                    <Link to="signup" className="nav-link" onClick={() => setIsSignupVisible(false)}>
                      Signup
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="login" className="nav-link" onClick={() => setIsSignupVisible(false)}>
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/" onClick={() => setIsSignupVisible(false)}>
                      All Breweries
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/favorites" onClick={() => setIsSignupVisible(false)}>
                      My Favorites
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/logout" className="nav-link" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </div>
  );
}
