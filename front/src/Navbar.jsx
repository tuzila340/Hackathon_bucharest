import React from "react";
import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import LogInDialog from "./LogInDialog";
import AddSeekerDialog from "./AddSeekerDialog";

function Navbar({ onNavigate }) {
  return (
    <div className="app-wrapper">
      <header className="main-header">
        <Menubar className="header-menubar">
          <MenubarMenu>
            <div className="header-content">
              <h1 className="navbar-h1">Aedes</h1>
            </div>

            <div className="btn-group">
              <button onClick={() => onNavigate('home')} className="btn" >Home</button>
              <AddSeekerDialog></AddSeekerDialog>
              <LogInDialog></LogInDialog>
            </div>
          </MenubarMenu>
        </Menubar>
      </header>
    </div>
  );
}

export default Navbar;
