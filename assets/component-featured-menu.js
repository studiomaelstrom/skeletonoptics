/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
class FeaturedMenu extends HTMLElement {
  constructor() {
    super();

    this.defaultTextColor = this.getDefaultTextColor();

    this.menuItems = this.querySelectorAll('[data-menu-item]');
    this.imagesMap = new Map();

    // Store a reference to the corresponding image element for each menu item
    this.menuItems.forEach(menuItem => {
      const menuImage = menuItem.dataset.menuItemBlock;
      const img = this.querySelector(`li[data-menu-image-block="${menuImage}"]`);
      this.imagesMap.set(menuItem, img);
    });

    this.activeImage = null;
    this.customCursor = this.querySelector('[data-custom-cursor]');
  }

  getDefaultTextColor() {
    return window.getComputedStyle(this).getPropertyValue("color");
  }

  connectedCallback() {
    this.attachEvents();
  }

  attachEvents() {
    this.addEventListener('mousemove', this.handleCursorMove.bind(this));
    this.addEventListener('mouseleave', this.handleCursorLeave.bind(this));

    this.menuItems.forEach(menuItem => {
      menuItem.addEventListener('mouseenter', this.handleActivateBlock.bind(this, menuItem));
      menuItem.addEventListener('mouseleave', this.handleDeactivateBlock.bind(this, menuItem));
      menuItem.addEventListener('focus', this.handleActivateBlock.bind(this, menuItem));
      menuItem.addEventListener('blur', this.handleDeactivateBlock.bind(this, menuItem));
    });

    if (window.Shopify.designMode) {
      document.addEventListener('shopify:block:select', this.handleBlockSelect.bind(this));
      document.addEventListener('shopify:block:deselect', this.handleBlockDeselect.bind(this));
    }
  }

  handleCursorMove(e) {
    const { clientX, clientY } = e;
    const { top } = this.getBoundingClientRect();
    const { width, height } = this.customCursor.getBoundingClientRect();
    this.customCursor.style.left = `${clientX - width / 2}px`;
    this.customCursor.style.top = `${clientY - top - height / 2}px`;
  }

  handleCursorLeave() {
    const { width, height } = this.customCursor.getBoundingClientRect();
    this.customCursor.style.left = `-${width}px`;
    this.customCursor.style.top = `-${height * 2}px`;
  }

  handleActivateBlock(menuItem) {
    this.activeImage?.classList.remove('active');
    const img = this.imagesMap.get(menuItem);
    img?.classList.add('active');
    this.activeImage = img;
    const color = menuItem.dataset.menuItemColor;
    this.handleMenuItemColor(color);
    this.customCursor.classList.add('hovering');
  }

  handleDeactivateBlock(menuItem) {
    const img = this.imagesMap.get(menuItem);
    img?.classList.remove('active');
    this.activeImage = null;
    const color = this.getDefaultTextColor();
    this.handleMenuItemColor(color);
    this.customCursor.classList.remove('hovering');
  }

  handleMenuItemColor(color) {
    this.menuItems.forEach( item => item.style.color = color );
    this.customCursor.style.backgroundColor = color;
  }

  handleBlockSelect(e) {
    const blockId = e.detail.blockId;
    const menuItem = this.querySelector(`[data-menu-item-block="${blockId}"]`);
    this.handleActivateBlock(menuItem);
  }

  handleBlockDeselect(e) {
    const blockId = e.detail.blockId;
    const menuItem = this.querySelector(`[data-menu-item-block="${blockId}"]`);
    this.handleDeactivateBlock(menuItem);
  }

}

customElements.define('featured-menu', FeaturedMenu);

/******/ })()
;