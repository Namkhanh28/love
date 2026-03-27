let singers = [
  {
    id: 1,
    name: "Sơn Tùng M-TP",
    birthDate: "1994-07-05",
    nationality: "Việt Nam",
    followers: 8500000,
    genre: "V-Pop",
  },
  {
    id: 2,
    name: "Jisoo",
    birthDate: "1995-01-03",
    nationality: "Hàn Quốc",
    followers: 32000000,
    genre: "K-Pop",
  },
  {
    id: 3,
    name: "Taylor Swift",
    birthDate: "1989-12-13",
    nationality: "Mỹ",
    followers: 95000000,
    genre: "Pop",
  },
];

let saveData = () => {
  localStorage.setItem("listSinger", JSON.stringify(singers));
};

let getData = () => {
  return JSON.parse(localStorage.getItem("listSinger")) || [];
};

let tbodyElement = document.getElementById("tbody");
let formElement = document.getElementById("form");
let nameElement = document.getElementById("name");
let birthdayElement = document.getElementById("birthday");
let nationalityElement = document.getElementById("nationality");
let followersElement = document.getElementById("followers");
let genreElement = document.getElementById("genre");
let titleElement = document.getElementById("title");
let buttonAddElement = document.getElementById("btn-add");
let buttonCancleElement = document.getElementById("btn-cancel");
let searchSingerElement = document.getElementById("search-singer");

let editId = null;

let dataLocal = getData();

if (dataLocal.length > 0) {
  singers = dataLocal;
} else {
  saveData();
}

let renderData = () => {
  tbodyElement.innerHTML = "";

  singers.forEach((singer, index) => {
    let tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${singer.name}</td>
            <td>${singer.birthDate}</td>
            <td>${singer.nationality}</td>
            <td>${singer.followers}</td>
            <td>${singer.genre}</td>
            <td>
                <button onclick="updateSinger(${singer.id})">Sửa</button>
                <button onclick="deleteSinger(${singer.id})">Xóa</button>
            </td>
        `;

    tbodyElement.appendChild(tr);
  });

  saveData();
};

renderData();

formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  if (editId) {
    let singer = singers.find((s) => s.id === editId);

    singer.name = nameElement.value;
    singer.birthDate = birthdayElement.value;
    singer.nationality = nationalityElement.value;
    singer.followers = followersElement.value;
    singer.genre = genreElement.value;

    editId = null;
    buttonAddElement.textContent = "Thêm ca sĩ";
    titleElement.textContent = "Thêm Ca Sĩ Mới";
    buttonCancleElement.style.display = "none";
  } else {
    let newSinger = {
      id: Date.now(),
      name: nameElement.value,
      birthDate: birthdayElement.value,
      nationality: nationalityElement.value,
      followers: followersElement.value,
      genre: genreElement.value,
    };

    singers.push(newSinger);
  }

  renderData();

  nameElement.value = "";
  birthdayElement.value = "";
  nationalityElement.value = "";
  followersElement.value = "";
  genreElement.value = "";
});

let updateSinger = (id) => {
  titleElement.textContent = "Chỉnh sửa ca sĩ";
  buttonAddElement.textContent = "Cập nhật";
  buttonCancleElement.style.display = "inline-block";

  let singer = singers.find((s) => s.id === id);

  nameElement.value = singer.name;
  birthdayElement.value = singer.birthDate;
  nationalityElement.value = singer.nationality;
  followersElement.value = singer.followers;
  genreElement.value = singer.genre;

  editId = id;
};

let deleteSinger = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa không?") == true) {
    singers = singers.filter((s) => s.id !== id);

    renderData();
  }
};

buttonCancleElement.addEventListener("click", () => {
  editId = null;

  nameElement.value = "";
  birthdayElement.value = "";
  nationalityElement.value = "";
  followersElement.value = "";
  genreElement.value = "";

  titleElement.textContent = "Thêm ca sĩ";
  buttonAddElement.textContent = "Thêm";
  buttonCancleElement.style.display = "none";
});

let searchSinger = () => {};
let filterUserById = (id) => {
  listUserFilter = singers.filter((user) => {
    return used.id === id;
  });
};
filterUserById(1);
