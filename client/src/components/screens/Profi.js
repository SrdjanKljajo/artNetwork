import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import Moment from 'react-moment';

const Profi = () => {
    const [data, setData] = useState([])
    const [image, setImage] = useState('')
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        fetch('/myposts', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                setData(result.myposts)
            })
    }, [])

    useEffect(() => {
        if (image) {
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
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                            window.location.reload()
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    return (
        <div className="home">
            <div style={{
                margin: "18px 0px",
                borderBottom: "1px solid gray",
                paddingBottom: "20px"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                }}>
                    <div>
                        <img style={{ width: "250px", borderRadius: "25px" }}
                            src={state ? state.pic : "loading"} className="profil-img" alt="person" />
                    </div>
                    <div>
                        <h4 className="profil-name">{state ? state.name : "loading"}</h4>
                        <div>
                            <h5>Postova: <span className="profile">{data.length}</span></h5>
                            <h5>Pratioci: <span className="profile">{state ? state.followers.length : "0"}</span></h5>
                            <h5>Praćenja: <span className="profile">{state ? state.following.length : "0"}</span></h5>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field" style={{ margin: "10px" }}>
                    <div className="btn">
                        <span>Promeni fotografiju</span>
                        <input
                            type="file"
                            onChange={e => updatePhoto(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            {
                data.map(item => {
                    return (
                        <div className="card card-home" key={item._id}>
                            <h5 style={{ padding: "5px" }}><img style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px", marginBottom: "-8px" }}
                                src={item.postedBy.pic} alt="" />{item.postedBy.name}{item.postedBy._id === state._id
                                    && <i className="material-icons" style={{
                                        float: "right"
                                    }}
                                        onClick={() => deletePost(item._id)}
                                    >delete</i>
                                }</h5>
                            <div className="card-image">
                                <img src={item.photo} alt="korisnik" />
                                <div className="date-span">Kreirano: <Moment format="YYYY/MM/DD HH:mm">
                                    {item.date}
                                </Moment></div>
                            </div>
                            <div className="card-content">

                                <h6>Sviđanja: <span className="svidjanja">{item.likes.length}</span></h6>

                                <p className="body-post">{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"} style={{ fontWeight: "bold", fontSize: "1.2rem" }}><img style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px", marginBottom: "-8px" }}
                                                src={record.postedBy.pic} alt="" />{record.postedBy.name}: </Link><p className="span-com">{record.text}</p>{/*item.postedBy._id === state._id
                                                    &&
                                                    <span className="com" style={{
                                                        float: "right", color: "red"
                                                    }}
                                                    //onClick={() => deleteComment(record._id)}
                                                    >Obriši</span>*/
                                                }<hr /></h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                    e.target[0].value = ""
                                }}>
                                    <input type="text" placeholder="dodajte komentar" />
                                </form>

                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Profi