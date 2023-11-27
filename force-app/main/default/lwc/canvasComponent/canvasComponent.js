import { LightningElement, track, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import createQuoteRecord from '@salesforce/apex/QuoteController.createQuoteRecord';
import getProducts from '@salesforce/apex/QuoteController.getProducts';
//import getProductOptions from '@salesforce/apex/QuoteController.getProductOptions';

export default class CanvasComponent extends LightningElement {
    @track quotes = [];
    @track hasQuote = false;
    @track catalogName;
    @track optionName;

    @track isLibraryTrue = true;
    @track isCatalogTrue = false;
    @track isBundlesTrue = false;
    @track isOptionsTrue = false;
    @track isProductsTrue = false;
    @track isSelected = false;
    @track isOptionsSelected = false;

    products;
    productOptions;

    connectedCallback() {
        this.isCatalogTrue = false;
        this.isLibraryTrue = true;
    }

    @wire(createQuoteRecord)
    wiredQuotes({ error, data }) {
        if (data) {
            this.quotes = data;
        } else if (error) {
            // Handle error
        }
    }

    goToCatalogSections() {
        this.isCatalogTrue = true;
        this.isLibraryTrue = false;
    }

    backToLibrary() {
        this.isCatalogTrue = false;
        this.isLibraryTrue = true;
        this.isBundlesTrue = false;

    }

    backToCatalog() {
        this.isCatalogTrue = true;
        
        if (this.isOptionsTrue == true) {
            this.isOptionsTrue = false;
        }
        
        if (this.isProductsTrue == true) {
            this.isProductsTrue = false;
        }
        else {
            this.isBundlesTrue = false;
        }
    }

    fetchBundles() {
        getProducts()
            .then(result => {
                // Handle the result
                this.products = result;
                this.isBundlesTrue = true;
                this.isProductsTrue = true;
                this.isCatalogTrue = false;
            })
            .catch(error => {
                // Handle the error
                console.error('Error fetching products:', error);
            });
    }

    fetchProductOptions(event) {
        const selectedProductId = event.currentTarget.dataset.id;
        this.isProductsTrue = false;
        this.isOptionsTrue = true;

        const selectedProduct = this.products.find(product => product.productId === selectedProductId);
        console.log(JSON.stringify(selectedProduct));

        if (selectedProduct) {
            console.log('entrou if!!');
            this.isSelected = true;
            this.catalogName = selectedProduct.productName;
            this.productOptions = selectedProduct.productOptions;
            console.log(JSON.stringify(this.productOptions));
        }
    }

    selectProductOption(event) {
        this.isOptionsSelected = true;

        const selectedOptionId = event.currentTarget.dataset.id;
        const selectedOption = this.productOptions.find(productOptions => productOptions.optionId === selectedOptionId);
        this.optionName = selectedOption.optionName;
    }

    createQuote() {
        this.hasQuote = true;

        /* createRecord({
            apiName: 'Account', // The API name of the object you want to create (adjust as needed)
            fields: {
                // Add any fields you want to set for the new quote
                // Example: 'Name': 'New Quote'
                'Name': 'New Quote'
            }
        })
        .then(result => {
            // Handle success
            // Refresh the quotes by invoking the wired method again
            this.wiredQuotes();
        })
        .catch(error => {
            // Handle error
        }); */
    }
}