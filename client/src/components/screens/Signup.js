import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {

    const history = useHistory()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = () => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'instagram-udemy')
        data.append('cloud_name', 'dt3ckniuc')
        fetch('https://api.cloudinary.com/v1_1/dt3ckniuc/image/upload',
            {
                method: 'post',
                body: data
            })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const uploadFields = () => {
        fetch('/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                } else {
                    M.toast({ html: data.message, classes: "#43a047 green darken-1" })
                    history.push('/signin')
                }
            }).catch(err => {
                console.log(err)
            })
    }

    const postData = () => {
        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }

    }

    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>ArtNetwork</h2>
                <input
                    type="text"
                    placeholder="Unesite ime"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
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
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Dodaj fotografiju</span>
                        <input
                            type="file"
                            onChange={e => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light" onClick={postData}>
                    Registrujte se
                </button>
                <p>
                    <Link to="/signin">Ukoliko ste već registrovani, prijavite se</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
