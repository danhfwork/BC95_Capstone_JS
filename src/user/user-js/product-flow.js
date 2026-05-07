import { state, el, API_URL } from "./core-flow.js";
import { showChiTietSP } from "./popup-flow.js";
// Render Danh Sách Sản Phẩm

export const renderDanhSachSP = (danhSach) => {
  el.danhSachSP.innerHTML = "";

  if (!danhSach || danhSach.length === 0) {
    el.danhSachSP.innerHTML = `
         <p class="text-gray-500 text-center"> Không tìm thấy sản phẩm nào</p>
        `;
    return;
  }
  const content = danhSach.map((phone) => {
    return `
        <div
            class="w-65 h-fit bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all cursor-pointer p-5"
          >
            <img
              class="w-full h-fit"
              src="${phone.img}"
              alt="${phone.name}"
            />
            <div class="my-4 text-center space-y-2">
              <h3 class="text-lg font-semibold">${phone.name}</h3>
              <p class="text-red-500 font-bold text-xl">${phone.price.toLocaleString("vi-VN") + " VNĐ"}</p>
            </div>
            <div class="flex gap-2 justify-end items-center">
              <button
                onclick="showChiTietSP(${phone.id})"
                class="w-32 py-2 bg-blue-500 hover:bg-blue-600 rounded-3xl cursor-pointer text-white"
                type="button"
              >
                Xem chi tiết
              </button>
              <button
                onclick="themVaoGioHang(${phone.id})"
                class="w-32 py-2 bg-blue-500 hover:bg-blue-600 rounded-3xl cursor-pointer text-white"
                type="button"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        `;
  });
  el.danhSachSP.innerHTML = content.join("");
};

// Lấy danh sách sản phẩm
export const layDanhSachSP = async () => {
  el.loading.classList.remove("hidden");
  try {
    const response = await axios.get(API_URL);
    state.danhSachSP = response.data || [];
    renderDanhSachSP(state.danhSachSP);
  } catch (error) {
    el.danhSachSP.innerHTML = `
            <p class="text-red-500 text-center">Lỗi tải dữ liệu</p>
        `;
    console.log(error);
  } finally {
    el.loading.classList.add("hidden");
  }
};

// Sắp xếp sản phẩm

const sapXepSanPham = (kieu) => {
  let danhSachSapXep = [...state.danhSachSP];

  if (kieu === "asc") {
    danhSachSapXep.sort((a, b) => a.price - b.price);
  } else if (kieu === "desc") {
    danhSachSapXep.sort((a, b) => b.price - a.price);
  }

  renderDanhSachSP(danhSachSapXep);
};

window.sapXepSanPham = sapXepSanPham;
