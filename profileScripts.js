setupUI()
getUser()
getPosts()

function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid")
    return id
}

function getUser() {
    const id = getCurrentUserId()

    toggleLoader(true)

    axios.get(`${baseUrl}/users/${id}`)
        .then((response) => {
            const user = response.data.data
            document.getElementById("main-info-email").innerHTML = user.email
            document.getElementById("main-info-name").innerHTML = user.name
            document.getElementById("main-info-username").innerHTML = user.username
            document.getElementById("header-image").src = user.profile_image
            document.getElementById("name-posts").innerHTML = `${user.username}'s`
            // posts and comments counts
            document.getElementById("posts-count").innerHTML = user.posts_count
            document.getElementById("comments-count").innerHTML = user.comments_count
        }).finally(() => {
            toggleLoader(false)
        })
}

function getPosts() {
    const id = getCurrentUserId()

    toggleLoader(true)

    axios.get(`${baseUrl}/users/${id}/posts`)
        .then((response) => {
            const posts = response.data.data

            document.getElementById("user-posts").innerHTML = ""

            for (post of posts) {
                const author = post.author

                let postTitle = ""

                //show or hide edit button
                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let editBtnContent = ``

                if (isMyPost) {
                    editBtnContent = `
                    <button class="btn btn-danger" style="margin-left:5px; float: right;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                    <button class="btn btn-secondary" style="float: right;" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                    `
                }


                if (post.title != null) {
                    postTitle = post.title
                }

                let content = `
                <div class="card shadow my-5">
                    <div class="card-header">
                        <img src="${author.profile_image}" alt="" style="width: 40px; height: 40px;"
                            class="rounded-circle border border-2">
                        <b>${author.username}</b>

                        ${editBtnContent}
                    </div>
                    <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
                        <img class="w-100"
                            src="${post.image}" alt="">

                        <h6 style="color: grey;" class="mt-2">
                            ${post.created_at}
                        </h6>

                        <h5>
                            ${postTitle}
                        </h5>

                        <p>
                            ${post.body}
                        </p>

                        <hr>

                        <div>

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
                                <path
                                    d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" />
                            </svg>

                            <samp>
                                ${post.comments_count}

                                <span id="post-tags-${post.id}">
                                    
                                </span>
                            </samp>
                        </div>
                    </div>
                </div>
                `

                document.getElementById("user-posts").innerHTML += content

                const currentPostTagsId = `post-tags-${post.id}`
                document.getElementById(currentPostTagsId).innerHTML = ""

                for (tag of post.tags) {
                    console.log(tag.name)
                    let tagsContent = `
                    <button class="btn btn-sm rounded-5" style="background-color: gray; color: white">
                        ${tag.name}hahaha
                    </button>
                    `

                    document.getElementById(currentPostTagsId).innerHTML += tagsContent
                }
            }
        }).finally(() => {
            toggleLoader(false)
        })
}