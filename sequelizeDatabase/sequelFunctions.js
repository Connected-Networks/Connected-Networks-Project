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
    return models.Individuals.findOrCreate({where:{IndividualName: IndividualName}, 
        defaults: {
            OriginalPostion: OriginalPosition,
            LinkedInUrl: LinkedInUrl,
            Comments: Comments}    
    }).spread((user,createdBoolean) => {
        return user;
    }).catch(err => console.error('Error in insertPerson', err));
}

insertCompany = (CompanyName) => {
    return models.Companies.findOrCreate({where: {CompanyName: CompanyName}
    }).spread((company, createdBoolean) => {
        //console.log('Company Created: ', company);
        return company;
    }).catch(err => console.error('Error in insertCompany',err));
}

insertEmployeeHistory = (IndividualID, CompanyID, PositionName, StartDate, EndDate) => {
    return models.EmployeeHistory.create({
        IndividualID: IndividualID,
        CompanyID: CompanyID,
        PositionName: PositionName,
        StartDate: StartDate,
        EndDate: EndDate
    }).then((history) =>{
        //console.log('History Added: ', history);
        return history;
    }).catch(err => console.error('Error in insertEmployeeHistory',err));
}

insertFromCsvLine = (EmployeeName, OriginalPostion, OriginalStartDate, OriginalEndDate, CurrentEmployer, CurrentPostion, LinkedInUrl, Comments) =>{
    insertPerson(EmployeeName, OriginalPostion, LinkedInUrl, Comments).then((newPerson) => {
        insertCompany(CurrentEmployer).then((newCompany) => {
            insertEmployeeHistory(newPerson.IndividualID, newCompany.CompanyID, CurrentPostion, OriginalStartDate, OriginalEndDate)
        })
    });
}

getIndividualEmployeeHistory = (IndividualID) => {
    return models.EmployeeHistory.findAll({
        where: {IndividualID: IndividualID},
        order: [['EndDate', 'DESC']],
        include: [{
            model: models.Companies
        }]
    }).then((wholeHistory) => {
        return wholeHistory;
    });
}

getIndividualCurrentEmployement = (IndividualID) => {
    return getIndividualEmployeeHistory(IndividualID).then((IndividualHistory) => {
        return IndividualHistory[0];
    })
}

//---------------Modify Existing Data Functions----------//
modifyIndividual = (IndividualID, newName, newPosition, newUrl, newComments) => {
    return models.Individuals.findOne({
        where: {
            IndividualID: IndividualID
        }
    }).then(individual => {
        individual.update({
            IndividualName: newName,
            OriginalPostion: newPosition,
            LinkedInUrl: newUrl,
            Comments: newComments
        })
        return individual;
    }).catch(err => console.error(err));
}

module.exports = {
    getAllIndividuals,
    getAllCompanies,
    getAllFunds,
    getAllEmployeeHistory,
    getAllFundCompany,
    insertPerson,
    insertCompany,
    insertEmployeeHistory,
    insertFromCsvLine,
    getIndividualEmployeeHistory,
    getIndividualCurrentEmployement,
    modifyIndividual
}