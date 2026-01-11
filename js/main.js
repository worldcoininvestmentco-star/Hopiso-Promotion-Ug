// ======= MOBILE MENU TOGGLE =======
function toggleMenu() {
  const nav = document.getElementById("nav");
  if (nav) nav.classList.toggle("show");
}

// ======= GET POSTS =======
function getPosts(type) {
  return JSON.parse(localStorage.getItem(type)) || [];
}

function savePosts(type, posts) {
  localStorage.setItem(type, JSON.stringify(posts));
}

// ======= RENDER POSTS =======
function renderPosts(containerId, posts) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = posts.length
    ? posts.map(post => `
        <div class="card">
          ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ""}
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <div class="post-actions">
            <button onclick="likePost('${post.id}','${containerId}')">👍 <span>${post.likes || 0}</span></button>
            <button onclick="dislikePost('${post.id}','${containerId}')">👎 <span>${post.dislikes || 0}</span></button>
          </div>
          <div class="comments-section">
            <h4>Comments</h4>
            <div id="comments-${post.id}">
              ${(post.comments || []).map(c => `<p>💬 ${c}</p>`).join("")}
            </div>
            <input type="text" id="comment-input-${post.id}" placeholder="Add a comment">
            <button onclick="addComment('${post.id}','${containerId}')">Comment</button>
          </div>
        </div>
      `).join("")
    : `<p>No posts available.</p>`;
}

// ======= LIKES / DISLIKES =======
function likePost(id, containerId) {
  ["blog","news"].forEach(type=>{
    const posts = getPosts(type);
    const post = posts.find(p => p.id == id);
    if(post){
      post.likes = (post.likes || 0) + 1;
      savePosts(type, posts);
    }
  });
  renderAll();
}

function dislikePost(id, containerId) {
  ["blog","news"].forEach(type=>{
    const posts = getPosts(type);
    const post = posts.find(p => p.id == id);
    if(post){
      post.dislikes = (post.dislikes || 0) + 1;
      savePosts(type, posts);
    }
  });
  renderAll();
}

// ======= COMMENTS =======
function addComment(id, containerId) {
  const input = document.getElementById(`comment-input-${id}`);
  if(!input || !input.value.trim()) return;
  ["blog","news"].forEach(type=>{
    const posts = getPosts(type);
    const post = posts.find(p => p.id == id);
    if(post){
      post.comments = post.comments || [];
      post.comments.push(input.value.trim());
      savePosts(type, posts);
    }
  });
  input.value = "";
  renderAll();
}

// ======= RENDER LATEST POSTS FOR HOME =======
function renderLatestPosts(containerId) {
  const allPosts = [...getPosts("blog"), ...getPosts("news")]
    .sort((a,b)=> b.id - a.id)
    .slice(0,3);
  renderPosts(containerId, allPosts);
}

// ======= RENDER ALL POSTS =======
function renderAll(){
  renderPosts("posts", getPosts("blog"));
  renderPosts("posts", getPosts("news"));
  renderLatestPosts("latestPosts");
  renderSlideshow();
}

// ======= SLIDESHOW FOR HOME =======
function renderSlideshow(){
  const slideshowContainer = document.getElementById("slideshow");
  if(!slideshowContainer) return;

  const allPosts = [...getPosts("blog"), ...getPosts("news")].sort((a,b)=>b.id-b.id);
  if(allPosts.length===0){
    slideshowContainer.innerHTML="<p>No new posts</p>";
    return;
  }

  slideshowContainer.innerHTML = allPosts.map((post,i)=>`
    <div class="slide" style="display:${i===0?'block':'none'}">
      ${post.image?`<img src="${post.image}" alt="${post.title}">`:""}
      <h3>${post.title}</h3>
      <p>${post.content}</p>
    </div>
  `).join("");

  let currentSlide = 0;
  const slides = slideshowContainer.querySelectorAll(".slide");
  setInterval(()=>{
    slides[currentSlide].style.display="none";
    currentSlide = (currentSlide+1)%slides.length;
    slides[currentSlide].style.display="block";
  },5000); // 5s per slide
}

// ======= INCREMENT VIEWS =======
function incrementPostViews(type){
  const posts = getPosts(type);
  posts.forEach(post => post.views = post.views || 0);
  savePosts(type, posts);
}

// ======= INITIAL LOAD =======
document.addEventListener("DOMContentLoaded", ()=>{
  incrementPostViews("blog");
  incrementPostViews("news");
  renderAll();
});

// ======= LISTEN FOR ADMIN CHANGES =======
window.addEventListener("storage", renderAll);
