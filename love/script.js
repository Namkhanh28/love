function createCard() {
  let name = document.getElementById("name").value;
  let birth = document.getElementById("birth").value;
  let frame = document.getElementById("frame").value;

  document.getElementById("cardName").innerText = "👩 " + name;
  document.getElementById("cardBirth").innerText = "🎂 " + birth;

  let card = document.getElementById("card");
  card.className = "card " + frame;

  let file = document.getElementById("imageInput").files[0];

  if (file) {
    let reader = new FileReader();

    reader.onload = function (e) {
      document.getElementById("preview").src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  createHearts();
}

/* trái tim bay */

function createHearts() {
  for (let i = 0; i < 10; i++) {
    let heart = document.createElement("div");
    heart.className = "heart";
    heart.innerText = "💖";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.top = "60vh";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
  }
}

/* hoa rơi */

function createFlowers() {
  setInterval(() => {
    let flower = document.createElement("div");
    flower.className = "flower";
    flower.innerText = "🌸";

    flower.style.left = Math.random() * 100 + "vw";
    flower.style.animationDuration = Math.random() * 5 + 5 + "s";

    document.body.appendChild(flower);

    setTimeout(() => flower.remove(), 10000);
  }, 500);
}

createFlowers();

/* tải ảnh thiệp */

function downloadCard() {
  html2canvas(document.getElementById("card")).then((canvas) => {
    let link = document.createElement("a");
    link.download = "thiep-8-3.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

/* chia sẻ */

function shareCard() {
  navigator.clipboard.writeText(window.location.href);

  alert("Đã copy link chia sẻ!");
}
