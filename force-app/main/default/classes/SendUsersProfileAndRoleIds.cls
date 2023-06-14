public class SendUsersProfileAndRoleIds {
	   
@AuraEnabled
    public static String getProfileandRoleID(list<List<String>> profileNames,list<List<String>> roleNames)
    {
        map<String,ID> output = new map<String,ID>();
        String outputString='';
        system.debug(profileNames[0]);
        list<profile> prodata = [select id,Name from profile where Name in :profileNames[0]];
        for(Profile p :prodata )
        {
                if(!output.containsKey(p.Name)){
                    output.put(p.Name,p.id);
                     outputString=outputString+p.Name+':'+p.id;
                }
           
        }
        System.debug(outputString);
        system.debug(roleNames);
         list<userRole> roledata = [Select id,Name from userRole where Name in :roleNames[0]];
        for(userRole r : roledata )
        {   
            if(!output.containsKey(r.Name)){
                output.put(r.Name,r.id);
                System.debug(r.Name);
                outputString=outputString+r.Name+':'+r.id;
            }
            
        }
              System.debug(outputString);
       
              return outputString;
    }

}