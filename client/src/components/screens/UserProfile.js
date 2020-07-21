import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { Link, useParams } from 'react-router-dom'

const UserProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result)
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

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {

                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
            })
    }
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item != data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)

            })
    }

    return (
        <>
            {userProfile ?
                <div className="home">
                    <div style={{
                        margin: "18px 0px",
                        borderBottom: "1px solid gray"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",
                        }}>
                            <div>
                                <img style={{ width: "200px", borderRadius: "25px" }}
                                    src={userProfile.user.pic} className="profil-img" alt="person" />
                            </div>
                            <div>
                                <h4 className="profil-name">{userProfile ? userProfile.user.name : "loading"}</h4>
                                <div>
                                    <h6>Postova: {userProfile.posts.length}</h6>
                                    <h6>Pratioci: {userProfile.user.followers.length}</h6>
                                    <h6>Praćenja: {userProfile.user.following.length}</h6>
                                </div>
                            </div>

                        </div>
                        {showfollow ?
                            <button style={{
                                margin: "10px"
                            }} className="btn waves-effect waves-green"
                                onClick={() => followUser()}
                            >
                                Prati
                    </button>
                            :
                            <button
                                style={{
                                    margin: "10px"
                                }}
                                className="btn waves-effect waves-light btn c62828 red darken-3"
                                onClick={() => unfollowUser()}
                            >
                                Ne prati više
                    </button>
                        }
                    </div>
                    {
                        userProfile.posts.map(item => {
                            return (
                                <div className="card card-home" key={item._id}>
                                    <h5 style={{ padding: "5px" }}><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}><img style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px", marginBottom: "-8px" }}
                                        src={item.postedBy.pic} alt="" />{item.postedBy.name}</Link> {item.postedBy._id === state._id}</h5>
                                    <div className="card-image">
                                        <img src={item.photo} alt="image" />
                                    </div>
                                    <div className="card-content">
                                        <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                        {item.likes.includes(state._id)
                                            ?
                                            <i className="material-icons"
                                                onClick={() => {
                                                    unlikePost(item._id)
                                                    return window.location.reload()
                                                }}
                                            >thumb_down</i>
                                            :
                                            <i className="material-icons"
                                                onClick={() => {
                                                    likePost(item._id)
                                                    return window.location.reload()
                                                }}
                                            >thumb_up</i>
                                        }
                                        <h6>Sviđanja: {item.likes.length}</h6>
                                        <h6>{item.title}</h6>
                                        <p>{item.body}</p>
                                        {
                                            item.comments.map(record => {
                                                return (
                                                    <h6 key={record._id}><Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"} style={{ fontWeight: "bold", fontSize: "1.2rem" }}><img style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "8px", marginBottom: "-8px" }}
                                                        src={record.postedBy.pic} alt="" />{record.postedBy.name}: </Link><p className="span-com">{record.text}</p><hr /></h6>
                                                )
                                            })
                                        }
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            makeComment(e.target[0].value, item._id)
                                            e.target[0].value = ""
                                        }}>
                                            <input type="text" placeholder="add a comment" />
                                        </form>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                : <h2>loading...</h2>}
        </>
    )
}

export default UserProfile

