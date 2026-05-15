import { useState } from 'react'
import './App.css'
import Navbar from './Navbar'
import SeekerList from './SeekerList'

function App() {
  const [activePage, setActivePage] = useState('home')

  const handlePageChange = () => {
    switch (activePage) {
      case 'home':
        return <SeekerList />
    }
  }

  return (
    <>
      <Navbar onNavigate={setActivePage} activePage={activePage} />

      <main className="main-content">
      {handlePageChange()}
      </main>
    </>
  )
}

export default App

//home page
