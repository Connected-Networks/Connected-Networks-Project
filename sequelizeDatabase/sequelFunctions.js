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

//---------------FindAll: Get all data from the table --------------//

getAllIndividuals = () => {
    models.Individuals.findAll().then((individuals) => {
        return individuals;
    });
};
getAllCompanies = () => {
    models.Companies.findAll().then((companies) => {
        return companies;
    });
};
getAllFunds = () => {
    models.Funds.findAll().then((funds) => {
        return funds;
    });
};
getAllEmployeeHistory = () => {
    models.EmployeeHistory.findAll().then((employeeHistory) => {
        return employeeHistory;
    });
};
getAllFundCompany = () => {
    models.FundCompany.findAll().then((fundCompany) => {
        return fundCompany;
    });
};

module.exports = {
    getAllIndividuals,
    getAllCompanies,
    getAllFunds,
    getAllEmployeeHistory,
    getAllFundCompany
}