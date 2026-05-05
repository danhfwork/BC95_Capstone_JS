const ORDER_STORAGE_KEY = "ORDER_LIST";

const btnOrderLookup = document.getElementById("btnOrderLookup");
const orderLookupModal = document.getElementById("orderLookupModal");
const overlayOrderLookup = document.getElementById("overlayOrderLookup");
const btnCloseOrderLookup = document.getElementById("btnCloseOrderLookup");
const orderLookupPhone = document.getElementById("orderLookupPhone");
const btnSearchOrderLookup = document.getElementById("btnSearchOrderLookup");
const orderLookupResult = document.getElementById("orderLookupResult");

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("vi-VN") + "đ";
};

const getOrdersFromLocalStorage = () => {
  const data = localStorage.getItem(ORDER_STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("ORDER_LIST không phải JSON hợp lệ:", error);
    return [];
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Chờ xử lý":
      return "bg-yellow-100 text-yellow-700";
    case "Đã xác nhận":
      return "bg-blue-100 text-blue-700";
    case "Đang giao":
      return "bg-purple-100 text-purple-700";
    case "Hoàn thành":
      return "bg-green-100 text-green-700";
    case "Đã hủy":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getOrderItems = (order) => {
  return (
    order.items ||
    order.products ||
    order.cart ||
    order.gioHang ||
    order.orderItems ||
    []
  );
};

const getOrderTotal = (order) => {
  if (order.total || order.totalPrice || order.tongTien) {
    return order.total || order.totalPrice || order.tongTien;
  }

  const items = getOrderItems(order);

  return items.reduce((sum, item) => {
    const price = Number(item.price || item.gia || 0);
    const quantity = Number(item.quantity || item.soLuong || item.qty || 1);

    return sum + price * quantity;
  }, 0);
};

const getCustomerName = (order) => {
  return order.customer || order.customerName || order.name || order.hoTen || "";
};

const getPhone = (order) => {
  return order.phone || order.phoneNumber || order.sdt || "";
};

const getAddress = (order) => {
  return order.address || order.diaChi || "";
};

const getOrderDate = (order) => {
  return order.date || order.createdAt || order.ngayDat || "Chưa có";
};

const getPaymentMethod = (order) => {
  return order.paymentMethod || order.payment || order.phuongThucThanhToan || "Chưa có";
};

const getProductName = (item) => {
  return item.name || item.tenSP || item.productName || "Sản phẩm";
};

const getProductImage = (item) => {
  return (
    item.img ||
    item.image ||
    item.hinhAnh ||
    "https://placehold.co/120x120/e5e7eb/64748b?text=SP"
  );
};

const getProductQuantity = (item) => {
  return item.quantity || item.soLuong || item.qty || 1;
};

const getProductPrice = (item) => {
  return item.price || item.gia || 0;
};

const openOrderLookup = () => {
  if (!orderLookupModal) return;

  orderLookupModal.classList.remove("hidden");
  orderLookupModal.classList.add("flex");

  if (orderLookupPhone) {
    orderLookupPhone.focus();
  }
};

const closeOrderLookup = () => {
  if (!orderLookupModal) return;

  orderLookupModal.classList.add("hidden");
  orderLookupModal.classList.remove("flex");

  if (orderLookupResult) {
    orderLookupResult.innerHTML = "";
  }

  if (orderLookupPhone) {
    orderLookupPhone.value = "";
  }
};

const renderOrders = (orders) => {
  if (!orderLookupResult) return;

  if (!orders.length) {
    orderLookupResult.innerHTML = `
      <div class="lookup-card text-center">
        <p class="font-semibold text-gray-500">
          Không tìm thấy đơn hàng nào với số điện thoại này.
        </p>
      </div>
    `;
    return;
  }

  orderLookupResult.innerHTML = orders
    .map((order) => {
      const items = getOrderItems(order);
      const orderStatus = order.status || "Chờ xử lý";

      const itemHtml = items.length
        ? items
            .map((item) => {
              return `
                <div class="lookup-item">
                  <div class="lookup-item-info">
                    <img
                      src="${getProductImage(item)}"
                      alt="${getProductName(item)}"
                    />

                    <div>
                      <p class="font-semibold text-gray-800">
                        ${getProductName(item)}
                      </p>

                      <p class="text-sm text-gray-500">
                        Số lượng: ${getProductQuantity(item)}
                      </p>
                    </div>
                  </div>

                  <p class="font-bold text-gray-800">
                    ${formatPrice(getProductPrice(item))}
                  </p>
                </div>
              `;
            })
            .join("")
        : `
          <p class="text-sm italic text-gray-400">
            Chưa có dữ liệu sản phẩm
          </p>
        `;

      return `
        <div class="lookup-card">
          <div class="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-800">
                Đơn hàng #${order.id || ""}
              </h3>

              <p class="text-sm text-gray-500">
                Ngày đặt: ${getOrderDate(order)}
              </p>
            </div>

            <span class="inline-flex w-fit rounded-full px-3 py-1 text-sm font-bold ${getStatusClass(orderStatus)}">
              ${orderStatus}
            </span>
          </div>

          <div class="mt-4 space-y-1 text-sm text-gray-600">
            <p><b>Khách hàng:</b> ${getCustomerName(order)}</p>
            <p><b>Số điện thoại:</b> ${getPhone(order)}</p>
            <p><b>Địa chỉ:</b> ${getAddress(order)}</p>
            <p><b>Thanh toán:</b> ${getPaymentMethod(order)}</p>
          </div>

          <div class="mt-4">
            <h4 class="mb-2 font-bold text-gray-800">
              Sản phẩm đã đặt
            </h4>

            ${itemHtml}
          </div>

          <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <span class="font-bold text-gray-800">Tổng tiền</span>

            <span class="text-lg font-bold text-red-600">
              ${formatPrice(getOrderTotal(order))}
            </span>
          </div>
        </div>
      `;
    })
    .join("");
};

const searchOrderByPhone = () => {
  const phone = orderLookupPhone.value.trim();

  if (!phone) {
    alert("Vui lòng nhập số điện thoại để tra cứu!");
    return;
  }

  const orders = getOrdersFromLocalStorage();

  const result = orders.filter((order) => {
    return String(getPhone(order)).trim() === phone;
  });

  renderOrders(result);
};

if (btnOrderLookup) {
  btnOrderLookup.addEventListener("click", openOrderLookup);
}

if (btnCloseOrderLookup) {
  btnCloseOrderLookup.addEventListener("click", closeOrderLookup);
}

if (overlayOrderLookup) {
  overlayOrderLookup.addEventListener("click", closeOrderLookup);
}

if (btnSearchOrderLookup) {
  btnSearchOrderLookup.addEventListener("click", searchOrderByPhone);
}

if (orderLookupPhone) {
  orderLookupPhone.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchOrderByPhone();
    }
  });
}