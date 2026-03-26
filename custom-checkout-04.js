
let url = "https://estrogenic-vertie-bifidly.ngrok-free.dev";

let shop = Shopify.shop;
let isInternational = false;

async function isInternationalOrder() {
    try {
        const shopResponse = await fetch(
            `${url}GiftShip/ShopOrigin?ShopName=${shop}`,
            {
                method: 'POST',
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Accept': 'application/json'
                }
            }
        );

        const shopData = await shopResponse.json();
        const shopOrigin = shopData.shop?.billingAddress?.countryCode || 'US';

        const locationResponse = await fetch(
            window.Shopify.routes.root + 'browsing_context_suggestions.json?country[enabled]=true'
        );

        const locationData = await locationResponse.json();
        const customerCountry = locationData.detected_values?.country?.handle;

        return customerCountry !== shopOrigin;

    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

function domReady() {
    return new Promise(resolve => {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            resolve();
        } else {
            document.addEventListener("DOMContentLoaded", resolve);
        }
    });
}

(async () => {

    if (!(url && shop)) return;

    await domReady();
    isInternational = await isInternationalOrder();

    var checkboxContainer = document.createElement("div");
    checkboxContainer.id = "customcheckoutContainer001";
    checkboxContainer.style.width = "45%";
    checkboxContainer.style.display = "flex";
    checkboxContainer.style.alignItems = "center";
    checkboxContainer.style.flexWrap = "wrap";
    checkboxContainer.style.flexDirection = "row";
    checkboxContainer.style.alignContent = "flex-end";
    checkboxContainer.style.justifyContent = "flex-end";
    checkboxContainer.style.marginBottom = "8px";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "customcheckoutBtn";
    checkbox.style.marginRight = "10px";
    checkbox.style.width = "15px";
    checkbox.style.height = "15px";

    var checkboxLabel = document.createElement("label");
    checkboxLabel.htmlFor = "customcheckoutBtn";
    checkboxLabel.innerText = "International Custom Checkout";
    checkboxLabel.style.fontWeight = "bold";

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkboxLabel);

    function hideProductOptions() {
        var keywords = ['SequenceID:', 'parent_Order:', 'Address:', 'AdditionalDetail:'];
        var productOptions = document.querySelectorAll('.product-option');

        if (productOptions.length == 0) {
            productOptions = document.querySelectorAll('.product-details__item');
        }

        productOptions.forEach(function (option) {
            var dtElement = option.querySelector('dt') ||
                option.querySelector('.product-details__item-label');

            if (dtElement) {
                var dtText = dtElement.textContent.trim();
                if (keywords.includes(dtText)) {
                    option.style.display = 'none';
                }
            }
        });
    }

    function addCheckboxAndLabel(parentElement) {
        if (!parentElement || document.getElementById('customcheckoutContainer001')) return;

        if (parentElement.baseURI.includes('dev-marigold-grey') || parentElement.baseURI.includes('marigoldgrey')) {
            checkboxContainer.style.justifyContent = "flex-start";
            checkboxContainer.style.marginLeft = '15px';
            checkboxContainer.style.marginTop = '5px';
            checkboxLabel.style.marginTop = '5px';
            parentElement.insertAdjacentElement('beforeBegin', checkboxContainer);
        }
        else if (parentElement.firstElementChild?.className.includes('cart__submit')) {
            checkboxContainer.style.marginRight = '15px';
            checkboxContainer.style.marginTop = '5px';
            parentElement.insertBefore(checkboxContainer, parentElement.firstChild);
        }
        else if (parentElement.firstElementChild?.className.includes('js-contents')) {
            parentElement.insertAdjacentElement('beforeBegin', checkboxContainer);
        }
    }

    function removecustomcheckoutBtn() {
        var el = document.getElementById('customcheckoutContainer001');
        if (el) el.remove();
    }

    if (window.location.pathname.endsWith('/cart') || window.location.pathname.endsWith('/cart/')) {

        var form = document.getElementById('cart') || document.querySelector('.cart');

        var checkoutButton =
            document.querySelector(".cart__blocks") ||
            document.querySelector('.cart__submit-controls') ||
            document.getElementById("cart-notes");

        if (window.Shopify) {
            localStorage.setItem('shopifyRate', window.Shopify.currency.rate);
        }

        hideProductOptions();

        if (form) {
            var table =
                form.querySelector('table.cart-items') ||
                form.querySelector('table') ||
                document.getElementById('cart_form');

            if (table && isInternational) {
                addCheckboxAndLabel(checkoutButton);
            } else {
                removecustomcheckoutBtn();
            }

            const observer = new MutationObserver(function (mutationsList) {
                mutationsList.forEach(function (mutation) {
                    mutation.removedNodes.forEach(function (node) {
                        var table = document.getElementsByClassName("cart-items");

                        if (node.nodeType === 1 && node.classList.contains('cart-items')) {
                            hideProductOptions();
                        }

                        if (node.nodeType === 1 && node.classList.contains('cart-items') && table.length == 0) {
                            removecustomcheckoutBtn();
                        }
                    });
                });
            });

            observer.observe(form, { childList: true, subtree: true });
        }
    }

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            window.location.href = 'apps/myapp?CustomCheckout=DiscountCheckout';
        }
    });

    const customButtons = document.querySelectorAll('button');
    customButtons.forEach(button => {
        button.addEventListener('click', function () {
            setTimeout(() => {
                var drawerHeader = document.querySelector('.drawer__header');
                addCheckboxAndLabel(drawerHeader);
            }, 2000);
        });
    });

})();
