import { LightningElement, api } from 'lwc';

export default class QuoteList extends LightningElement {
    @api quotes;
}