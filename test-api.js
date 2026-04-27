const http = require('http');

async function run() {
  console.log("Fetching current status...");
  let res = await fetch("http://localhost:3000/api/children");
  let data = await res.json();
  let child = data.data[0];
  console.log("Current status:", child.revisado);

  console.log("Patching status...");
  res = await fetch(`http://localhost:3000/api/children/${child.id}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ revisado: !child.revisado })
  });
  let patchData = await res.json();
  console.log("Patch response:", patchData.data.revisado);

  console.log("Fetching status again...");
  res = await fetch("http://localhost:3000/api/children");
  data = await res.json();
  child = data.data.find(c => c.id === patchData.data.id);
  console.log("New status:", child.revisado);
}
run();
