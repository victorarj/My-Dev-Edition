Schema.DescribeSObjectResult a_desc = Account.sObjectType.getDescribe(); 
//for the Account object, you can replace that with any object you have, standard or custom
Map<String, Schema.SObjectField> a_fields = a_desc.fields.getMap();
for(Schema.sObjectField fld:a_fields.values()){ 
               system.debug(fld);
}