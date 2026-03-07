const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const projectForm = document.getElementById("projectForm");
const projectIdInput = document.getElementById("projectId");
const projectNameInput = document.getElementById("projectName");
const projectDescInput = document.getElementById("projectDesc");
const nameErrorSpan = document.getElementById("nameError");
const projectTableBody = document.getElementById("projectTableBody");
const searchInput = document.getElementById("searchInput");
const deleteConfirmModal = document.getElementById("deleteConfirmModal");

let projects = JSON.parse(localStorage.getItem("projects")) || [];
console.log(projects);

let nextProjectId = 7;
let editingProjectId = null;
let currentProjectIdToDelete = null;
let currentId = JSON.parse(localStorage.getItem("currentUser")).id;
// function escapeSingleQuotes(str) {
//   if (!str) return "";
//   return str.replace(/'/g, "\\'");
// }

function saveProjectsToLocalStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function loadProjectsFromLocalStorage() {
  const storedProjects = localStorage.getItem("projects");
  if (storedProjects) {
    projects = JSON.parse(storedProjects);
    nextProjectId =
      projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
  }
}

// === Các hàm xử lý Modal Thêm/Sửa ===
function openModal(id = null) {
  projectForm.reset(); // Đặt lại form
  nameErrorSpan.style.display = "none";
  projectNameInput.style.borderColor = "";
  editingProjectId = id;

  if (id === null) {
    modalTitle.textContent = "Thêm Dự Án";
    projectIdInput.value = "";
  } else {
    modalTitle.textContent = "Sửa Dự Án";
    const projectToEdit = projects.find((p) => p.id === id);
    if (projectToEdit) {
      projectIdInput.value = projectToEdit.id;
      projectNameInput.value = projectToEdit.name;
      projectDescInput.value = projectToEdit.description || "";
    } else {
      console.error("Không tìm thấy dự án với ID:", id);
      alert("Lỗi: Không tìm thấy dự án để sửa.");
      return;
    }
  }
  modal.style.display = "block";
  projectNameInput.focus();
}

function closeModal() {
  modal.style.display = "none";
}

function saveProject(event) {
  event.preventDefault();
  const projectName = projectNameInput.value.trim();
  const projectDesc = projectDescInput.value.trim();
  const currentId = editingProjectId;

  if (projectName === "") {
    nameErrorSpan.textContent = "Tên dự án không được để trống.";
    nameErrorSpan.style.display = "block";
    projectNameInput.style.borderColor = "red";
    projectNameInput.focus();
    return;
  }
  const isNameDuplicate = projects.some(
    (p) =>
      p.name.toLowerCase() === projectName.toLowerCase() && p.id !== currentId
  );
  if (isNameDuplicate) {
    nameErrorSpan.textContent = "Tên dự án này đã tồn tại.";
    nameErrorSpan.style.display = "block";
    projectNameInput.style.borderColor = "red";
    projectNameInput.focus();
    return;
  }
  nameErrorSpan.style.display = "none";
  projectNameInput.style.borderColor = "";

  if (currentId === null) {
    let nextId = 1; // Mặc định ID bắt đầu từ 1
    if (projects.length > 0) {
      // Tìm ID lớn nhất hiện có
      const maxId = Math.max(...projects.map((p) => p.id));
      nextId = maxId + 1; // ID tiếp theo là ID lớn nhất + 1
    }
    let newProject = {
      id: nextId,
      name: projectNameInput.value,
      description: projectDescInput.value,
      members: [{ userId: 1, role: "Project Owner" }],
    };
    projects.push(newProject);
  } else {
    const projectIndex = projects.findIndex((p) => p.id === currentId);
    if (projectIndex !== -1) {
      projects[projectIndex].name = projectName;
      projects[projectIndex].description = projectDesc;
    } else {
      console.error("Lỗi: Không tìm thấy dự án để cập nhật với ID:", currentId);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Có lỗi xảy ra khi cập nhật dự án.",
      });
      return;
    }
  }

  saveProjectsToLocalStorage(); // Save to localStorage
  closeModal();
  Swal.fire({
    icon: "success",
    title: "Thành công",
    text: `Đã ${
      currentId === null ? "thêm" : "cập nhật"
    } dự án "${projectName}" thành công!`,
  });
  renderProjectTable();
}
function renderProjectTable() {
  projectTableBody.innerHTML = "";
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProjects = projects.filter(
    (project) =>
      project.members &&
      project.members.some((member) => member.userId === currentId) &&
      (project.name.toLowerCase().includes(searchTerm) ||
        (project.description &&
          project.description.toLowerCase().includes(searchTerm)) ||
        project.id.toString().includes(searchTerm))
  );
  console.log(filteredProjects);
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (currentPage > totalPages) {
    currentPage = totalPages > 0 ? totalPages : 1;
  }
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const projectsToDisplay = filteredProjects.slice(startIndex, endIndex);

  if (projectsToDisplay.length === 0) {
    projectTableBody.innerHTML =
      '<tr><td colspan="3" style="text-align: center;">Không tìm thấy dự án nào.</td></tr>';
    updatePaginationButtons(totalPages);
    return;
  }

  projectsToDisplay.forEach((project) => {
    const row = document.createElement("tr");
    row.innerHTML = `
<td>${project.id}</td>
<td>${project.name}</td>
<td>
    <button class="btn btn-edit" onclick="editProject(${
      project.id
    })">Sửa</button>
    <button class="btn btn-delete" onclick="showDeleteConfirmModal(${
      project.id
    }, '${escapeSingleQuotes(project.name)}')">Xóa</button>
    <button class="btn btn-detail" onclick="showProjectDetail(${
      project.id
    })">Chi tiết</button>
</td>
`;
    projectTableBody.appendChild(row);
  });
  updatePaginationButtons(totalPages);
}

function editProject(id) {
  console.log("Yêu cầu sửa dự án ID:", id);
  openModal(id);
}

function showProjectDetail(id) {
  const project = projects.find((p) => p.id === id);
  if (project) {
    // Mã hóa tên và mô tả để đảm bảo chúng hợp lệ trong URL
    const encodedName = encodeURIComponent(project.name);
    // Sử dụng || '' để xử lý trường hợp mô tả là null hoặc không xác định
    const encodedDesc = encodeURIComponent(project.description || "");

    // Xây dựng URL với cả hai tham số name và description
    window.location.href = `product.html?name=${encodedName}&description=${encodedDesc}`;
  } else {
    // Sử dụng thông báo thân thiện hơn, ví dụ SweetAlert
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không tìm thấy dự án.",
    });
    // alert("Không tìm thấy dự án"); // Thông báo gốc
  }
}
// const project = projects.find((p) => p.id === id);
// if (project) {
//   alert(
//     `Chi tiết Dự án:\n\nID: ${project.id}\nTên: ${project.name}\nMô tả: ${
//       project.description || "(Không có mô tả)"
//     }`
//   );
// } else {
//   alert("Không tìm thấy thông tin chi tiết cho dự án này.");
// }

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderProjectTable();
});

function switchpage() {
  Swal.fire({
    icon: "info",
    title: "Chuyển trang",
    text: "Dăng xu...",
    showConfirmButton: false,
    timer: 1500,
  });
  window.location.href = "./task_manager.html";
}

function out() {
  Swal.fire({
    title: "Xác nhận đăng xuất",
    text: "Bạn có chắc chắn muốn đăng xuất không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Đăng xuất",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.removeItem("isLoggedIn");
      window.location.href = "login1.html";
      console.log("Đăng xuất...");
    }
  });
}

let currentPage = 1;
const itemsPerPage = 5;
const paginationNumbers = document.querySelector(".pagination .page-numbers");
const btnPrev = document.querySelector(".pagination .btn-prev");
const btnNext = document.querySelector(".pagination .btn-next");

function updatePaginationButtons(totalPages = 0) {
  if (!paginationNumbers) return;
  paginationNumbers.innerHTML = "";
  if (totalPages <= 0) {
    btnPrev.disabled = true;
    btnNext.disabled = true;
    return;
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("btn", "btn-page");
    pageButton.textContent = i;
    pageButton.onclick = () => goToPage(i);
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    paginationNumbers.appendChild(pageButton);
  }
  btnPrev.disabled = currentPage === 1;
  btnNext.disabled = currentPage === totalPages;
  console.log(`Pagination updated: Page ${currentPage}/${totalPages}`);
}
const deleteConfirmMessage = document.getElementById("deleteConfirmMessage");
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderProjectTable();
  }
}
function nextPage() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm)) ||
      project.id.toString().includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderProjectTable();
  }
}
function goToPage(pageNumber) {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm)) ||
      project.id.toString().includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    currentPage = pageNumber;
    renderProjectTable();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Trang đã tải xong, đang render bảng...");
  loadProjectsFromLocalStorage();
  renderProjectTable();
});

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }

  if (event.target == deleteConfirmModal) {
    closeDeleteConfirmModal();
  }
};
function showDeleteConfirmModal(projectId, projectName) {
  const deleteMessage = `Bạn chắc chắn muốn xoá dự án "${projectName}"?`;
  const deleteConfirmMessage = document.getElementById("deleteConfirmMessage");
  if (deleteConfirmMessage) {
    deleteConfirmMessage.textContent = deleteMessage;
  }

  deleteConfirmModal.style.display = "block";

  const confirmDeleteButton = document.getElementById("confirmDeleteButton");
  if (confirmDeleteButton) {
    // Xóa event cũ nếu có
    const newButton = confirmDeleteButton.cloneNode(true);
    confirmDeleteButton.parentNode.replaceChild(newButton, confirmDeleteButton);

    newButton.onclick = function () {
      confirmActualDelete(projectId);
    };
  }
}

function confirmActualDelete(projectId) {
  const index = projects.findIndex((p) => p.id === projectId);
  if (index !== -1) {
    const deletedProjectName = projects[index].name;
    projects.splice(index, 1);
    saveProjectsToLocalStorage();
    closeDeleteConfirmModal();
    Swal.fire({
      icon: "success",
      title: "Đã xoá",
      text: `Dự án "${deletedProjectName}" đã được xoá.`,
    });
    renderProjectTable();
  } else {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không tìm thấy dự án để xoá.",
    });
  }
}

function closeDeleteConfirmModal() {
  document.getElementById("deleteConfirmModal").style.display = "none";
}

function escapeSingleQuotes(str) {
  if (!str) return "";
  return str.replace(/'/g, "\\'");
}
