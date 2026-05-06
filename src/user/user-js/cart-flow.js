import { el, state } from "./core-flow.js";
import {
  closePopupGioHang,
  capNhatSoLuongGioHang,
  closePopupThanhToan,
} from "./popup-flow.js";

import { showMessage } from "./popup-flow.js";

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
const tinhTongTien = (gioHang) => {
  if (!gioHang || gioHang.length === 0) return 0;

  return gioHang.reduce((tong, item) => {
    return tong + item.price * item.soLuong;
  }, 0);
};
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
  const tongTien = tinhTongTien(state.gioHang);
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
const valid = () => {
  const hoTen = document.getElementById("hoTen").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const address = document.getElementById("address").value.trim();
  const paymentMethodEl = document.querySelector('input[name="payment"]:checked');
  const paymentMethod = paymentMethodEl ? paymentMethodEl.value : "";
  const errors = {};

  const errorElements = document.querySelectorAll('[id^="error-"]');
  errorElements.forEach((el) => (el.innerHTML = ""));

  if (!hoTen) {
    errors.hoTen = "Họ tên khách hàng không được để trống!";
  }
  if (!phoneNumber) {
    errors.phoneNumber = "Số điện thoại khách hàng không được để trống!";
  }
  if (!address) {
    errors.address = "Địa chỉ nhận hàng không được để trống!";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { hoTen, phoneNumber, address, paymentMethod },
  };
};
const datHang = () => {
  if (state.gioHang.length === 0) {
    alert("Giỏ hàng của bạn đang trống, không thể đặt hàng!");
    return;
  }
  const check = valid();

  if (!check.isValid) {
    Object.keys(check.errors).forEach((key) => {
      const errorEl = document.getElementById(`error-${key}`);
      if (errorEl) {
        errorEl.innerHTML = check.errors[key];
      }
    });
    return;
  }
  const { hoTen, phoneNumber, address, paymentMethod } = check.data;
  showMessage(
    `Bạn có chắc chắn muốn thanh toán đơn hàng này?`,
    "warning",
    () => {
      const newOrder = {
        id: Date.now(),
        customer: hoTen,
        phone: phoneNumber,
        address: address,
        payment: paymentMethod,
        items: [...state.gioHang],
        total: tinhTongTien(state.gioHang),
        date: new Date().toLocaleString("vi-VN"),
        status: "Chờ xử lý",
      };
      state.orderList.push(newOrder);
      localStorage.setItem("ORDER_LIST", JSON.stringify(state.orderList));
      state.gioHang = [];
      localStorage.removeItem("GIO_HANG");
      capNhatSoLuongGioHang();
      renderGioHang();
      closePopupGioHang();
      closePopupThanhToan();
      showMessage("Đặt hàng thành công! Cảm ơn bạn đã mua hàng!");
    },
  );
};
window.datHang = datHang;

const thanhToan = () => {
  if (state.gioHang.length === 0) {
    alert("Giỏ hàng của bạn đang trống, không thể thanh toán!");
    return;
  }
  const listSPThanhToan = state.gioHang
    .map((item) => {
      return `
        <div class="flex gap-3 py-3 border-b border-gray-100 last:border-0">
            <div class="w-12 h-12 bg-white rounded shrink-0 flex items-center justify-center">
                <img src="${item.img}" class="object-contain" alt="${item.name}">
            </div>
            <div class="flex-1 text-sm">
                <p class="font-medium text-gray-800 line-clamp-2">${item.name}</p>
                <p class="text-gray-500 italic">x${item.soLuong}</p>
            </div>
            <p class="text-sm font-bold text-gray-900">${item.price.toLocaleString("vi-VN")}đ</p>
        </div>
    `;
    })
    .join("");
  const tongTien = tinhTongTien(state.gioHang);

  el.datHangContent.innerHTML = `
    <div class="border border-gray-200 rounded-lg bg-gray-50 flex flex-col overflow-hidden max-h-125">
        <div class="p-4 pb-2">
            <h3 class="font-semibold text-lg text-gray-800">Đơn hàng của bạn</h3>
        </div>
        <div class="flex-1 overflow-y-auto px-4 custom-scrollbar">
            ${listSPThanhToan}
        </div>
        <div class="p-4 bg-white border-t border-gray-200">
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600">Tạm tính:</span>
                    <span class="font-medium text-gray-900">${tongTien.toLocaleString("vi-VN")}đ</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Phí vận chuyển:</span>
                    <span class="text-green-600 font-medium">Miễn phí</span>
                </div>
            </div>

            <hr class="my-3 border-dashed">

            <div class="flex justify-between items-center mb-4">
                <span class="font-bold uppercase text-black text-xs">Tổng cộng:</span>
                <span class="text-xl font-bold text-red-600">${tongTien.toLocaleString("vi-VN")}đ</span>
            </div>

            <button onclick="datHang()" type="button" 
                class="w-full bg-green-500 hover:bg-green-600 cursor-pointer text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 shadow-md transition duration-200">
                ĐẶT HÀNG <i class="fa-solid fa-check"></i>
            </button>
        </div>
    </div>
`;
  el.popupThanhToan.classList.remove("hidden");
};

window.thanhToan = thanhToan;
