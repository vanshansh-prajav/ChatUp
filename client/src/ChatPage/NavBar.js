import React from 'react'
import NavBarButton from '../Utilities/NavBarButton'

const NavBar = ({setName}) => {
  return (
    <>
      <NavBarButton type="button" click={() => setName("add")} data="➕" round={false}/>
      <NavBarButton type="button" click={() => setName("status")} data="⭕" round={false}/>
      <NavBarButton type="button" click={() => setName("settings")} data="⚙️" round={true}/>
    </>
  )
}

export default NavBar