document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const postsList = document.getElementById('postsList')
  const singlePost = document.getElementById('singlePost')
  const postForm = document.getElementById('postForm')
  const blogForm = document.getElementById('blogForm')
  const formTitle = document.getElementById('formTitle')
  const newPostBtn = document.getElementById('newPostBtn')
  const cancelBtn = document.getElementById('cancelBtn')
  const notification = document.getElementById('notification')

  // API Base URL
  const API_URL = 'http://localhost/omx-digital-assignment/api'

  // State
  let currentPostId = null

  // Event Listeners
  newPostBtn.addEventListener('click', showCreateForm)
  cancelBtn.addEventListener('click', cancelForm)
  blogForm.addEventListener('submit', handleFormSubmit)

  // Initial load
  loadPosts()

  // Functions
  async function loadPosts() {
    try {
      const response = await fetch(`${API_URL}/posts.php`)

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()

      if (data.error) {
        showNotification(data.error, 'error')
        return
      }

      renderPosts(data)
    } catch (error) {
      showNotification(error.message, 'error')
    }
  }

  function renderPosts(posts) {
    if (posts.length === 0) {
      postsList.innerHTML =
        '<div class="no-posts">No posts found. Create your first post!</div>'
      return
    }

    postsList.innerHTML = posts
      .map(
        (post) => `
      <div class="post-card" data-id="${post.id}">
        <h2>${escapeHtml(post.title)}</h2>
        <div class="date">${formatDate(post.created_at)}</div>
        <div class="preview">${escapeHtml(post.content.substring(0, 150))}${
          post.content.length > 150 ? '...' : ''
        }</div>
      </div>
    `
      )
      .join('')

    // Add click event to each post card
    document.querySelectorAll('.post-card').forEach((card) => {
      card.addEventListener('click', () => {
        const postId = card.getAttribute('data-id')
        loadSinglePost(postId)
      })
    })
  }

  async function loadSinglePost(id) {
    try {
      const response = await fetch(`${API_URL}/posts.php?id=${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }

      const post = await response.json()

      if (post.error) {
        showNotification(post.error, 'error')
        return
      }

      renderSinglePost(post)
    } catch (error) {
      showNotification(error.message, 'error')
    }
  }

  function renderSinglePost(post) {
    postsList.classList.add('hidden')
    singlePost.classList.remove('hidden')

    singlePost.innerHTML = `
      <a class="back-link" id="backToList">← Back to all posts</a>
      <h1>${escapeHtml(post.title)}</h1>
      <div class="date">${formatDate(post.created_at)}</div>
      <div class="content">${escapeHtml(post.content).replace(
        /\n/g,
        '<br>'
      )}</div>
      <div class="post-actions">
        <button class="btn primary" id="editPostBtn">Edit</button>
        <button class="btn danger" id="deletePostBtn">Delete</button>
      </div>
    `

    // Add event listeners
    document.getElementById('backToList').addEventListener('click', () => {
      singlePost.classList.add('hidden')
      postsList.classList.remove('hidden')
    })

    document.getElementById('editPostBtn').addEventListener('click', () => {
      showEditForm(post)
    })

    document.getElementById('deletePostBtn').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this post?')) {
        deletePost(post.id)
      }
    })
  }

  function showCreateForm() {
    formTitle.textContent = 'Create New Post'
    document.getElementById('postId').value = ''
    blogForm.reset()

    postsList.classList.add('hidden')
    singlePost.classList.add('hidden')
    postForm.classList.remove('hidden')

    currentPostId = null
  }

  function showEditForm(post) {
    formTitle.textContent = 'Edit Post'
    document.getElementById('postId').value = post.id
    document.getElementById('title').value = post.title
    document.getElementById('content').value = post.content

    singlePost.classList.add('hidden')
    postForm.classList.remove('hidden')

    currentPostId = post.id
  }

  function cancelForm() {
    if (currentPostId) {
      // If editing, go back to single post view
      loadSinglePost(currentPostId)
    } else {
      // If creating, go back to posts list
      postForm.classList.add('hidden')
      postsList.classList.remove('hidden')
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault()

    const title = document.getElementById('title').value.trim()
    const content = document.getElementById('content').value.trim()

    if (!title || !content) {
      showNotification('Title and content are required', 'error')
      return
    }

    const postData = { title, content }

    try {
      let response

      if (currentPostId) {
        // Update existing post
        response = await fetch(`${API_URL}/posts.php?id=${currentPostId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
      } else {
        // Create new post
        response = await fetch(`${API_URL}/posts.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
      }

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      const result = await response.json()
      console.log(result)
      if (result.error) {
        showNotification(result.error, 'error')
        return
      }

      showNotification(
        currentPostId
          ? 'Post updated successfully'
          : 'Post created successfully',
        'success'
      )

      // Reset form and go back to posts list
      blogForm.reset()
      postForm.classList.add('hidden')

      if (currentPostId) {
        loadSinglePost(currentPostId)
      } else {
        postsList.classList.remove('hidden')
        loadPosts()
      }
    } catch (error) {
      showNotification(error.message, 'error')
    }
  }

  async function deletePost(id) {
    try {
      const response = await fetch(`${API_URL}/posts.php?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      const result = await response.json()

      if (result.error) {
        showNotification(result.error, 'error')
        return
      }

      showNotification('Post deleted successfully', 'success')

      // Go back to posts list
      singlePost.classList.add('hidden')
      postsList.classList.remove('hidden')
      loadPosts()
    } catch (error) {
      showNotification(error.message, 'error')
    }
  }

  function showNotification(message, type = 'info') {
    notification.textContent = message
    notification.className = `notification ${type} show`

    setTimeout(() => {
      notification.classList.remove('show')
    }, 3000)
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
})
