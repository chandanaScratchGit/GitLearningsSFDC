import { LightningElement,track} from 'lwc';
import PARSER from '@salesforce/resourceUrl/PapaParse';
import { loadScript } from 'lightning/platformResourceLoader';
import { createRecord } from 'lightning/uiRecordApi';
import getProfileandRoleID from '@salesforce/apex/SendUsersProfileAndRoleIds.getProfileandRoleID';
import USER_OBJECT from '@salesforce/schema/User';
import Email_FIELD from '@salesforce/schema/User.Email';
import Alias_FIELD from '@salesforce/schema/User.Alias';
import LastName_FIELD from '@salesforce/schema/User.LastName';
import UserRoleId_FIELD from '@salesforce/schema/User.UserRoleId';
import Username_FIELD from '@salesforce/schema/User.Username';
import profileId_FIELD from '@salesforce/schema/User.ProfileId';
import LanguageLocaleKey_FIELD from '@salesforce/schema/User.LanguageLocaleKey';
import EmailEncodingKey_FIELD from '@salesforce/schema/User.EmailEncodingKey';
import LocaleSidKey_FIELD from '@salesforce/schema/User.LocaleSidKey';
import TimeZoneSidKey_FIELD from '@salesforce/schema/User.TimeZoneSidKey';
import StayInTouchSignature from '@salesforce/schema/User.StayInTouchSignature';
import SystemModstamp from '@salesforce/schema/Account.SystemModstamp';
export default class Createusersfromcsv extends LightningElement {
    parserInitialized = false;
    @track loading = false;
    @track showbutton=false;
    @track showcreate=false;
    @track _results;
    @track _rows;
    @track profileNames=[]
    @track roleNames=[]
    @track profileAndRoleIds
    @track temp=[]
    @track showInputfile=true
    renderedCallback() {
        if(!this.parserInitialized){
            loadScript(this, PARSER)
                .then(() => {
                    this.parserInitialized = true;
                })
                .catch(error => console.error(error));
        }

    }
    handleInputFile(event){
        if(event.target.files.length > 0){
            const file = event.target.files[0];
            Papa.parse(file, {
                quoteChar: '"',
                header: 'true',
                skipEmptyLines: true,
                complete: (results) => {
                    this._rows = results.data;
                    this.loading = false;
                },
                error: (error) => {
                    console.error(error);
                    this.loading = false;
                }
            })
            this.loading = true;
            this.showInputfile=false
            
         
        }
        
       
    }
    get rows(){
        if(this._rows){
            return this._rows.map((row, index) => {
                row.key = index;
               if(this.results[index]){
                    row.result = this.results[index].id || this.results[index].error;
                }
               
                return row;
            })
            
        }
        return [];
    }
    get columns(){
       
        var columns = [
            { label: 'Alias', fieldName: 'Alias' },
            { label: 'Email', fieldName: 'Email' },
            { label: 'LastName', fieldName: 'LastName' },
            { label: 'ProfileName', fieldName: 'ProfileName'},
            { label: 'Username', fieldName: 'Username' },
            { label: 'RoleName', fieldName: 'RoleName' },
           
            
          
        ];
        if(this.results.length){
            columns=[]
            columns.push({ label: 'LastName',fieldName: 'LastName' });
            columns.push({ label: 'Email',fieldName: 'Email' });
            columns.push({ label: 'Result',fieldName: 'result' });

        }
        return columns;
    }
    get results(){
        
        if(this._results){
            return this._results.map(r => {
                const result = {};
                const res = JSON.stringify(r);
                const feildLabel=res.substring(res.lastIndexOf('message')+9,res.lastIndexOf(']')-2);
                
                result.success = r.status === 'fulfilled';
                result.id = result.success ? r.value.id : undefined    
                result.error = !result.success ?feildLabel : undefined;
             
                return result;
            });
        }
        return [];
    }
    get Description(){
            return "Total numbers of records uploaded are " + this._rows.length 
    }
    cancel(){
        this._rows = undefined;
        this._results = undefined;
        this.showcreate=false 
        this.showInputfile=true

    }
    Back(){
        this._rows = undefined;
        this._results = undefined;
        this.showbutton=false;  
        this.showcreate=false
        this.showInputfile=true
    }
    getProfileandrRoleIDs()
    {
        this.profileNames.push(this._rows.map((row, index) => {
            return row.ProfileName;

         }))
         this.roleNames.push(this._rows.map((row, index) => {
             return row.RoleName;

         }))
        
          
          
         getProfileandRoleID({profileNames:JSON.stringify(this.profileNames),
                             roleNames:JSON.stringify(this.roleNames)})
         .then(result => {
           
             this.profileAndRoleIds=result

             
         
            })
         .catch(error => {
             this.error = error;
         });

         this.showcreate=true
    }
    createUsers(){
        

            
    const usersToCreate = this.rows.map(row => {   
        console.log('this is result=  ',this.profileAndRoleIds) 
             
            const fields = {};
            fields[Email_FIELD.fieldApiName] = row.Email;
            fields[Alias_FIELD.fieldApiName] = row.Alias;
            fields[LastName_FIELD.fieldApiName] = row.LastName;
            fields[UserRoleId_FIELD.fieldApiName] = this.profileAndRoleIds.substring(this.profileAndRoleIds.lastIndexOf(row.RoleName)+row.RoleName.length+1,this.profileAndRoleIds.lastIndexOf(row.RoleName)+row.RoleName.length+20);
            fields[Username_FIELD.fieldApiName] = row.Username;
            fields[profileId_FIELD.fieldApiName] = this.profileAndRoleIds.substring(this.profileAndRoleIds.lastIndexOf(row.ProfileName)+row.ProfileName.length+1,this.profileAndRoleIds.lastIndexOf(row.ProfileName)+row.ProfileName.length+19);;
            fields[LanguageLocaleKey_FIELD.fieldApiName] = "en_US";
            fields[EmailEncodingKey_FIELD.fieldApiName] = "UTF-8";
            fields[LocaleSidKey_FIELD.fieldApiName] = "en_US";
            fields[TimeZoneSidKey_FIELD.fieldApiName] = "America/Los_Angeles";

            const recordInput = { apiName: USER_OBJECT.objectApiName, fields };
            return createRecord(recordInput);
        });
        if(usersToCreate.length){
            this.loading = true;
            this.showbutton=true;
            Promise.allSettled(usersToCreate)
                .then(results => this._results = results)
                .catch(error => console.error(error))
                .finally(() => this.loading = false);
           
        }
    }

}