// Popup chi tiết SP
import { el, state } from "./core-flow.js";
import { saveLocalStorage } from "./cart-flow.js";
export const showChiTietSP = (phoneId) => {
  const phone = state.danhSachSP.find((sp) => sp.id == phoneId);
  if (!phone) {
    el.danhSachSP.innerHTML = `
                 <p> class="text-gray-500 text-center">Không tìm thấy sản phẩm nào</p>
                `;
    return;
  }
  el.popupContent.innerHTML = `
            <img
                class="w-full h-auto"
                src="${phone.img}"
                alt="${phone.name}"
                />
          <div class="my-4 text-center space-y-2">
            <h3 class="text-lg font-semibold">Tên sản phẩm: ${phone.name}</h3>
            <p class="text-red-500 font-bold text-xl italic">Giá thành: ${phone.price.toLocaleString("vi-VN") + " VNĐ"}</p>
          </div>
          <div class="max-w-2xl mx-auto border-t border-gray-100">
            <div
              class="flex items-start px-4 py-3 border-b border-gray-100 bg-gray-50"
            >
              <div class="w-1/3 text-blue-600 text-sm font-medium">
                Màn hình:
              </div>
              <div class="w-2/3 text-gray-800 text-sm">${phone.screen}</div>
            </div>

            <div
              class="flex items-start px-4 py-3 border-b border-gray-100 bg-gray-50"
            >
              <div class="w-1/3 text-gray-900 text-sm font-bold">
                Camera trước:
              </div>
              <div class="w-2/3 text-gray-800 text-sm">${phone.frontCamera}</div>
            </div>

            <div
              class="flex items-start px-4 py-3 border-b border-gray-100 bg-gray-50"
            >
              <div class="w-1/3 text-blue-600 text-sm font-medium">
                Loại:
              </div>
              <div class="w-2/3 text-gray-800 text-sm">
                ${phone.type}
              </div>
            </div>

            <div class="flex items-start px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div class="w-1/3 text-gray-900 text-sm font-bold">
                Camera sau:
              </div>
              <div class="w-2/3 text-gray-800 text-sm">${phone.backCamera}</div>
            </div>
            <div class="flex items-start px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div class="w-1/3 text-gray-900 text-sm font-bold">
                Mô tả sản phẩm:
              </div>
              <div class="w-2/3 text-gray-800 text-sm">${phone.desc}</div>
            </div>
          </div>
  `;
  el.popupChiTiet.classList.remove("hidden");
};

window.showChiTietSP = showChiTietSP;

export const capNhatSoLuongGioHang = () => {
  const tongSL = state.gioHang.reduce((tong, item) => tong + item.soLuong, 0);
  el.countGioHang.textContent = tongSL;
};
export const themVaoGioHang = (phoneId) => {
  const phone = state.danhSachSP.find((phone) => phone.id == phoneId);
  if (!phone) {
    alert("Không tìm thấy sản phẩm");
    return;
  }

  const phoneTrongGioHang = state.gioHang.find((item) => item.id == phoneId);
  if (!phoneTrongGioHang) {
    state.gioHang.push({ ...phone, soLuong: 1 });
  } else {
    phoneTrongGioHang.soLuong += 1;
  }
  saveLocalStorage();
  capNhatSoLuongGioHang();
};
window.themVaoGioHang = themVaoGioHang;
const closePopupChiTiet = () => {
  el.popupChiTiet.classList.add("hidden");
};
export const closePopupGioHang = () => {
  el.popupGioHang.classList.add("hidden");
};
export const closePopupThanhToan = () => {
  el.popupThanhToan.classList.add("hidden");
};
export const bindClosePopup = () => {
  el.btnClosePopupChiTiet.addEventListener("click", closePopupChiTiet);
  el.overlayChiTiet.addEventListener("click", closePopupChiTiet);
  el.overlayGioHang.addEventListener("click", closePopupGioHang);
  el.btnClosePopupGioHang.addEventListener("click", closePopupGioHang);
  el.overlayThanhToan.addEventListener("click", closePopupThanhToan);
};

// Show Message
export const showMessage = (title, icon = "success", callback = null) => {
  if (callback) {
    Swal.fire({
      title: title,
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: icon,
      title: title,
    });
  }
};
