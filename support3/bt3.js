let students = [
  { id: 1734567890, name: "Nguyễn Văn A", age: 20, class: "CNTT-12" },
  { id: 1734567891, name: "Trần Thị B", age: 21, class: "KTPM-11" },
  { id: 1734567892, name: "Lê Văn C", age: 19, class: "CNTT-12" },
  { id: 1734567893, name: "Phạm Thị D", age: 22, class: "MKT-10" },
  { id: 1734567894, name: "Hoàng Văn E", age: 20, class: "CNTT-11" },
];


let studentName = document.getElementById("student_name");
let studentAge = document.getElementById("student_age");
let studentClass = document.getElementById("student_class");
let buttonAddStudent = document.getElementById("btn_add");

const getData = () => {
  let data = localStorage.getItem("listStudent");
  if (data) {
    students = JSON.parse(data);
  }
};


const saveToStorage = () => {
  localStorage.setItem("listStudent", JSON.stringify(students));
};


const handleRenderData = () => {
  let table = document.getElementById("studentTable");
  table.innerHTML = "";

  students.forEach((student, index) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.class}</td>
    `;

    table.appendChild(row);
  });
};

const handleAddStudent = () => {
  if (!studentName.value || !studentAge.value || !studentClass.value) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  let newStudent = {
    id: Date.now(),
    name: studentName.value.trim(),
    age: Number(studentAge.value),
    class: studentClass.value.trim(),
  };

  students.push(newStudent);

  saveToStorage();
  handleRenderData();

  studentName.value = "";
  studentAge.value = "";
  studentClass.value = "";
  studentName.focus();

  alert("Thêm sinh viên thành công!");
};
buttonAddStudent.addEventListener("click", handleAddStudent);

getData();
handleRenderData();
