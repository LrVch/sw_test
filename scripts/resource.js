(function () {
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  const todosElem = document.getElementById('todos')
  const postsElem = document.getElementById('posts')
  const userInfoElem = document.getElementById('user-info')

  if (userInfoElem) {
    fetch('/data/user.json')
      .then(response => response.json())
      .then(user => {
        const {name, lastName, age} = user;
        const res = `<div>${name}</div><div>${lastName}</div><div>${age}</div>`;
        userInfoElem.innerHTML = res;
      })
  }
  

  if (todosElem) {
    fetch(`${BASE_URL}/todos`)
      .then(response => response.json())
      .then(todos => {
        const list = todos.slice(0, 10).map(t => `<li>${t.title}</li>`).join('');
        todosElem.innerHTML = list;
      })
  }

  if (postsElem) {
    fetch(`${BASE_URL}/posts`)
      .then(response => response.json())
      .then(posts => {
        const list = posts.slice(0, 10).map(t => `<li><div>${t.title}</div><div>${t.body}</div></li>`).join('');
        postsElem.innerHTML = list;
      })
  }


  setTimeout(() => {
    const img = new Image();
    img.src = '/images/dog.svg';
    img.width = 100;
    document.body.appendChild(img);
  }, 3000);
}())

