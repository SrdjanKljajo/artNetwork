import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'

const Signin = () => {

    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const postData = () => {
        fetch('/signin', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                email
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                } else {
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Uspešno ste prijavljeni", classes: "#43a047 green darken-1" })
                    history.push('/')
                }
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>ArtNetwork</h2>
                <input
                    type="email"
                    placeholder="Unesite email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Unesite šifru"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light" onClick={postData}>
                    Prijavite se
                </button>
                <p>
                    <Link to="/signup">Ukoliko nemate nalog, registrujte se</Link>
                </p>
            </div>
        </div>
    )
}

export default Signin
