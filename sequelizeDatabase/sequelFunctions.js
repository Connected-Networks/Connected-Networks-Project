const models = require('./modelSetup');

//---------------FindAll: Get all data from the table --------------//
//--------NOTE: These functions return Promises. Use ".then()" after calling them.

getAllUsers = () => {
    return models.User.findAll().then((users) => {
        return users;
    }).catch(err => console.err(err));
};

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

getAllOriginalFundPositions = () => {
    return models.OriginalFundPosition.findAll().then((originalPositions) => {
        return originalPositions;
    }).catch(err => console.error(err));
}

getAllSharedFunds = () => {
    return models.SharedFunds.findAll().then((sharedFunds) => {
        return sharedFunds;
    }).catch(err => console.error(err));
}

//--------------------Insert into Table Functions-----------//

//TODO: Make an Insert User.
insertFund = (FundName, UserID) => {
    return models.create({
        FundName: FundName,
        UserID: UserID
    }).then((createdFund) => {
        return createdFund;
    }).catch(err => console.error('Error in "insertFund", ', err));
};

insertPerson = (FundID, Name, LinkedInUrl, Comments) => {
    return models.Individuals.findOrCreate({where:{Name: Name}, 
        defaults: {
            //TODO: Finish This.
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

deleteIndividual = (IndividualID) => {
    // I can't get the delete for an individual to in turn
    //   delete rows from EmployeeHistory, so I'm doing 
    //   this the long way until I can ask about Sequelize
    //   Cascade. --Sean
    //
    // Modfying this to avoid a race condition -- Aaron
    return new Promise((resolve,reject)=>{
        models.EmployeeHistory.destroy({
            where: {
                IndividualID: IndividualID
            }
        }).then((deletedHistory) => {
            models.Individuals.destroy({
                where: {
                    IndividualID: IndividualID
                }
            }).then((deletedIndividual) =>{
                console.log("deletion resolved")
                resolve(deletedIndividual);
            })
        }).catch(err => {console.error(err)
                        reject(err)
        })
    })
}

//---------------Modify Company---------------//
modifyCompany = (CompanyID, alteredCompanyName) => {
    return models.Companies.findOne({
        where: {
            CompanyID: CompanyID
        }
    }).then(company => {
        company.update({
            CompanyName: alteredCompanyName
        })
        return company;
    }).catch(err => console.error(err));
}

deleteCompany = (CompanyID) => {
    return new Promise((resolve,reject)=>{
        models.EmployeeHistory.destroy({
            where: {
                CompanyID: CompanyID
            }
        }).then((deletedHistory) => {
            models.Companies.destroy({
                where: {
                    CompanyID: CompanyID
                }
            }).then((deletedCompany) =>{
                console.log("deletion resolved")
                resolve(deletedCompany);
            })
        }).catch(err => {console.error(err)
                        reject(err)
        })
    })
}

deleteFund = (FundID) => {
    return new Promise((resolve,reject)=>{
        models.Funds.destroy({
            where: {
                FundID: FundID
            }
        }).then((deletedFund) => {
            console.log("deleted ONLY a fund.");
            resolve(deletedFund);
        }).catch(err => {console.error(err)
                        reject(err)
        })
    })
};
    
    module.exports = {
        getAllUsers,
        getAllIndividuals,
        getAllCompanies,
        getAllFunds,
        getAllEmployeeHistory,
        // getAllFundCompany,
        insertPerson,
        insertCompany,
    insertEmployeeHistory,
    insertFromCsvLine,
    getIndividualEmployeeHistory,
    getIndividualCurrentEmployement,
    modifyIndividual,
    deleteIndividual,
    modifyCompany,
    deleteCompany,
    deleteFund
}