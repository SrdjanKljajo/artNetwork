import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { Link, useParams } from 'react-router-dom'

const UserProfile = () => {
    const [userProfile, setProfile] = useState(null)
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
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
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
                                    <h5>Postova: <span className="profile">{userProfile.posts.length}</span></h5>
                                    <h5>Pratioci: <span className="profile">{userProfile.user.followers.length}</span></h5>
                                    <h5>Praćenja: <span className="profile">{userProfile.user.following.length}</span></h5>
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
                                    <div className="card-image">
                                        <img src={item.photo} alt="korisnik" />
                                    </div>
                                    <div className="card-content">
                                        <p>{item.body}</p>
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

