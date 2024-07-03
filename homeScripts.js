let currenrPage = 1
let lastPage = 1

// infinite scroll
window.addEventListener("scroll", function () {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;

    if (endOfPage && currenrPage <= lastPage) {
        currenrPage = currenrPage + 1
        getPosts(false, currenrPage)
    }
});
// infinite scroll

setupUI()



getPosts()

function userClicked(userId) {
    window.location = `profile.html?userid=${userId}`
}

function getPosts(reload = true, page = 1) {

    toggleLoader(true)

    axios.get(`${baseUrl}/posts?limit=5&page=${page}`)
        .then((response) => {
            const posts = response.data.data

            lastPage = response.data.meta.last_page

            if (reload) {
                document.getElementById("posts").innerHTML = ""
            }

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
                        <span onclick="userClicked(${author.id})" style="cursor: pointer;">
                            <img src="${author.profile_image}" alt="No image" style="width: 40px; height: 40px;"
                            class="rounded-circle border border-2">
                            <b>${author.username}</b>
                        </span>

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

                document.getElementById("posts").innerHTML += content

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

function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`
}

function addBtnClicked() {
    document.getElementById("post-modal-submit-btn").innerHTML = "Create"
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Create A New Post"
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""

    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}