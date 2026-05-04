import { el, state } from "./core-flow.js";
import { closePopupGioHang, capNhatSoLuongGioHang } from "./popup-flow.js";

const tangSL = (phoneId) => {
  const item = state.gioHang.find((phone) => phone.id == phoneId);

  if (!item) {
    alert("Không tìm thấy sản phẩm trong giỏ hàng");
    return;
  }
  item.soLuong += 1;
  saveLocalStorage();
  capNhatSoLuongGioHang();
  renderGioHang();
};
window.tangSL = tangSL;

const giamSL = (phoneId) => {
  const item = state.gioHang.find((phone) => phone.id == phoneId);

  if (!item) {
    alert("Không tìm thấy sản phẩm trong giỏ hàng");
    return;
  }
  if (item.soLuong === 1) {
    return;
  }
  item.soLuong -= 1;

  saveLocalStorage();
  capNhatSoLuongGioHang();
  renderGioHang();
};
window.giamSL = giamSL;

const xoaSanPham = (phoneId) => {
  state.gioHang = state.gioHang.filter((phone) => phone.id != phoneId);

  saveLocalStorage();
  capNhatSoLuongGioHang();
  renderGioHang();
};
window.xoaSanPham = xoaSanPham;

export const renderGioHang = () => {
  if (state.gioHang.length === 0) {
    el.popupGioHang.classList.remove("hidden");
    el.gioHangProduct.innerHTML = `
            <h2>Giỏ hàng</h2>
            <p class="text-gray-500 text-center">Giỏ hàng của bạn đang trống</p>
        `;
    return;
  }

  const listSPTrongCart = state.gioHang.map((item) => {
    const isMin = item.soLuong === 1;
    const attrDisabled = isMin ? "disabled" : "";
    const classDisabled = isMin
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";
    return `
            <div class="flex items-start gap-4">
                <div class="w-24 h-24 shrink-0">
                    <img
                    src="${item.img}"
                    alt="${item.name}"
                    class="w-full h-full object-contain"
                    />
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <h3
                        class="text-[15px] font-medium text-gray-800 pr-4 leading-tight"
                        >
                        ${item.name}
                        </h3>
                        <div class="text-right">
                        <p class="text-red-600 font-bold">${item.price.toLocaleString("vi-VN") + "đ"}</p>
                        <p class="text-gray-400 text-sm line-through">${(item.price * 1.1).toLocaleString("vi-VN") + "đ"}</p>
                        </div>
                    </div>
                    <div class="flex justify-end items-center gap-4 mt-8">
                        <button
                        onclick="xoaSanPham('${item.id}')"
                        type="button"
                        class="text-gray-500 text-sm hover:text-red-500 transition-colors cursor-pointer"
                        >
                        Xóa
                        </button>

                        <div
                        class="flex items-center border border-gray-200 rounded-lg overflow-hidden"
                        >
                        <button
                            type="button"
                            ${attrDisabled}
                            class="px-3 py-1 bg-white hover:bg-gray-100 text-gray-600 border-r border-gray-200 ${classDisabled}"
                            onclick="giamSL('${item.id}')"
                        >
                            -
                        </button>
                        <span class="px-4 py-1 text-sm font-medium">${item.soLuong}</span>
                        <button
                            onclick="tangSL('${item.id}')"
                            type="button"
                            class="px-3 py-1 bg-white hover:bg-gray-100 text-gray-600 border-l border-gray-200 cursor-pointer"
                        >
                            +
                        </button>
                        </div>
                    </div>
                </div>
          </div>
        `;
  });

  el.gioHangProduct.innerHTML = listSPTrongCart.join("");
  const tongTien = state.gioHang.reduce(
    (tong, item) => tong + item.price * item.soLuong,
    0,
  );
  el.gioHangProduct.innerHTML += `
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-dashed border-gray-200">
            <span class="text-gray-700">Tổng tiền:</span>
            <span class="text-lg font-bold text-gray-800">${tongTien.toLocaleString("vi-VN") + "đ"}</span>
        </div>
        <div class="flex justify-end  items-center">
          <button onclick="thanhToan()" type="button" class="w-32 py-2 bg-blue-500 hover:bg-blue-600 rounded cursor-pointer text-white">Thanh toán</button>
        </div>
  `;
  el.popupGioHang.classList.remove("hidden");
};

export const saveLocalStorage = () => {
  const dataString = JSON.stringify(state.gioHang);
  localStorage.setItem("GIO_HANG", dataString);
};

export const getLocalStorage = () => {
  const dataString = localStorage.getItem("GIO_HANG");
  if (dataString) {
    state.gioHang = JSON.parse(dataString);
    capNhatSoLuongGioHang();
  }
};

const thanhToan = () => {
  if (state.gioHang.length === 0) {
    alert("Giỏ hàng của bạn đang trống, không thể thanh toán!");
    return;
  }
  const confirmPay = confirm("Bạn có chắc chắn muốn thanh toán đơn hàng này?");
  if (confirmPay) {
    state.gioHang = [];
    localStorage.removeItem("GIO_HANG");
    capNhatSoLuongGioHang();
    renderGioHang();
    closePopupGioHang();
    alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
  }
};
window.thanhToan = thanhToan;
