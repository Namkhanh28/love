function out() {
  // Hiển thị xác nhận trước khi đăng xuất
  Swal.fire({
    title: "Bạn chắc chắn muốn đăng xuất?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đăng xuất",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "login1.html"; // Chuyển hướng đến trang đăng nhập
    }
  });
}
function switchpageMision() {
  window.location = "task_manager.html";
}
document.addEventListener("DOMContentLoaded", () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);

    const projectName = decodeURIComponent(
      urlParams.get("name") || "Không tìm thấy tên dự án"
    );
    const projectDescription = decodeURIComponent(
      urlParams.get("description") || "Không có mô tả."
    );

    // 3. Tìm các phần tử HTML cần cập nhật
    const titleElement = document.getElementById("project-title");
    // Sử dụng querySelector vì phần tử mô tả dùng class
    const descriptionElement = document.querySelector(
      ".project-description-content"
    );

    // 4. Cập nhật nội dung cho các phần tử (kiểm tra xem phần tử có tồn tại không)
    if (titleElement) {
      titleElement.textContent = projectName;
    } else {
      console.warn('Không tìm thấy phần tử h2 với ID "project-title".');
    }

    if (descriptionElement) {
      descriptionElement.textContent = projectDescription;
      // Thêm class nếu không có mô tả để có thể tạo kiểu riêng (tùy chọn)
      if (
        !urlParams.has("description") ||
        projectDescription === "Không có mô tả."
      ) {
        descriptionElement.classList.add("no-description"); // Bạn có thể thêm CSS cho class này
      }
    } else {
      console.warn(
        'Không tìm thấy phần tử p với class "project-description-content".'
      );
    }

    // 5. (Tùy chọn) Cập nhật tiêu đề của tab trình duyệt
    document.title = `Chi Tiết: ${projectName} - Quản Lý Nhiệm Vụ`;
  } catch (error) {
    console.error("Lỗi khi lấy hoặc hiển thị chi tiết dự án từ URL:", error);
    // Có thể hiển thị thông báo lỗi cho người dùng nếu cần
    const titleElement = document.getElementById("project-title");
    if (titleElement) titleElement.textContent = "Lỗi Tải Dữ Liệu";
    const descriptionElement = document.querySelector(
      ".project-description-content"
    );
    if (descriptionElement)
      descriptionElement.textContent = "Không thể tải mô tả dự án.";
  }

  // --- Phần còn lại của mã trong product.js của bạn (ví dụ: xử lý task, member...) ---
  // Ví dụ:
  // loadTasksForProject(projectName); // Bạn có thể cần ID dự án thay vì tên ở đây
  // loadMembersForProject(projectName);
});

function switchpage() {
  window.location.href = "category_manager.html";
}

// --- DỮ LIỆU BAN ĐẦU & CẤU HÌNH ---
// Danh sách nhiệm vụ mặc định nếu localStorage trống
let initialTasks = [
  {
    id: 1,
    taskName: "Soạn thảo đề cương dự án",
    assignee: "An Nguyễn", // Tên người phụ trách
    projectId: 1,
    startDate: "2025-03-24", // Ngày bắt đầu
    dueDate: "2025-03-26", // Hạn chót
    priority: "Thấp",
    progressStatus: "Đúng tiến độ", // Tiến độ
    statusTask: "todo", // Trạng thái
  },
  {
    id: 2,
    taskName: "Thiết kế giao diện trang chủ",
    assignee: "Bách Nguyễn",
    projectId: 1,
    startDate: "2024-03-01",
    dueDate: "2024-03-10",
    priority: "Cao",
    progressStatus: "Có rủi ro",
    statusTask: "inprogress",
  },
  {
    id: 4, // Lưu ý: ID 3 bị bỏ qua, đảm bảo ID là duy nhất
    taskName: "Hoàn thành báo cáo tuần 1",
    assignee: "An Nguyễn",
    projectId: 1,
    startDate: "2024-03-01",
    dueDate: "2024-03-05",
    priority: "Trung bình",
    progressStatus: "Đúng tiến độ",
    statusTask: "done",
  },
  {
    // Thêm ví dụ về nhiệm vụ đang chờ
    id: 5,
    taskName: "Chờ duyệt bản thiết kế",
    assignee: "An Nguyễn",
    projectId: 1,
    startDate: "2024-03-11",
    dueDate: "2024-03-15",
    priority: "Trung bình",
    progressStatus: "Đúng tiến độ",
    statusTask: "pending",
  },
];

// --- HỖ TRỢ LOCAL STORAGE ---
function getTasksFromLocalStorage() {
  const tasksJSON = localStorage.getItem("tasks");
  try {
    const tasks = JSON.parse(tasksJSON);
    // Kiểm tra cơ bản: Xác nhận nếu là mảng
    if (Array.isArray(tasks)) {
      return tasks;
    }
  } catch (e) {
    console.error("Lỗi khi phân tích dữ liệu nhiệm vụ từ localStorage:", e);
  }
  // Trả về danh sách nhiệm vụ mặc định nếu localStorage trống hoặc không hợp lệ
  // Optionally save initialTasks to localStorage here if it was empty
  // localStorage.setItem("tasks", JSON.stringify(initialTasks));
  return initialTasks;
}

function saveTasksToLocalStorage(tasks) {
  if (Array.isArray(tasks)) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else {
    console.error("Dữ liệu không phải là mảng, không thể lưu:", tasks);
  }
}

// --- HIỂN THỊ DANH SÁCH NHIỆM VỤ ---
function renderTaskTable(filterText = "", sortBy = "") {
  const tbody = document.querySelector(".task-table tbody");
  if (!tbody) {
    console.error("Lỗi: Không tìm thấy phần tử tbody của bảng nhiệm vụ!");
    return;
  }
  tbody.innerHTML = ""; // Xóa nội dung cũ

  let currentTasks = getTasksFromLocalStorage();

  // 1. Lọc nhiệm vụ
  if (filterText) {
    const lowerFilterText = filterText.toLowerCase();
    currentTasks = currentTasks.filter(
      (task) =>
        task.taskName?.toLowerCase().includes(lowerFilterText) ||
        task.assignee?.toLowerCase().includes(lowerFilterText)
    );
  }

  // 2. Sắp xếp nhiệm vụ
  if (sortBy) {
    currentTasks.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { Cao: 3, "Trung bình": 2, Thấp: 1 };
          return (
            (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
          );
        case "dueDate":
          // Đảm bảo ngày hợp lệ trước khi so sánh
          const dateA = a.dueDate ? new Date(a.dueDate) : 0;
          const dateB = b.dueDate ? new Date(b.dueDate) : 0;
          return dateA - dateB;
        case "startDate":
          const startDateA = a.startDate ? new Date(a.startDate) : 0;
          const startDateB = b.startDate ? new Date(b.startDate) : 0;
          return startDateA - startDateB;
        case "assignee":
          return (a.assignee || "").localeCompare(b.assignee || "");
        default:
          return 0;
      }
    });
  }

  // 3. Nhóm nhiệm vụ theo trạng thái
  const groups = {
    todo: [],
    inprogress: [],
    pending: [],
    done: [],
  };
  const groupDisplayNames = {
    todo: "To do",
    inprogress: "In Progress",
    pending: "Pending",
    done: "Done",
  };
  const priorityClassMap = {
    thấp: "low",
    "trung bình": "medium",
    cao: "high",
  };
  const progressClassMap = {
    "đúng tiến độ": "ontrack",
    "có rủi ro": "atrisk",
    "trễ hạn": "offtrack",
  };

  if (!currentTasks || currentTasks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">${
      filterText ? "Không tìm thấy nhiệm vụ nào khớp." : "Chưa có nhiệm vụ nào."
    }</td></tr>`;
    return;
  }

  currentTasks.forEach((task) => {
    if (task && task.statusTask) {
      const statusKey = task.statusTask.toLowerCase().trim();
      if (groups.hasOwnProperty(statusKey)) {
        groups[statusKey].push(task);
      } else {
        console.warn(
          `Nhiệm vụ ID ${task.id} có trạng thái không hợp lệ: ${task.statusTask}`
        );
      }
    } else {
      console.warn(`Nhiệm vụ không hợp lệ hoặc thiếu trạng thái:`, task);
    }
  });

  // 4. Hiển thị các nhóm và nhiệm vụ
  let totalRenderedTasks = 0;
  for (const [groupName, tasksInGroup] of Object.entries(groups)) {
    const displayName =
      groupDisplayNames[groupName] ||
      groupName.charAt(0).toUpperCase() + groupName.slice(1);
    const headerRow = document.createElement("tr");
    headerRow.className = "group-header clickable-group";
    headerRow.onclick = (event) => toggleTaskGroup(event, groupName);
    headerRow.innerHTML = `<td colspan="7">▼ ${displayName} (${tasksInGroup.length})</td>`;
    tbody.appendChild(headerRow);

    if (tasksInGroup.length > 0) {
      totalRenderedTasks += tasksInGroup.length;
      tasksInGroup.forEach((t) => {
        const priorityClass =
          priorityClassMap[t.priority?.toLowerCase()] || "default";
        const progressClass =
          progressClassMap[t.progressStatus?.toLowerCase()] || "default";
        const taskRow = document.createElement("tr");
        taskRow.className = `${groupName}-task`; // Lớp cho hàng nhiệm vụ
        taskRow.innerHTML = `
                      <td>${t.taskName || "N/A"}</td>
                      <td>${t.assignee || "N/A"}</td>
                      <td><span class="badge badge-${priorityClass}">${
          t.priority || "N/A"
        }</span></td>
                      <td>${t.startDate || "N/A"}</td>
                      <td>${t.dueDate || "N/A"}</td>
                      <td><span class="badge badge-${progressClass}">${
          t.progressStatus || "N/A"
        }</span></td>
                      <td>
                          <button class="btn btn-edit btn-sm" onclick="editTask(${
                            t.id
                          })">Sửa</button>
                          <button class="btn btn-delete btn-sm" onclick="deleteTask(${
                            t.id
                          })">Xóa</button>
                      </td>
                  `;
        tbody.appendChild(taskRow);
      });
    } else {
      // Thêm hàng trống cho nhóm không có nhiệm vụ, ban đầu ẩn
      const emptyRow = document.createElement("tr");
      emptyRow.className = `${groupName}-task hidden`; // Bắt đầu ẩn
      emptyRow.innerHTML = `<td colspan="7" style="font-style: italic; color: #888;">(Chưa có nhiệm vụ trong mục này)</td>`;
      tbody.appendChild(emptyRow);
      // Thu gọn tiêu đề nhóm trống
      headerRow.querySelector("td").textContent = `► ${displayName} (0)`;
    }

    // Mặc định thu gọn nhóm 'Done' nếu có nhiệm vụ
    if (groupName === "done" && tasksInGroup.length > 0) {
      toggleTaskGroup({ currentTarget: headerRow }, groupName); // Giả lập nhấp chuột để thu gọn
    }
  }

  // Hiển thị thông báo nếu lọc không tìm thấy nhiệm vụ nào
  if (filterText && totalRenderedTasks === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">Không tìm thấy nhiệm vụ nào khớp với "${filterText}".</td></tr>`;
  }
}

// --- TASK GROUP TOGGLE ---
function toggleTaskGroup(event, groupName) {
  // Find all task rows for this group
  const rows = document.querySelectorAll(`.${groupName}-task`);
  rows.forEach((row) => row.classList.toggle("hidden"));

  // Update the header arrow indicator
  const header = event.currentTarget.querySelector("td");
  if (header) {
    if (header.textContent.trim().startsWith("▼")) {
      header.textContent = header.textContent.replace("▼", "►");
    } else {
      header.textContent = header.textContent.replace("►", "▼");
    }
  }
}

// --- TASK FORM MODAL ---
const taskFormModal = document.getElementById("taskFormModal");
const taskForm = document.getElementById("taskFormElement");
const taskFormTitle = document.getElementById("taskFormTitle");
const taskIdInput = document.getElementById("taskId"); // Hidden input for ID
const taskNameInput = document.getElementById("taskName");
const deadlineInput = document.getElementById("deadline");
const startDateInput = document.getElementById("startDate");

function openAddTaskForm() {
  taskForm.reset(); // Clear previous data
  taskIdInput.value = ""; // Ensure no ID is set
  taskFormTitle.textContent = "Thêm Nhiệm Vụ Mới";
  // Clear potential validation errors
  clearValidationErrors();
  taskFormModal.style.display = "flex";
}

function closeTaskForm() {
  taskForm.reset();
  taskIdInput.value = "";
  clearValidationErrors();
  taskFormModal.style.display = "none";
}

function clearValidationErrors() {
  taskNameInput.classList.remove("input-error");
  document.getElementById("taskNameError").style.display = "none";
  document.getElementById("taskNameError").textContent = "";

  deadlineInput.classList.remove("input-error");
  document.getElementById("deadlineError").style.display = "none";
  document.getElementById("deadlineError").textContent = "";
  // Add for other fields if needed
}

function validateTaskForm() {
  clearValidationErrors();
  let isValid = true;

  // Basic required check (HTML5 'required' handles some of this)
  if (!taskNameInput.value.trim()) {
    isValid = false;
    taskNameInput.classList.add("input-error");
    document.getElementById("taskNameError").textContent =
      "Tên nhiệm vụ không được để trống.";
    document.getElementById("taskNameError").style.display = "block";
  }

  // Date validation: Deadline >= Start Date
  if (startDateInput.value && deadlineInput.value) {
    const startDate = new Date(startDateInput.value);
    const deadlineDate = new Date(deadlineInput.value);
    if (deadlineDate < startDate) {
      isValid = false;
      deadlineInput.classList.add("input-error");
      document.getElementById("deadlineError").textContent =
        "Hạn cuối phải sau hoặc bằng ngày bắt đầu.";
      document.getElementById("deadlineError").style.display = "block";
    }
  }
  // Add more specific validations as needed (e.g., task name uniqueness within the project)

  return isValid;
}

// Handle form submission (Add/Edit)
taskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  if (!validateTaskForm()) {
    Swal.fire("Lỗi", "Vui lòng kiểm tra lại thông tin đã nhập.", "error");
    return; // Stop if validation fails
  }

  const taskData = {
    id: taskIdInput.value ? parseInt(taskIdInput.value) : null, // Get ID if editing
    taskName: document.getElementById("taskName").value.trim(),
    assignee: document.getElementById("assignee").value,
    statusTask: document.getElementById("taskStatus").value,
    startDate: document.getElementById("startDate").value,
    dueDate: document.getElementById("deadline").value,
    priority: document.getElementById("priority").value,
    progressStatus: document.getElementById("progressStatus").value,
    projectId: 1, // Assuming a fixed project ID for now
  };

  saveTask(taskData);
});

// --- CRUD OPERATIONS ---
function saveTask(taskData) {
  let currentTasks = getTasksFromLocalStorage();
  const isEditing = taskData.id !== null;

  if (isEditing) {
    // --- EDIT existing task ---
    const index = currentTasks.findIndex((t) => t.id === taskData.id);
    if (index !== -1) {
      currentTasks[index] = { ...currentTasks[index], ...taskData }; // Merge updates
      saveTasksToLocalStorage(currentTasks);
      renderTaskTable();
      closeTaskForm();
      Swal.fire("Thành công", "Đã cập nhật nhiệm vụ!", "success");
    } else {
      console.error(`Không tìm thấy task với ID ${taskData.id} để sửa.`);
      Swal.fire("Lỗi", "Không tìm thấy nhiệm vụ để cập nhật.", "error");
    }
  } else {
    // --- ADD new task ---
    // Generate a new unique ID
    const newId =
      currentTasks.length > 0
        ? Math.max(...currentTasks.map((t) => t.id || 0)) + 1
        : 1;
    taskData.id = newId;

    currentTasks.push(taskData);
    saveTasksToLocalStorage(currentTasks);
    renderTaskTable();
    closeTaskForm();
    Swal.fire("Thành công", "Đã thêm nhiệm vụ mới!", "success");
  }
}

function editTask(taskId) {
  const currentTasks = getTasksFromLocalStorage();
  const taskToEdit = currentTasks.find((t) => t.id === taskId);

  if (taskToEdit) {
    // Populate the form
    taskIdInput.value = taskToEdit.id; // Set hidden ID
    document.getElementById("taskName").value = taskToEdit.taskName || "";
    document.getElementById("assignee").value = taskToEdit.assignee || "";
    document.getElementById("taskStatus").value = taskToEdit.statusTask || "";
    document.getElementById("startDate").value = taskToEdit.startDate || "";
    document.getElementById("deadline").value = taskToEdit.dueDate || "";
    document.getElementById("priority").value = taskToEdit.priority || "";
    document.getElementById("progressStatus").value =
      taskToEdit.progressStatus || "";

    // Change modal title and open
    taskFormTitle.textContent = "Sửa Nhiệm Vụ";
    clearValidationErrors(); // Clear previous errors
    taskFormModal.style.display = "flex";
  } else {
    console.error(`Không tìm thấy task với ID ${taskId} để sửa.`);
    Swal.fire("Lỗi", "Không tìm thấy nhiệm vụ để sửa.", "error");
  }
}

function deleteTask(taskId) {
  Swal.fire({
    title: "Bạn chắc chắn muốn xóa nhiệm vụ này?",
    text: "Hành động này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa nó!",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      let currentTasks = getTasksFromLocalStorage();
      const initialLength = currentTasks.length;
      currentTasks = currentTasks.filter((t) => t.id !== taskId);

      if (currentTasks.length < initialLength) {
        saveTasksToLocalStorage(currentTasks);
        renderTaskTable(); // Re-render the table
        Swal.fire("Đã xóa!", "Nhiệm vụ đã được xóa.", "success");
      } else {
        Swal.fire("Lỗi!", "Không tìm thấy nhiệm vụ để xóa.", "error");
      }
    }
  });
}

// --- MEMBER FORM MODAL ---
const memberFormModal = document.getElementById("memberFormModal");
const addMemberForm = document.getElementById("addMemberForm");

function showMemberForm() {
  addMemberForm.reset(); // Reset form
  memberFormModal.style.display = "flex";
  // Optionally close task form if open
  if (taskFormModal.style.display === "flex") {
    closeTaskForm();
  }
}

function hideMemberForm() {
  addMemberForm.reset();
  memberFormModal.style.display = "none";
}

// Handle Add Member Form Submission (Placeholder)
addMemberForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("memberEmail").value;
  const role = document.getElementById("memberRole").value;
  console.log("Thêm thành viên:", { email, role });
  // --- Placeholder for actual add member logic ---
  // 1. Send data to backend API or update local member list
  // 2. Update the displayed member list (if successful)
  // 3. Show success message
  // 4. Close modal
  Swal.fire(
    "Thông báo",
    `Chức năng thêm thành viên (${email} - ${role}) chưa được cài đặt đầy đủ.`,
    "info"
  );
  hideMemberForm(); // Close modal for now
});

// --- SEARCH & SORT EVENT LISTENERS ---
const searchInput = document.getElementById("taskSearchInput");
const sortSelect = document.querySelector(".select-sort");

searchInput.addEventListener("input", () => {
  renderTaskTable(searchInput.value, sortSelect.value);
});

sortSelect.addEventListener("change", () => {
  renderTaskTable(searchInput.value, sortSelect.value);
});

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("Trang đã tải xong. Bắt đầu render bảng...");
  renderTaskTable(); // Render the table initially on page load
  // Add other initialization logic here (e.g., load project details, members)
});
