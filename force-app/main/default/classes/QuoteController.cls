public with sharing class QuoteController {
    @AuraEnabled
    public static void createQuoteRecord() {
        // Create a new Quote record
        Account newAccount = new Account();
        newAccount.Name = 'New Account'; // Set the name (adjust as needed)
        // Add any other fields you want to set

        // Insert the new Account record
        insert newAccount;
    }

    @AuraEnabled(cacheable=true)
    public static List<ProductWrapper> getProducts() {
        List<Product2> products = [SELECT Id, Name, (SELECT Id, Name FROM SBQQ__OptionalFor__r) FROM Product2 WHERE Id IN (SELECT SBQQ__ConfiguredSKU__c FROM SBQQ__ProductOption__c)];

        List<ProductWrapper> productWrappers = new List<ProductWrapper>();

        for (Product2 product : products) {
            ProductWrapper wrapper = new ProductWrapper();
            wrapper.productId = product.Id;
            wrapper.productName = product.Name;

            List<ProductOptionWrapper> productOptions = new List<ProductOptionWrapper>();
            for (SBQQ__ProductOption__c productOption : product.SBQQ__OptionalFor__r) {
                ProductOptionWrapper optionWrapper = new ProductOptionWrapper();
                optionWrapper.optionId = productOption.Id;
                optionWrapper.optionName = productOption.Name;
                productOptions.add(optionWrapper);
            }

            wrapper.productOptions = productOptions;
            productWrappers.add(wrapper);
        }

        return productWrappers;
    }

    public class ProductWrapper {
        @AuraEnabled
        public String productId;

        @AuraEnabled
        public String productName;

        @AuraEnabled
        public List<ProductOptionWrapper> productOptions;
    }

    public class ProductOptionWrapper {
        @AuraEnabled
        public String optionId;

        @AuraEnabled
        public String optionName;
    }
}