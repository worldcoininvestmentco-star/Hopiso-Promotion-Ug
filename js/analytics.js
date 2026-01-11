let views = JSON.parse(localStorage.getItem("views")) || 0;
views++;
localStorage.setItem("views", views);
