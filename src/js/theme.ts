/**
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import selectorsMap from './constants/selectors-map';
import initEmitter from './prestashop';
import initResponsiveToggler from './responsive-toggler';
import initQuickview from './quickview';
import initCart from './pages/cart';
import initCheckout from './pages/checkout';
import initProductBehavior from './product';
import initMobileMenu from './mobile-menu';
import initSearchbar from './modules/ps_searchbar';
import initLanguageSelector from './modules/ps_languageselector';
import initCurrencySelector from './modules/ps_currencyselector';
import initVisiblePassword from './visible-password';
import useToast from './components/useToast';
import useAlert from './components/useAlert';
import useProgressRing from './components/useProgressRing';
import useQuantityInput from './components/useQuantityInput';
import './modules/blockcart';
import './modules/facetedsearch';
import initDesktopMenu from './modules/ps_mainmenu';
import initProductCustomization from './product-customization';

initEmitter();

window.prestashop.themeSelectors = selectorsMap;

$(() => {
  const {prestashop} = window;

  initProductBehavior();
  initQuickview();
  initCheckout();
  initResponsiveToggler();
  initCart();
  useQuantityInput();
  initSearchbar();
  initLanguageSelector();
  initCurrencySelector();
  initMobileMenu();
  initVisiblePassword();
  initDesktopMenu();
  initProductCustomization();

  prestashop.on('responsiveUpdate', () => {
    initSearchbar();
    initLanguageSelector();
    initCurrencySelector();
    initDesktopMenu();
  });

  prestashop.on('updatedCart', () => useQuantityInput());

  prestashop.on('handleError', (data: any) => {
    const {resp} = data;
    const errors = resp.errors as Array<string>;
    if (errors) {
      errors.forEach((error: string) => {
        useToast(error, {type:'danger', autohide: false}).show();
      });
    }
  });
});

export const components = {
  useToast,
  useAlert,
  useProgressRing,
  useQuantityInput,
};

export default {
  initResponsiveToggler,
  initQuickview,
  initProductBehavior,
};
