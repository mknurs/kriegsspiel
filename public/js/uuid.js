const client = io();

client.on("uuid", (uuid) => {
  const roomnameField = document.getElementById("roomnameField");
  roomnameField.placeholder = uuid;
})