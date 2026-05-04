import { el, state } from "./core-flow.js";
import { renderDanhSachSP } from "./product-flow.js";
export const filterSP = (phone) => {
  const keyword = el.keyword.value.toLowerCase().trim();
  const filterType = el.filterType.value.toLowerCase().trim();

  let ketQuaLoc = [...state.danhSachSP];
  if (filterType !== "") {
    ketQuaLoc = ketQuaLoc.filter(
      (phone) => phone.type.toLowerCase() === filterType.toLowerCase(),
    );
  }
  if (keyword) {
    ketQuaLoc = ketQuaLoc.filter((phone) => {
      const phoneName = phone.name.toLowerCase();
      const phoneDesc = phone.desc.toLowerCase();
      return phoneName.includes(keyword) || phoneDesc.includes(keyword);
    });
  }
  renderDanhSachSP(ketQuaLoc);
};

const debounce = () => {
  clearTimeout(state.timerId);
  state.timerId = setTimeout(() => {
    filterSP();
  }, 1000);
};

export const bindFilterEvent = () => {
  el.keyword.addEventListener("input", debounce);
  el.filterType.addEventListener("change", filterSP);
};
