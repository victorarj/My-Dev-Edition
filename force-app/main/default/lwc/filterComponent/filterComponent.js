import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';

export default class FilterComponent extends LightningElement {
    @api filterField = '';
    @api filterValue = '';
    @api comparisonOperator = '';
    fieldType = 'text';
    fieldOptions = [];
    comparisonOptions = [{ label: 'Equal to', value: 'eq' }, { label: 'Not equal to', value: 'ne' }, { label: 'Greater than', value: 'gt' }, { label: 'Less than', value: 'lt' }];

    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
    wiredOpportunityInfo({ error, data }) {
        if (data) {
            // Extract the editable fields from the object's metadata
            const fields = data.fields;
            this.fieldOptions = Object.keys(fields)
                .filter(fieldName => fields[fieldName].updateable)
                .map(fieldName => ({
                    label: fields[fieldName].label,
                    value: fieldName,
                    dataType: fields[fieldName].dataType 
                }));
        } else if (error) {
            console.error('Error fetching opportunity object info', error);
        }
    }

    handleFieldChange(event) {
        this.filterField = event.target.value;
        const selectedField = this.fieldOptions.find(option => option.value === this.filterField);
        this.fieldType = this.validDataType(selectedField.dataType);
        console.log('fieldtype: ' + this.fieldType);
    }

    handleComparisonChange(event) {
        this.comparisonOperator = event.detail.value;
    }

    handleValueChange(event) {
        this.filterValue = event.target.value;
    }

    handleApplyFilter() {
        const filterEvent = new CustomEvent('filterevent', {
            detail: { filterField: this.filterField, comparisonOperator: this.comparisonOperator, filterValue: this.filterValue, fieldType: this.fieldType }
        });
        this.dispatchEvent(filterEvent);

        this.closeModal();
    }

    validDataType(dataType) {
        switch (dataType) {
            case 'Currency':
                return 'number';
            case 'Date':
                return 'date';
            default:
                return 'text';
        }
    }

    closeModal() {
        const closeEvent = new CustomEvent('close');
        this.dispatchEvent(closeEvent);
    }
}