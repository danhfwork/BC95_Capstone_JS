// =======================================================
// ADMIN PRODUCT MANAGEMENT - MOCKAPI
// Chức năng: Hiển thị, thêm, sửa, xóa, tìm kiếm, lọc loại
// =======================================================

const API_URL = "https://69ca67a0ba5984c44bf31946.mockapi.io/api/v1/phone";

let productList = [];
let currentDeleteId = null;

// =======================================================
// DOM
// =======================================================

const getEle = (id) => document.getElementById(id);

const el = {
    toastBox: getEle("toastBox"),

    btnOpenAdd: getEle("btnOpenAdd"),
    btnRefresh: getEle("btnRefresh"),

    filterType: getEle("filterType"),
    searchInput: getEle("searchInput"),

    productTableBody: getEle("productTableBody"),
    loadingBox: getEle("loadingBox"),
    emptyBox: getEle("emptyBox"),

    footerTotal: getEle("footerTotal"),
    footerRange: getEle("footerRange"),

    productModal: getEle("productModal"),
    productForm: getEle("productForm"),
    productId: getEle("productId"),

    modalMode: getEle("modalMode"),
    modalTitle: getEle("modalTitle"),

    btnCloseModal: getEle("btnCloseModal"),
    btnCancelForm: getEle("btnCancelForm"),
    btnSubmit: getEle("btnSubmit"),

    name: getEle("name"),
    price: getEle("price"),
    type: getEle("type"),
    img: getEle("img"),
    screen: getEle("screen"),
    backCamera: getEle("backCamera"),
    frontCamera: getEle("frontCamera"),
    desc: getEle("desc"),

    previewImg: getEle("previewImg"),
    previewType: getEle("previewType"),
    previewName: getEle("previewName"),
    previewPrice: getEle("previewPrice"),

    deleteModal: getEle("deleteModal"),
    deleteText: getEle("deleteText"),
    btnCancelDelete: getEle("btnCancelDelete"),
    btnConfirmDelete: getEle("btnConfirmDelete"),
};

// =======================================================
// HELPER
// =======================================================

const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + " VND";
};

const safeText = (value) => {
    return String(value || "").trim();
};

const getDefaultImage = () => {
    return "https://placehold.co/500x500/e2e8f0/475569?text=Product";
};

const showToast = (message, type = "success") => {
    if (!el.toastBox) {
        alert(message);
        return;
    }

    const color = {
        success: "bg-green-50 text-green-700 border-green-200",
        error: "bg-red-50 text-red-700 border-red-200",
        info: "bg-blue-50 text-blue-700 border-blue-200",
    };

    const toast = document.createElement("div");

    toast.className = `
        rounded-lg border px-4 py-3 text-sm font-bold shadow-lg
        ${color[type] || color.success}
    `;

    toast.innerHTML = message;

    el.toastBox.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};

const setLoading = (isLoading) => {
    if (!el.loadingBox) return;

    if (isLoading) {
        el.loadingBox.classList.remove("hidden");
    } else {
        el.loadingBox.classList.add("hidden");
    }
};

const hideEmptyBox = () => {
    if (el.emptyBox) {
        el.emptyBox.classList.add("hidden");
    }
};

const showEmptyBox = () => {
    if (el.emptyBox) {
        el.emptyBox.classList.remove("hidden");
    }
};

// =======================================================
// API
// =======================================================

const fetchProducts = async () => {
    try {
        setLoading(true);
        hideEmptyBox();

        const response = await axios.get(API_URL);

        productList = response.data || [];

        renderFilterType();
        renderProducts();
    } catch (error) {
        console.error("Lỗi load sản phẩm:", error);
        showToast("Không tải được sản phẩm từ MockAPI.", "error");
    } finally {
        setLoading(false);
    }
};

const addProduct = async (product) => {
    await axios.post(API_URL, product);
};

const updateProduct = async (id, product) => {
    await axios.put(`${API_URL}/${id}`, product);
};

const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

// =======================================================
// FILTER
// =======================================================

const renderFilterType = () => {
    const currentValue = el.filterType.value || "all";

    const types = productList
        .map((product) => product.type)
        .filter(Boolean);

    const uniqueTypes = [...new Set(types)];

    el.filterType.innerHTML = `
        <option value="all">Tất cả</option>
        ${uniqueTypes
            .map((type) => {
                return `<option value="${type}">${type}</option>`;
            })
            .join("")}
    `;

    if (uniqueTypes.includes(currentValue)) {
        el.filterType.value = currentValue;
    } else {
        el.filterType.value = "all";
    }
};

const getFilteredProducts = () => {
    const keyword = safeText(el.searchInput.value).toLowerCase();
    const type = el.filterType.value;

    let list = [...productList];

    if (keyword) {
        list = list.filter((product) => {
            const searchContent = `
                ${product.id || ""}
                ${product.name || ""}
                ${product.price || ""}
                ${product.type || ""}
                ${product.screen || ""}
                ${product.backCamera || ""}
                ${product.frontCamera || ""}
                ${product.desc || ""}
            `.toLowerCase();

            return searchContent.includes(keyword);
        });
    }

    if (type !== "all") {
        list = list.filter((product) => product.type === type);
    }

    return list;
};

// =======================================================
// RENDER TABLE
// =======================================================

const renderProducts = () => {
    const list = getFilteredProducts();

    if (el.footerTotal) {
        el.footerTotal.textContent = list.length;
    }

    if (el.footerRange) {
        el.footerRange.textContent = list.length > 0 ? `1 - ${list.length}` : "0 - 0";
    }

    if (!list.length) {
        el.productTableBody.innerHTML = "";
        showEmptyBox();
        return;
    }

    hideEmptyBox();

    const content = list
        .map((product) => {
            return `
                <tr class="transition hover:bg-sky-50">
                    <td class="px-5 py-4 font-semibold text-slate-700">
                        ${product.id || ""}
                    </td>

                    <td class="px-5 py-4">
                        <div class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                            <img
                                src="${product.img || getDefaultImage()}"
                                alt="${product.name || "Product"}"
                                class="h-full w-full object-contain p-1"
                                onerror="this.src='${getDefaultImage()}'"
                            />
                        </div>
                    </td>

                    <td class="px-5 py-4">
                        <p class="max-w-[220px] truncate font-bold text-slate-900">
                            ${product.name || ""}
                        </p>
                    </td>

                    <td class="px-5 py-4 font-semibold text-slate-800">
                        ${formatPrice(product.price)}
                    </td>

                    <td class="px-5 py-4">
                        <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                            ${product.type || ""}
                        </span>
                    </td>

                    <td class="px-5 py-4">
                        <p class="max-w-[140px] truncate text-slate-700">
                            ${product.screen || ""}
                        </p>
                    </td>

                    <td class="px-5 py-4">
                        <p class="max-w-[180px] truncate text-slate-700">
                            ${product.backCamera || ""}
                        </p>
                    </td>

                    <td class="px-5 py-4">
                        <p class="max-w-[150px] truncate text-slate-700">
                            ${product.frontCamera || ""}
                        </p>
                    </td>

                    <td class="px-5 py-4">
                        <p class="max-w-[220px] truncate text-slate-600">
                            ${product.desc || ""}
                        </p>
                    </td>

                    <td class="px-5 py-4 text-right">
                        <div class="flex justify-end gap-2">
                            <button
                                type="button"
                                data-action="edit"
                                data-id="${product.id}"
                                class="table-action-btn btn-edit"
                            >
                                Sửa
                            </button>

                            <button
                                type="button"
                                data-action="delete"
                                data-id="${product.id}"
                                class="table-action-btn btn-delete"
                            >
                                Xóa
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        })
        .join("");

    el.productTableBody.innerHTML = content;
};

// =======================================================
// FORM
// =======================================================

const getFormData = () => {
    return {
        name: safeText(el.name.value),
        price: Number(el.price.value),
        type: safeText(el.type.value),
        img: safeText(el.img.value),
        screen: safeText(el.screen.value),
        backCamera: safeText(el.backCamera.value),
        frontCamera: safeText(el.frontCamera.value),
        desc: safeText(el.desc.value),
    };
};

const resetForm = () => {
    el.productForm.reset();
    el.productId.value = "";

    el.modalMode.textContent = "Thêm mới";
    el.modalTitle.textContent = "Thêm sản phẩm";
    el.btnSubmit.textContent = "Lưu";

    updatePreview();
};

const validateForm = () => {
    const product = getFormData();

    if (!product.name) {
        showToast("Vui lòng nhập tên sản phẩm.", "error");
        return false;
    }

    if (!product.price || product.price <= 0) {
        showToast("Vui lòng nhập giá hợp lệ.", "error");
        return false;
    }

    if (!product.type) {
        showToast("Vui lòng chọn loại sản phẩm.", "error");
        return false;
    }

    if (!product.img) {
        showToast("Vui lòng nhập link hình ảnh.", "error");
        return false;
    }

    if (!product.screen) {
        showToast("Vui lòng nhập màn hình.", "error");
        return false;
    }

    if (!product.backCamera) {
        showToast("Vui lòng nhập camera sau.", "error");
        return false;
    }

    if (!product.frontCamera) {
        showToast("Vui lòng nhập camera trước.", "error");
        return false;
    }

    if (!product.desc) {
        showToast("Vui lòng nhập mô tả.", "error");
        return false;
    }

    return true;
};

const updatePreview = () => {
    const name = safeText(el.name.value) || "Tên sản phẩm";
    const price = Number(el.price.value) || 0;
    const type = safeText(el.type.value) || "Loại";
    const img = safeText(el.img.value) || getDefaultImage();

    el.previewName.textContent = name;
    el.previewPrice.textContent = formatPrice(price);
    el.previewType.textContent = type;
    el.previewImg.src = img;
};

// =======================================================
// MODAL
// =======================================================

const openModal = (mode = "add", product = null) => {
    resetForm();

    if (mode === "edit" && product) {
        el.modalMode.textContent = "Chỉnh sửa";
        el.modalTitle.textContent = "Cập nhật sản phẩm";
        el.btnSubmit.textContent = "Cập nhật";

        el.productId.value = product.id || "";
        el.name.value = product.name || "";
        el.price.value = product.price || "";
        el.type.value = product.type || "";
        el.img.value = product.img || "";
        el.screen.value = product.screen || "";
        el.backCamera.value = product.backCamera || "";
        el.frontCamera.value = product.frontCamera || "";
        el.desc.value = product.desc || "";

        updatePreview();
    }

    el.productModal.classList.remove("hidden");
    el.productModal.classList.add("flex");
};

const closeModal = () => {
    el.productModal.classList.add("hidden");
    el.productModal.classList.remove("flex");
};

// =======================================================
// SUBMIT ADD / UPDATE
// =======================================================

const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const product = getFormData();
    const id = el.productId.value;

    try {
        if (id) {
            await updateProduct(id, product);
            showToast("Cập nhật sản phẩm thành công.");
        } else {
            await addProduct(product);
            showToast("Thêm sản phẩm thành công.");
        }

        closeModal();
        await fetchProducts();
    } catch (error) {
        console.error("Lỗi lưu sản phẩm:", error);
        showToast("Không lưu được sản phẩm.", "error");
    }
};

// =======================================================
// DELETE
// =======================================================

const openDeleteModal = (id) => {
    const product = productList.find((item) => String(item.id) === String(id));

    currentDeleteId = id;

    el.deleteText.textContent = `Bạn có chắc muốn xóa "${product?.name || "sản phẩm này"}" không?`;

    el.deleteModal.classList.remove("hidden");
    el.deleteModal.classList.add("flex");
};

const closeDeleteModal = () => {
    currentDeleteId = null;

    el.deleteModal.classList.add("hidden");
    el.deleteModal.classList.remove("flex");
};

const handleConfirmDelete = async () => {
    if (!currentDeleteId) return;

    try {
        await deleteProduct(currentDeleteId);

        showToast("Xóa sản phẩm thành công.");

        closeDeleteModal();
        await fetchProducts();
    } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        showToast("Không xóa được sản phẩm.", "error");
    }
};

// =======================================================
// EVENT
// =======================================================

const addEventListeners = () => {
    el.btnOpenAdd.addEventListener("click", () => {
        openModal("add");
    });

    el.btnRefresh.addEventListener("click", async () => {
        await fetchProducts();
        showToast("Đã làm mới danh sách sản phẩm.", "info");
    });

    el.productForm.addEventListener("submit", handleSubmit);

    el.btnCloseModal.addEventListener("click", closeModal);
    el.btnCancelForm.addEventListener("click", closeModal);

    el.searchInput.addEventListener("input", renderProducts);
    el.filterType.addEventListener("change", renderProducts);

    el.productTableBody.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === "edit") {
            const product = productList.find((item) => String(item.id) === String(id));

            if (!product) {
                showToast("Không tìm thấy sản phẩm cần sửa.", "error");
                return;
            }

            openModal("edit", product);
        }

        if (action === "delete") {
            openDeleteModal(id);
        }
    });

    el.btnCancelDelete.addEventListener("click", closeDeleteModal);
    el.btnConfirmDelete.addEventListener("click", handleConfirmDelete);

    el.productModal.addEventListener("click", (event) => {
        if (event.target === el.productModal) {
            closeModal();
        }
    });

    el.deleteModal.addEventListener("click", (event) => {
        if (event.target === el.deleteModal) {
            closeDeleteModal();
        }
    });

    [el.name, el.price, el.type, el.img].forEach((input) => {
        input.addEventListener("input", updatePreview);
        input.addEventListener("change", updatePreview);
    });
};

// =======================================================
// INIT
// =======================================================

const init = async () => {
    addEventListeners();
    await fetchProducts();
};

init();