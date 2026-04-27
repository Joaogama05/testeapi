fetch('http://localhost:3000')
  .then(res => console.log(res.status))
  .catch(e => console.log(e.message));
