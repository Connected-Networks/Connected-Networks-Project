const models = require('./modelSetup');

//This function inserts an individual into the Individuals Table.
insertPerson = (IndividualName, OriginalPosition, LinkedInUrl, Comments) => {
    models.Individuals.create({
        IndividualName: IndividualName,
        OriginalPostion: OriginalPosition,
        LinkedInUrl: LinkedInUrl,
        Comments: Comments
    }).then((user) => {
        console.log('Individual Created: ',user);
    }).catch(err => console.error('Error in insertPerson', err));
}