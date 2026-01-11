// Protect admin page
protect();

// ===== IMAGE PREVIEW FOR UPLOAD =====
let imgData = "";

const imageInput = document.getElementById("image");
const previewImg = document.getElementById("preview");

if (imageInput) {
  imageInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      imgData = event.target.result;
      if (previewImg) previewImg.src = imgData;
    };
    reader.readAsDataURL(file);
  });
}

// ===== ADD NEW POST =====
function addPost() {
  const typeEl = document.getElementById("type");
  const titleEl = document.getElementById("title");
  const contentEl = document.getElementById("content");

  if (!typeEl || !titleEl || !contentEl) return;

  const type = typeEl.value;
  const title = titleEl.value.trim();
  const content = contentEl.value.trim();

  if (!title || !content) return alert("Title and content are required!");

  const posts = JSON.parse(localStorage.getItem(type)) || [];

  const newPost = {
    id: Date.now(),
    title,
    content,
    image: imgData || "",
    views: 0
  };

  posts.push(newPost);
  localStorage.setItem(type, JSON.stringify(posts));

  // Reset form
  titleEl.value = "";
  contentEl.value = "";
  imageInput.value = "";
  imgData = "";
  if (previewImg) previewImg.src = "";

  renderAdminPosts(); // Update admin panel immediately
  alert("Post added successfully!");
}

// ===== DELETE POST =====
function deletePost(type, id) {
  const posts = JSON.parse(localStorage.getItem(type)) || [];
  const filteredPosts = posts.filter(post => post.id !== id);
  localStorage.setItem(type, JSON.stringify(filteredPosts));

  renderAdminPosts(); // Update admin panel immediately
}

// ===== RENDER POSTS IN ADMIN PANEL =====
function renderAdminPosts() {
  const container = document.getElementById("adminPosts");
  if (!container) return;

  container.innerHTML = ""; // Clear previous content

  ["blog", "news"].forEach(type => {
    const posts = JSON.parse(localStorage.getItem(type)) || [];
    posts.forEach(post => {
      const postEl = document.createElement("div");
      postEl.className = "card";
      postEl.innerHTML = `
        <h4>${post.title} (${type})</h4>
        <p>Views: ${post.views || 0}</p>
        ${post.image ? `<img src="${post.image}" style="max-width:150px; border-radius:5px;">` : ""}
        <div style="margin-top:5px;">
          <button onclick="deletePost('${type}', ${post.id})">Delete</button>
        </div>
      `;
      container.appendChild(postEl);
    });
  });
}

// ===== INITIAL LOAD =====
document.addEventListener("DOMContentLoaded", renderAdminPosts);
