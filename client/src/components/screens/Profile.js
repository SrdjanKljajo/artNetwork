import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

const Profile = () => {
    const [pics, setPics] = useState([])
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
                setPics(result.myposts)
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
                            //window.location.reload()
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

    return (
        <div style={{ maxWidth: "800px", margin: "0px auto" }}>
            <div style={{
                margin: "18px 0px",
                borderBottom: "1px solid gray"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                }}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                            src={state ? state.pic : "loading"} alt="person" />
                    </div>
                    <div>
                        <h4>{state ? state.name : "loading"}</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>Postova: {pics.length}</h6>
                            <h6>Pratioci:{state ? state.followers.length : "0"}</h6>
                            <h6>Praćenja: {state ? state.following.length : "0"}</h6>
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
            <div className="gallery">
                {
                    pics.map(item => {
                        return (

                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile
