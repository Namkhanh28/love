let hello = document.getElementsByClassName("hello")[0];
let nameofInput = document.getElementsByClassName("userName")[0];
let submitValue = document.getElementsByClassName("submit")[0];
submitValue.addEventListener("click", () => {
  let valueInput = nameofInput.value;
  localStorage.setItem("name", valueInput);
  hello.innerHTML = `Xin chào ${valueInput}`;
});
