const ORDER_STORAGE_KEY = "ORDER_LIST";

let orderList = [];

const getEle = (id) => document.getElementById(id);

const el = {
  filterOrderStatus: getEle("filterOrderStatus"),
  searchOrderInput: getEle("searchOrderInput"),
  btnRefreshOrders: getEle("btnRefreshOrders"),
  orderTableBody: getEle("orderTableBody"),
  orderTotal: getEle("orderTotal"),
};

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("vi-VN") + "đ";
};

const getStatusClass = (status) => {
  switch (status) {
    case "Chờ xử lý":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Đã xác nhận":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Đang giao":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Hoàn thành":
      return "bg-green-50 text-green-700 border-green-200";
    case "Đã hủy":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
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

const saveOrdersToLocalStorage = () => {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderList));
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
    const quantity = Number(item.quantity || item.soLuong || 1);

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

const getPaymentMethod = (order) => {
  return order.paymentMethod || order.payment || order.phuongThucThanhToan || "Chưa có";
};

const getOrderDate = (order) => {
  return order.date || order.createdAt || order.ngayDat || "Chưa có";
};

const getFilteredOrders = () => {
  const keyword = el.searchOrderInput.value.trim().toLowerCase();
  const status = el.filterOrderStatus.value;

  let list = [...orderList];

  if (status !== "all") {
    list = list.filter((order) => {
      const orderStatus = order.status || "Chờ xử lý";
      return orderStatus === status;
    });
  }

  if (keyword) {
    list = list.filter((order) => {
      const searchText = `
        ${order.id || ""}
        ${getCustomerName(order)}
        ${getPhone(order)}
        ${getAddress(order)}
        ${order.status || ""}
      `.toLowerCase();

      return searchText.includes(keyword);
    });
  }

  return list;
};

const renderOrders = () => {
  const list = getFilteredOrders();

  el.orderTotal.textContent = list.length;

  if (!list.length) {
    el.orderTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="px-5 py-10 text-center font-semibold text-slate-500">
          Chưa có đơn hàng nào.
        </td>
      </tr>
    `;
    return;
  }

  el.orderTableBody.innerHTML = list
    .map((order) => {
      const items = getOrderItems(order);

      const itemText = items.length
        ? items
            .map((item) => {
              return `${item.name || item.tenSP || item.productName || "Sản phẩm"} x${
                item.quantity || item.soLuong || item.qty || 1
              }`;
            })
            .join("<br>")
        : `<span class="text-slate-400 italic">Chưa có dữ liệu sản phẩm</span>`;

      const orderStatus = order.status || "Chờ xử lý";

      return `
        <tr class="transition hover:bg-sky-50">
          <td class="px-5 py-4 font-bold text-slate-800">
            #${order.id || ""}
          </td>

          <td class="px-5 py-4 font-semibold text-slate-800">
            ${getCustomerName(order)}
          </td>

          <td class="px-5 py-4 text-slate-700">
            ${getPhone(order)}
          </td>

          <td class="px-5 py-4">
            <p class="max-w-[180px] truncate text-slate-700">
              ${getAddress(order)}
            </p>
          </td>

          <td class="px-5 py-4 text-sm text-slate-600">
            ${itemText}
          </td>

          <td class="px-5 py-4 font-bold text-red-600">
            ${formatPrice(getOrderTotal(order))}
          </td>

          <td class="px-5 py-4 text-sm text-slate-600">
            ${getPaymentMethod(order)}
          </td>

          <td class="px-5 py-4 text-sm text-slate-600">
            ${getOrderDate(order)}
          </td>

          <td class="px-5 py-4">
            <select
              data-id="${order.id}"
              class="order-status-select rounded-full border px-3 py-2 text-sm font-bold ${getStatusClass(
                orderStatus
              )}"
            >
              <option value="Chờ xử lý" ${
                orderStatus === "Chờ xử lý" ? "selected" : ""
              }>Chờ xử lý</option>

              <option value="Đã xác nhận" ${
                orderStatus === "Đã xác nhận" ? "selected" : ""
              }>Đã xác nhận</option>

              <option value="Đang giao" ${
                orderStatus === "Đang giao" ? "selected" : ""
              }>Đang giao</option>

              <option value="Hoàn thành" ${
                orderStatus === "Hoàn thành" ? "selected" : ""
              }>Hoàn thành</option>

              <option value="Đã hủy" ${
                orderStatus === "Đã hủy" ? "selected" : ""
              }>Đã hủy</option>
            </select>
          </td>
        </tr>
      `;
    })
    .join("");
};

const loadOrders = () => {
  orderList = getOrdersFromLocalStorage();

  orderList = orderList.map((order) => {
    return {
      ...order,
      status: order.status || "Chờ xử lý",
    };
  });

  saveOrdersToLocalStorage();
  renderOrders();
};

const updateOrderStatus = (orderId, newStatus) => {
  const order = orderList.find((item) => String(item.id) === String(orderId));

  if (!order) {
    alert("Không tìm thấy đơn hàng!");
    return;
  }

  order.status = newStatus;

  saveOrdersToLocalStorage();
  renderOrders();

  alert("Cập nhật trạng thái đơn hàng thành công!");
};

const bindEvents = () => {
  el.btnRefreshOrders.addEventListener("click", loadOrders);
  el.filterOrderStatus.addEventListener("change", renderOrders);
  el.searchOrderInput.addEventListener("input", renderOrders);

  el.orderTableBody.addEventListener("change", (event) => {
    const select = event.target.closest(".order-status-select");

    if (!select) return;

    const orderId = select.dataset.id;
    const newStatus = select.value;

    updateOrderStatus(orderId, newStatus);
  });
};

const init = () => {
  bindEvents();
  loadOrders();
};

init();