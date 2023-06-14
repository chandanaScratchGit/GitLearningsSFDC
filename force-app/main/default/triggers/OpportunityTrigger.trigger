trigger OpportunityTrigger on Opportunity (before update) {

    list<Opportunity> oppNewRecords = trigger.new;
    Map<Id,Opportunity> oppOldRecords =trigger.oldMap;
    list<Opportunity> oppRecords =new list<Opportunity>();
    for(Opportunity i :oppNewRecords)
    {
        if(i.StageName != oppOldRecords.get(i.id).StageName && i.StageName=='Closed Won')
        {
            oppRecords.add(i);
        }
    }
    if(oppRecords.size()!=0)
        opportunityHelper.opportunityValidation(oppRecords);

}