import { LightningElement, track, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import createQuoteRecord from '@salesforce/apex/QuoteController.createQuoteRecord';

export default class CanvasComponent extends LightningElement {
    @track quotes = [];
    @track hasQuote = false;

    @wire(createQuoteRecord)
    wiredQuotes({ error, data }) {
        if (data) {
            this.quotes = data;
        } else if (error) {
            // Handle error
        }
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