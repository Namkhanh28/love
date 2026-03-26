// cú pháp khai báo mảng
//Các kiểu dữ liệu trong JS : Number ,String ,Undifined ,Null,NaN,Object ,Boolean;
const studentName = ["Nguyễn Văn A", "Trần Văn B", "Lê Văn C"];
const numbers = [1, 2, 3, 4, 5, 6, 7];
//Thao tác duyệt mảng
//Truy cập phần tử trong mảng
//Chỉ số trong mảng ,bắt đầy từ vị trí 0
//Đọ dài của mảng : sử dụng phương thức    number.length
//Lấy ra phần tử của mảng : tên mảng(vị trí của mảng )
numbers[4];
//Lấy ra độ dài của mảng number[]
const numberLength = number.length;
console.log("Độ dài của mảng là " + numberLength);
console.log(`Phần tử ở vị trí ${number[4]}`);

//Các thao tác làm việc với mảng

const product = [
  { id: 1, name: "IPhone 12 ProMax", price: 120000000 },
  { id: 1, name: "IPhone 14 ProMax", price: 120000000 },
  { id: 1, name: "IPhone 15 ProMax", price: 120000000 },
];
//Các Thao tác duyệt mảng (Khi mảng có phần tử lớn )(Cần biết độ dài mảng ,điều kiện dừng , vị trí bắt đầu ,bước nhảy )

for (let i = 0; i < product.length; i++) {
  //lấy ra từng phần tử của mảng ;
  console.log(product.name);
}
numbers.splice(1, 0, 23);
console.log("number sau khi thêm vào một vị trí cụ thể: ", numbers);
