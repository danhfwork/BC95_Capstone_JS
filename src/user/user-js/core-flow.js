export const API_URL =
  "https://69ca67a0ba5984c44bf31946.mockapi.io/api/v1/phone";

export const el = {
  get danhSachSP() {
    return document.getElementById("danhSachSP");
  },

  get loading() {
    return document.getElementById("loading");
  },

  // Filter SP
  get keyword() {
    return document.getElementById("keyword");
  },

  get filterType() {
    return document.getElementById("filterType");
  },

  get searchSP() {
    return document.getElementById("searchSP");
  },

  // Popup chi tiết SP
  get popupChiTiet() {
    return document.getElementById("popupChiTiet");
  },

  get overlayChiTiet() {
    return document.getElementById("overlayChiTiet");
  },

  get popupContent() {
    return document.getElementById("popupContent");
  },

  get btnClosePopupChiTiet() {
    return document.getElementById("btnClosePopupChiTiet");
  },

  // Popup giỏ hàng
  get popupGioHang() {
    return document.getElementById("popupGioHang");
  },

  get overlayGioHang() {
    return document.getElementById("overlayGioHang");
  },

  get btnClosePopupGioHang() {
    return document.getElementById("btnClosePopupGioHang");
  },

  get gioHangProduct() {
    return document.getElementById("gioHangProduct");
  },

  // Giỏ hàng
  get btnGioHang() {
    return document.getElementById("btnGioHang");
  },

  get countGioHang() {
    return document.getElementById("countGioHang");
  },

  // Thanh toán
  get popupThanhToan() {
    return document.getElementById("popupThanhToan");
  },

  get datHangContent() {
    return document.getElementById("datHangContent");
  },

  get overlayThanhToan() {
    return document.getElementById("overlayThanhToan");
  },
};

export const state = {
  danhSachSP: [],
  timerId: null,
  gioHang: JSON.parse(localStorage.getItem("GIO_HANG")) || [],
  orderList: JSON.parse(localStorage.getItem("ORDER_LIST")) || [],
};
