/**
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useToast from "./components/useToast";

const {prestashop} = window;
const productColumn = document.querySelector<HTMLElement>('.product__col');

if (productColumn) {
  const observer = new MutationObserver(() => {
    initProductCustomization();
  });
  observer.observe(productColumn, {childList: true});
}

const initProductCustomization = () => {
  const overlayContainer = document.querySelector<HTMLElement>('.js-product-customization .product-customization__overlay');
  const spinnerBorder = document.querySelector<HTMLElement>('.js-product-customization .product-customization__spinner');
  const customizationForm = document.querySelector<HTMLFormElement>('.js-product-customization form');

  customizationForm?.addEventListener('submit', async function (event) {
    customizationForm.classList.add('was-validated');
    event.preventDefault();
    event.stopPropagation();

    if (customizationForm.checkValidity()) {
      toggleSpinner();
      const formData = new FormData(customizationForm);
      formData.append('submitCustomizedData', '');
      const response = await fetch(customizationForm.action, {
        method: 'POST',
        body: formData,
      });

      try {
        if (response.ok) {
          const content = await response.text();
          const doc = new DOMParser().parseFromString(content, 'text/html');
          const newPcid = doc.querySelector<HTMLInputElement>('#product_customization_id');
          const pcid = document.querySelector<HTMLInputElement>('#product_customization_id');

          const newActionButton = doc.querySelector<HTMLElement>('.product-actions__button');
          const actionButton = document.querySelector<HTMLElement>('.product-actions__button');

          const newCustomizationForm = doc.querySelector<HTMLFormElement>('.js-product-customization form');

          useToast(response.statusText, {type: 'success'}).show();

          if (pcid && newPcid) {
            pcid.value = newPcid.value;
          }
          if (newActionButton && actionButton) {
            actionButton.innerHTML = newActionButton.innerHTML;
          }
          if (newCustomizationForm && customizationForm) {
            customizationForm.innerHTML = newCustomizationForm.innerHTML;
          }
        } else {
          throw response;
        }
        customizationForm.classList.remove('was-validated');
      } catch (error) {
        const errorData = error as Response;
        useToast(errorData.statusText, {type: 'danger'}).show();

        prestashop.emit('handleError', {
          eventType: 'saveProductCustomization',
          hasError: true,
          errors: [errorData.statusText]
        });
      }
      toggleSpinner();
    }
  }, false);
  
  const toggleSpinner = () => {
    overlayContainer?.classList.toggle('visually-hidden');
    spinnerBorder?.classList.toggle('visually-hidden');
  };
}

export default initProductCustomization;
