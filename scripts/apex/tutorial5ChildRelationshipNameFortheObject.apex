Schema.DescribeSObjectResult   describeresult = Account.SObjectType.getDescribe();
//it gives Account  object properties or describe results;
List<Schema.ChildRelationship>   lstchildrelationships =describeresult.getChildRelationships();
//It gives you all the childrelationships associated with the account.To get relationship names from the above list;
for(Schema.ChildRelationship relname:lstchildrelationships)
{
  System.debug('Relationshipname:'+relname.getrelationshipname());
}