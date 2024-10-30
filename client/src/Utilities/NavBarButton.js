import React from 'react'

const NavBarButton = ({ type, data, click, round }) => {
    let style = `text-md ${round ? `rounded-bl-2xl` : ``} bg-slate-600 hover:bg-slate-700 p-2 w-full `;
    return (
        <div>
            <button className={style} type={type} onClick={click}>{data}</button>
        </div>
    )
}

export default NavBarButton