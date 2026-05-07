export const API_URL =
  "https://69ca67a0ba5984c44bf31946.mockapi.io/api/v1/phone";

export const el = {
  danhSachSP: document.getElementById("danhSachSP"),
  loading: document.getElementById("loading"),
  // Filter SP
  keyword: document.getElementById("keyword"),
  filterType: document.getElementById("filterType"),
  searchSP: document.getElementById("searchSP"),
  // Popup chi tiết SP
  popupChiTiet: document.getElementById("popupChiTiet"),
  overlayChiTiet: document.getElementById("overlayChiTiet"),
  popupContent: document.getElementById("popupContent"),
  btnClosePopupChiTiet: document.getElementById("btnClosePopupChiTiet"),
  // Popup giỏ hàng
  popupGioHang: document.getElementById("popupGioHang"),
  overlayGioHang: document.getElementById("overlayGioHang"),
  btnClosePopupGioHang: document.getElementById("btnClosePopupGioHang"),
  gioHangProduct: document.getElementById("gioHangProduct"),
  // Giỏ hàng
  btnGioHang: document.getElementById("btnGioHang"),
  countGioHang: document.getElementById("countGioHang"),
  // Thanh toán
  popupThanhToan: document.getElementById("popupThanhToan"),
  datHangContent: document.getElementById("datHangContent"),
  overlayThanhToan: document.getElementById("overlayThanhToan"),
};

export const state = {
  danhSachSP: [],
  timerId: null,
  gioHang: JSON.parse(localStorage.getItem("GIO_HANG")) || [],
  orderList: JSON.parse(localStorage.getItem("ORDER_LIST")) || [],
};
