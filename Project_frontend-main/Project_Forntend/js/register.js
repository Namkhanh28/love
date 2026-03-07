document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const form = document.getElementById("registerForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirm_password.value.trim();

    if (name === "") {
      Swal.fire({
        title: "Thiếu thông tin!",
        text: "Họ và tên không được để trống.",
        icon: "warning",
        confirmButtonText: "Điền lại",
      });
      return;
    } else if (email === "") {
      Swal.fire({
        title: "Thiếu thông tin!",
        text: "Email không được để trống.",
        icon: "warning",
        confirmButtonText: "Điền lại",
      });
      return;
    } else if (!email.includes("@") || !email.includes(".com")) {
      Swal.fire({
        title: "Email không hợp lệ!",
        text: "Vui lòng nhập đúng định dạng email.",
        icon: "error",
        confirmButtonText: "Thử lại",
      });
      return;
    } else if (password === "") {
      Swal.fire({
        title: "Thiếu thông tin!",
        text: "Mật khẩu không được để trống.",
        icon: "warning",
        confirmButtonText: "Điền lại",
      });
      return;
    } else if (password.length < 8) {
      Swal.fire({
        title: "Mật khẩu quá ngắn!",
        text: "Mật khẩu phải có tối thiểu 8 ký tự.",
        icon: "error",
        confirmButtonText: "Thử lại",
      });
      return;
    } else if (confirmPassword === "") {
      Swal.fire({
        title: "Thiếu thông tin!",
        text: "Mật khẩu xác nhận không được để trống.",
        icon: "warning",
        confirmButtonText: "Điền lại",
      });
      return;
    } else if (password !== confirmPassword) {
      Swal.fire({
        title: "Mật khẩu không khớp!",
        text: "Mật khẩu xác nhận phải trùng với mật khẩu.",
        icon: "error",
        confirmButtonText: "Thử lại", // Sửa thành confirmButtonText
      });
      return;
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      Swal.fire({
        // Sửa thành Swal.fire
        title: "Email đã tồn tại!",
        text: "Vui lòng sử dụng email khác.",
        icon: "error",
        confirmButtonText: "Thử lại", // Sửa thành confirmButtonText
      });
      return;
    }

    const newUser = {
      id: users.length == 0 ? 1 : users[length].id + 1, // Nên thêm ID duy nhất
      name: name,
      email: email,
      password: password, // Cảnh báo: Không lưu mật khẩu dạng text rõ!
    };

    Swal.fire({
      // Sửa thành Swal.fire
      title: "Đăng ký thành công!",
      text: "Tài khoản của bạn đã được tạo. Chuyển hướng đến trang đăng nhập.",
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        window.location.href = "login1.html";
      }
    });
  });
});
