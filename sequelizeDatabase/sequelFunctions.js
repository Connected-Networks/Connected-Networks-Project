const models = require('./modelSetup');

//---------------FindAll: Get all data from the table --------------//
//--------NOTE: These functions return Promises. Use ".then()" after calling them.

getAllIndividuals = () => {
    return models.Individuals.findAll().then((individuals) => {
        return individuals;
    }).catch(err => console.error(err));
};
getAllCompanies = () => {
    return models.Companies.findAll().then((companies) => {
        return companies;
    }).catch(err => console.error(err));
};
getAllFunds = () => {
    return models.Funds.findAll().then((funds) => {
        return funds;
    }).catch(err => console.error(err));
};
getAllEmployeeHistory = () => {
    return models.EmployeeHistory.findAll().then((employeeHistory) => {
        return employeeHistory;
    }).catch(err => console.error(err));
};
getAllFundCompany = () => {
    return models.FundCompany.findAll().then((fundCompany) => {
        return fundCompany;
    }).catch(err => console.error(err));
};

//--------------------Insert into Table Functions-----------//

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

insertCompany = (CompanyName) => {
    models.Companies.create({
        CompanyName: CompanyName
    }).then((company) => {
        console.log('Company Created: ', company);
    }).catch(err => console.error('Error in insertCompany',err));
}




getAllIndividuals().then((test) => {console.log(JSON.stringify(test,null,4))});
module.exports = {
    getAllIndividuals,
    getAllCompanies,
    getAllFunds,
    getAllEmployeeHistory,
    getAllFundCompany
}