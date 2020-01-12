const models = require('/modelSetup.js');

//This function inserts an individual into the Individuals Table.
insertPerson = (IndividualName, OriginalPosition, LinkedInUrl, Comments) => {
    models.Individuals.create({
        IndividualName: IndividualName,
        OriginalPosition: OriginalPosition,
        LinkedInUrl: LinkedInUrl,
        Comments: Comments
    }).then((user) => {
        console.log('Individual Created: ',user);
    }).catch(err => console.error('Error in insertPerson', err));
}

