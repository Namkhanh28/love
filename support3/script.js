let students = [
  { id: 1734567890, name: "Nguyễn Văn A", age: 20, class: "CNTT-12" },
  { id: 1734567891, name: "Trần Thị B", age: 21, class: "KTPM-11" },
  { id: 1734567892, name: "Lê Văn C", age: 19, class: "CNTT-12" },
  { id: 1734567893, name: "Phạm Thị D", age: 22, class: "MKT-10" },
  { id: 1734567894, name: "Hoàng Văn E", age: 20, class: "CNTT-11" },
];

// Lấy dữ liệu từ localStorage
const getData = () => {
  let data = localStorage.getItem("listStudent");
  if (data) {
    students = JSON.parse(data);
  }
};

// Lưu dữ liệu
const saveToStorage = () => {
  localStorage.setItem("listStudent", JSON.stringify(students));
};

// Render bảng
const handleRenderData = () => {
  let table = document.getElementById("studentTable");

  table.innerHTML = ""; // tránh bị lặp

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

// Chạy chương trình
getData();
handleRenderData();
saveToStorage();
