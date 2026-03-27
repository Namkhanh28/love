const users = [
  { username: "nguyen", password: "123456" },
  { username: "admin", password: "admin123" },
  { username: "test", password: "testpass" },
];
let name = document.getElementById("nameUser");
let pass = document.getElementById("passUser");
let btn_add = document.getElementById("submit");
const getData = () => {
  let data = localStorage.getItem("listUser");
  if (data) {
    users = JSON.parse(data);
  }
};
const saveData = () => {
  localStorage.setItem("listUser", JSON.stringify(users));
};
function renderData() {
  let information = document.getElementById("tableInfo");
  information.innerHTML = "";
  users.forEach((user, index) => {
    let row = document.createElement("tr");
    row.innerHTML = ` 
    <td>${index + 1}</td>
       <td>${user.username}</td>
        <td>${user.password}</td>
    `;
    information.appendChild(row);
  });
}
renderData();
