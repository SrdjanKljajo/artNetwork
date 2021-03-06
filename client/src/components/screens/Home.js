import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import Moment from 'react-moment';

const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/allposts', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                setData(result.posts)
            })
    }, [])

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
        <div>
            {
                data.map(item => {
                    return (
                        <div className="card card-home" key={item._id}>
                            <h5 style={{ padding: "5px" }}><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}><img style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px", marginBottom: "-8px" }}
                                src={item.postedBy.pic} alt="" />{item.postedBy.name}</Link> {item.postedBy._id === state._id
                                    && <i className="material-icons" style={{
                                        float: "right"
                                    }}
                                        onClick={() => deletePost(item._id)}
                                    >delete</i>
                                }</h5>
                            <div className="card-image">
                                <img src={item.photo} alt="wallpaper" />
                            </div>
                            <div className="date-span">Kreirano: <Moment format="YYYY/MM/DD HH:mm">
                                {item.date}
                            </Moment></div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons"
                                        onClick={() => { unlikePost(item._id) }}
                                    >thumb_down</i>
                                    :
                                    <i className="material-icons"
                                        onClick={() => { likePost(item._id) }}
                                    >thumb_up</i>
                                }

                                <h6>Sviđanja: <span className="svidjanja">{item.likes.length}</span></h6>

                                <p className="body-post">{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"} style={{ fontWeight: "bold", fontSize: "1.2rem" }}><img style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px", marginBottom: "-8px" }}
                                                src={record.postedBy.pic} alt="" />{record.postedBy.name}: </Link><p className="span-com">{record.text}</p><hr /></h6>
                                        )
                                    })
                                }
                                <form onSubmit={e => {
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

export default Home
