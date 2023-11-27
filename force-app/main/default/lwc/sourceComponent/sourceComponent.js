// sourceComponent.js
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SourceComponent extends NavigationMixin(LightningElement) {
    redirectToTarget() {
        // Navigate to the target component
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__targetComponent' // Replace with the API name of your TargetComponent
            },
        });
    }
}