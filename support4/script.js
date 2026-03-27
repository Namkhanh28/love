// ====== BIẾN ======
let students = [];
let editId = null;

// DOM
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const classInput = document.getElementById("class");
const btnSave = document.getElementById("btnSave");
const table = document.getElementById("studentTable");

// ====== LOCAL STORAGE ======
const saveData = () => {
  localStorage.setItem("students", JSON.stringify(students));
};

const loadData = () => {
  const data = localStorage.getItem("students");
  if (data) students = JSON.parse(data);
};

// ====== HIỂN THỊ ======
const render = () => {
  table.innerHTML = "";

  students.forEach((s, index) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${s.name}</td>
      <td>${s.age}</td>
      <td class="${s.class.includes("CNTT") ? "cntt" : ""}">
        ${s.class}
      </td>
      <td>
        <button onclick="editStudent(${s.id})">Sửa</button>
        <button onclick="deleteStudent(${s.id})">Xóa</button>
      </td>
    `;

    table.appendChild(row);
  });
};

// ====== THÊM / SỬA ======
btnSave.onclick = () => {
  let name = nameInput.value.trim();
  let age = ageInput.value;
  let cls = classInput.value.trim();

  if (!name || !age || !cls) {
    alert("Nhập đầy đủ!");
    return;
  }

  if (editId) {
    // UPDATE
    let student = students.find((s) => s.id === editId);
    student.name = name;
    student.age = Number(age);
    student.class = cls;

    editId = null;
    btnSave.innerText = "Thêm";
  } else {
    // CREATE
    students.push({
      id: Date.now(),
      name,
      age: Number(age),
      class: cls,
    });
  }

  saveData();
  render();

  // reset form
  nameInput.value = "";
  ageInput.value = "";
  classInput.value = "";
};

// ====== XÓA ======
const deleteStudent = (id) => {
  if (confirm("Bạn có chắc muốn xóa?")) {
    students = students.filter((s) => s.id !== id);
    saveData();
    render();
  }
};

// ====== SỬA ======
const editStudent = (id) => {
  let student = students.find((s) => s.id === id);

  nameInput.value = student.name;
  ageInput.value = student.age;
  classInput.value = student.class;

  editId = id;
  btnSave.innerText = "Cập nhật";
};

// ====== CHẠY ======
loadData();
render();
