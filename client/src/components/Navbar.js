import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const Navbar = () => {
    const [search, setSearch] = useState('')
    const searchModal = useRef(null)
    const sideNav = useRef(null)
    const [userDetails, setUserDetails] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {
        M.Modal.init(searchModal.current)
        M.Sidenav.init(sideNav.current)
    }, [])

    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-users', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query
            })
        }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user)
            })
    }

    const RenderList = () => {

        if (state) {
            return (
                <>
                    <li key="1"><i data-target="modal1" className="modal-trigger  material-icons" style={{ color: "black" }}>search</i></li>
                    <li key="2"><Link to="/">Početna</Link></li>
                    <li key="3"><Link to="/profile">Profil</Link></li>
                    <li key="4"><Link to="/createpost">Kreirajte post</Link></li>
                    <li key="5"><Link to="/myfollowingpost">Praćenja</Link></li>
                    <li key="6">
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
                    <li key="7"><Link to="/signup">Registracija</Link></li>
                    <li key="8"><Link to="/signin">Prijava</Link></li>
                </>
            )
        }
    }
    return (
        <>
            <nav>
                <div className="nav-wrapper white">
                    <Link to={state ? "/" : "/signin"} className="brand-logo ">ArtNetwork</Link>
                    <Link to="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></Link>
                    <ul className="right hide-on-med-and-down" >
                        <RenderList />
                    </ul>
                </div>
            </nav>
            <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="search users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {userDetails.map(item => {
                            return <Link key={item._id} to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li className="collection-item "><img src={item.pic} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px", marginBottom: "-8px" }} />{item.name}</li></Link>
                        })}

                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>close</button>
                </div>
            </div>
            <ul className="sidenav" id="mobile-demo" ref={sideNav}>
                <RenderList />
            </ul>
        </>
    )
}

export default Navbar
