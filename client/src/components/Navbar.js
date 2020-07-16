import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

const Navbar = () => {
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const RenderList = () => {
        if (state) {
            return (
                <>
                    <li key="1"><Link to="/profile">Profil</Link></li>
                    <li key="2"><Link to="/createpost">Kreirajte post</Link></li>
                    <li key="3"><Link to="/myfollowingpost">Praćenja</Link></li>
                    <li key="4">
                        <button className="btn c62828 red darken-3" onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            history.push('/signin')
                        }}>
                            Odjavite se
                </button>
                    </li>
                </>
            )
        } else {
            return (
                <>
                    <li key="5"><Link to="/signup">Registracija</Link></li>
                    <li key="6"><Link to="/signin">Prijava</Link></li>
                </>
            )
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">ArtNetwork</Link>
                <ul id="nav-mobile" className="right">
                    <RenderList />
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
