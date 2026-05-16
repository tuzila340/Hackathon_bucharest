import React, { useState, useEffect } from "react";
import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import LogInDialog from "./LogInDialog";
import RegistrationDialog from "./RegistrationDialog";
import AddSeekerDialog from "./AddSeekerDialog";
import axios from "axios";

function Navbar({ onNavigate }) {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/login/", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <Menubar className="header-menubar">
          <MenubarMenu>
            <div className="header-content">
              <h1 className="navbar-h1">Aedes</h1>
            </div>
            <div className="btn-group">
              <button onClick={() => onNavigate('home')} className="btn">Home</button>

              {user ? (
                <>
                  <span className="btn"> {user.username}</span>
                  <AddSeekerDialog />
                  <button
                    className="btn"
                    onClick={async () => {
                      await axios.post("http://localhost:5158/logout", {}, { withCredentials: true });
                      setUser(null);
                    }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <LogInDialog onLogin={fetchUser} />
                  <RegistrationDialog onRegister={fetchUser} />
                </>
              )}

            </div>
          </MenubarMenu>
        </Menubar>
      </header>
    </div>
  );
}

export default Navbar;