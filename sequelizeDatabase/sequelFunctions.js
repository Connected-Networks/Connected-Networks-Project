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

//---------------Modify Fund---------------//
modifyFund = (FundID, alteredFundName) => {
    return new Promise((resolve,reject)=>{
        models.Funds.findOne({
            where: {
                FundID: FundID
            }
        }).then(fund => {
            fund.update({
                FundName: alteredFundName
            }).then(resolve(true)).catch(reject())
        }).catch(reject());
    })
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

//returns a list of objects
//{
// FundCompanyID
// FundID
// CompanyID
// company:
//   {
//     CompanyID
//     CompanyName
//   }
//}
retrieveCompaniesByFunds = (fundID) => {
    return models.FundCompany.findAll(
        {
            where: {
                FundID: fundID
            },
            include: [{
                model: models.Companies
            }]
        }
    )
}
retrieveCurrentEmployeesOfCompany = (CompanyID) => {
    return new Promise((resolve,reject)=>{
        getAllIndividuals().then((people)=>{
            Promise.all(people.map((person)=>{
                return new Promise((resolve,reject)=>{
                    getIndividualCurrentEmployement(person.IndividualID).then((result)=>{
                        if (result==null || result==undefined || result.company==null || result.company.CompanyID!=CompanyID)
                            resolve(null)
                        else{
                            let info = {
                                //Final JSON format
                                IndividualID : person.IndividualID,
                                name : person.IndividualName,
                                CompanyID : result.company.CompanyID,
                                company : result.company.CompanyName,
                                StartDate : result.StartDate,
                                EndDate : result.EndDate,
                                position : result.PositionName
                            }
                            resolve(info);
                        }
                    })
                })
            })).then((results)=>{
                resolve(results.filter(x=>x!=null))
            })
        })
    })
}

retrieveFundName = (fundID) => {
    return new Promise((resolve,reject)=>{
        models.Funds.findAll({
            where: {
                FundID: fundID
            }
        }).then((result)=>{
            if (result[0]!=undefined)
               resolve(result[0].FundName)
            else
                resolve(undefined)
        })
    })
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
    modifyIndividual,
    deleteIndividual,
    modifyCompany,
    modifyFund,
    deleteCompany,
    retrieveCompaniesByFunds,
    retrieveCurrentEmployeesOfCompany,
    retrieveFundName
}