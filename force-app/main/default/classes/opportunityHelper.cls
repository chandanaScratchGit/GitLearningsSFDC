public class opportunityHelper {
    
    Public static void opportunityValidation(List<Opportunity> oppRecords)
    {
        set<id> oppIds = new  set<id>();
        for(Opportunity i:oppRecords)
        {
            oppIds.add(i.id);
        }
        
        List<ContentDocumentLink> docRecords = [SELECT LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId in :oppIds];
        Map<Id,Boolean> hasDocument = new Map<Id,Boolean>();
        for(ContentDocumentLink i:docRecords)
        {
            hasDocument.put(i.LinkedEntityId,true);
        }
        for(Opportunity i:oppRecords)
        {
            if(!hasDocument.containsKey(i.id))
            {
                i.addError('Please upload document');
            }
        }
        
    }

}