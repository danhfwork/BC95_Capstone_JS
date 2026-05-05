import { bindFilterEvent } from "./user-js/filter-flow.js";
import { layDanhSachSP } from "./user-js/product-flow.js";
import { bindClosePopup } from "./user-js/popup-flow.js";
import { el, state } from "./user-js/core-flow.js";
import { renderGioHang } from "./user-js/cart-flow.js";
import { getLocalStorage } from "./user-js/cart-flow.js";

getLocalStorage();
bindClosePopup()
bindFilterEvent()

el.btnGioHang.addEventListener('click', renderGioHang)
layDanhSachSP()



