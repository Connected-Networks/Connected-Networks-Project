const models = require("./modelSetup");

//---------------FindAll: Get all data from the table --------------//
//--------NOTE: These functions return Promises. Use ".then()" after calling them.

getAllUsers = () => {
  return models.User.findAll()
    .then(users => {
      return users;
    })
    .catch(err => console.error(err));
};

getAllIndividuals = () => {
  return models.Individuals.findAll()
    .then(individuals => {
      return individuals;
    })
    .catch(err => console.error(err));
};
getAllCompanies = () => {
  return models.Companies.findAll()
    .then(companies => {
      return companies;
    })
    .catch(err => console.error(err));
};
getAllFunds = () => {
  return models.Funds.findAll()
    .then(funds => {
      return funds;
    })
    .catch(err => console.error(err));
};
getAllEmployeeHistory = () => {
  return models.EmployeeHistory.findAll()
    .then(employeeHistory => {
      return employeeHistory;
    })
    .catch(err => console.error(err));
};

getAllOriginalFundPositions = () => {
  return models.OriginalFundPosition.findAll()
    .then(originalPositions => {
      return originalPositions;
    })
    .catch(err => console.error(err));
};

getAllSharedFunds = () => {
  return models.SharedFunds.findAll()
    .then(sharedFunds => {
      return sharedFunds;
    })
    .catch(err => console.error(err));
};

//--------------------Insert into Table Functions-----------//

insertUser = (Username, Password, Email) => {
  return models.User.findOrCreate({
    where: { Email: Email },
    defaults: {
      Username: Username,
      Password: Password
    }
  })
    .spread((user, createdBoolean) => {
      return user;
    })
    .catch(err => console.error('Error in "insertUser", ', err));
};

insertFund = (FundName, UserID) => {
  return models.Funds.create({
    //TODO: Make this a findOrCreate to prevent duplicate names.
    FundName: FundName,
    UserID: UserID
  })
    .then(createdFund => {
      return createdFund;
    })
    .catch(err => console.error('Error in "insertFund", ', err));
};

insertSharedFunds = (FundID, UserID) => {
  //NOTE: UserID here is the user the fund is being shared with, not the fund owner.
  return models.SharedFunds.create({
    //TODO: May need a "findOrCreate" with both fields in 'where'.
    FundID: FundID,
    UserID: UserID
  })
    .then(createdSharedFund => {
      return createdSharedFund;
    })
    .catch(err => console.error('Error in "insertSharedFunds", ', err));
};

insertPerson = (FundID, Name, LinkedInUrl, Comments) => {
  return models.Individuals.findOrCreate({
    where: { LinkedInUrl: LinkedInUrl, FundID: FundID },
    defaults: {
      Name: Name,
      Comments: Comments
    }
  })
    .spread((user, createdBoolean) => {
      return user;
    })
    .catch(err => console.error("Error in insertPerson", err));
};

insertCompany = (CompanyName, FundID) => {
  return models.Companies.findOrCreate({ where: { CompanyName: CompanyName, FundID: FundID } })
    .spread((company, createdBoolean) => {
      //console.log('Company Created: ', company);
      return company;
    })
    .catch(err => console.error("Error in insertCompany", err));
};

insertOriginalFundPosition = (IndividualID, CompanyID, PositionName) => {
  //TODO: Verify that the fundIDs in both of these match each other.
  //      Otherwise, just use with Caution.
  return models.OriginalFundPosition.create({
    //TODO: Maybe make this findOrCreate, check if Funds match.
    IndividualID: IndividualID,
    CompanyID: CompanyID,
    PositionName: PositionName
  })
    .then(originalFundPosition => {
      return originalFundPosition;
    })
    .catch(err => console.error('Error in "insertOriginalFundPosition", ', err));
};

insertEmployeeHistory = (UserID, IndividualID, CompanyID, PositionName, StartDate, EndDate) => {
  return models.EmployeeHistory.create({
    //TODO: Add a restriction so you can't have Individuals and companies with Mismatched FundID's.
    UserID: UserID,
    IndividualID: IndividualID,
    CompanyID: CompanyID,
    PositionName: PositionName,
    StartDate: StartDate,
    EndDate: EndDate
  })
    .then(history => {
      //console.log('History Added: ', history);
      return history;
    })
    .catch(err => console.error("Error in insertEmployeeHistory", err));
};

insertFromCsvLine = (
  UserID,
  FundID,
  PortfolioCompanyName,
  EmployeeName,
  OriginalPostion,
  OriginalStartDate,
  OriginalEndDate,
  CurrentEmployer,
  CurrentPostion,
  LinkedInUrl,
  Comments
) => {
  console.log(
    "\n\n Fields are:, ",
    UserID,
    FundID,
    PortfolioCompanyName,
    EmployeeName,
    OriginalPostion,
    OriginalStartDate,
    OriginalEndDate,
    CurrentEmployer,
    CurrentPostion,
    LinkedInUrl,
    Comments,
    "\n"
  );
  insertPerson(FundID, EmployeeName, LinkedInUrl, Comments)
    .then(newPerson => {
      insertCompany(PortfolioCompanyName, FundID).then(originalCompany => {
        insertOriginalFundPosition(newPerson.IndividualID, originalCompany.CompanyID, OriginalPostion)
          .then(() => {
            //NOTE: I'm hoping it doesn't freak out that I included no arguements here.
            insertEmployeeHistory(
              UserID,
              newPerson.IndividualID,
              originalCompany.CompanyID,
              OriginalPostion,
              OriginalStartDate,
              OriginalEndDate
            ).then(() => {
              insertCompany(CurrentEmployer, FundID).then(newCompany => {
                insertEmployeeHistory(
                  UserID,
                  newPerson.IndividualID,
                  newCompany.CompanyID,
                  CurrentPostion,
                  OriginalStartDate,
                  OriginalEndDate
                );
              });
            });
          })
          .catch(err => console.error(">>ERROR ini insertFromCSVLine, in insertOriginal Position."));
      });
    })
    .catch(err => console.error('Error in "insertFromCsvLine", ', err));
};

getIndividualEmployeeHistory = IndividualID => {
  return models.EmployeeHistory.findAll({
    where: { IndividualID: IndividualID },
    order: [["EndDate", "DESC"]],
    include: [
      {
        model: models.Companies
      }
    ]
  }).then(wholeHistory => {
    return wholeHistory;
  });
};

getIndividualCurrentEmployement = IndividualID => {
  return getIndividualEmployeeHistory(IndividualID).then(IndividualHistory => {
    return IndividualHistory[0];
  });
};

//---------------Modify Existing Data Functions----------//
modifyIndividual = (IndividualID, newName, newPosition, newUrl, newComments) => {
  return models.Individuals.findOne({
    where: {
      IndividualID: IndividualID
    }
  })
    .then(individual => {
      individual.update({
        IndividualName: newName,
        OriginalPostion: newPosition, //TODO: Update this.
        LinkedInUrl: newUrl,
        Comments: newComments
      });
      return individual;
    })
    .catch(err => console.error(err));
};

deleteIndividual = IndividualID => {
  // I can't get the delete for an individual to in turn
  //   delete rows from EmployeeHistory, so I'm doing
  //   this the long way until I can ask about Sequelize
  //   Cascade. --Sean
  //
  // Modfying this to avoid a race condition -- Aaron
  return new Promise((resolve, reject) => {
      models.Individuals.destroy({
        where: {
          IndividualID: IndividualID
        }
      }).then(deletedIndividual => {
        console.log("New deletion of an individual.");
        resolve(deletedIndividual);
      }).catch(err => {
        console.err("\n\n-->Error in deleteIndividual: ",err);
        reject(err);
      });
  });
};

//---------------Modify Company---------------//
modifyCompany = (CompanyID, alteredCompanyName) => {
  return models.Companies.findOne({
    where: {
      CompanyID: CompanyID
    }
  })
    .then(company => {
      company.update({
        CompanyName: alteredCompanyName
      });
      return company;
    })
    .catch(err => console.error(err));
};

//---------------Modify Fund---------------//
modifyFund = (FundID, alteredFundName) => {
  return new Promise((resolve, reject) => {
    models.Funds.findOne({
      where: {
        FundID: FundID
      }
    })
      .then(fund => {
        fund
          .update({
            FundName: alteredFundName
          })
          .then(resolve(true))
          .catch(reject());
      })
      .catch(reject());
  });
};

deleteCompany = CompanyID => {
  return new Promise((resolve, reject) => {
     models.Companies.destroy({
        where: {
            CompanyID: CompanyID
          }
     }).then(deletedCompany => {
        console.log("deletion resolved");
        resolve(deletedCompany);
        })
        .catch(err => {
          console.error("Error in Delete company: ", err);
          reject(err);
        })
  });
}


deleteFund = FundID => {
  return new Promise((resolve, reject) => {
    models.Funds.destroy({
      where: {
        FundID: FundID
      }
    })
      .then(deletedFund => {
        console.log("deleted ONLY a fund.");
        resolve(deletedFund);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
};

deleteSharedFunds = ShareID => {
  return new Promise((resolve, reject) => {
    models.SharedFunds.destroy({
      where: {
        SharingID: ShareID
      }
    })
      .then(unsharedFund => {
        console.log("Fund is no longer shared.");
        resolve(unsharedFund);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

deleteEmployeeHistory = HistoryID => {
  return new Promise((resolve, reject) => {
    models.EmployeeHistory.destroy({
      where: {
        HistoryID: HistoryID
      }
    })
      .then(deletedHistory => {
        console.log("Deleted an single employment record.");
        resolve(deletedHistory);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}

//returns a list of objects
//TODO: Update
retrieveCompaniesByFunds = fundID => {
  return models.Companies.findAll({
    where: {
      FundID: fundID
    }
  }).catch(err => console.error(">>>ERROR in retrieveCompaniesByFunds, ", err));
};
retrieveCurrentEmployeesOfCompany = CompanyID => {
  return new Promise((resolve, reject) => {
    getAllIndividuals().then(people => {
      Promise.all(
        people.map(person => {
          return new Promise((resolve, reject) => {
            getIndividualCurrentEmployement(person.IndividualID).then(result => {
              if (result == null || result == undefined || result.company == null || result.company.CompanyID != CompanyID)
                resolve(null);
              else {
                let info = {
                  //Final JSON format
                  IndividualID: person.IndividualID,
                  name: person.Name,
                  CompanyID: result.company.CompanyID,
                  company: result.company.CompanyName,
                  StartDate: result.StartDate,
                  EndDate: result.EndDate,
                  position: result.PositionName
                };
                resolve(info);
              }
            });
          });
        })
      ).then(results => {
        resolve(results.filter(x => x != null));
      });
    });
  }).catch(error => {
    console.err("Error in retrieveCurrentEmployeesOfCompany", error);
    reject();
  });
};

retrieveFundName = fundID => {
  return new Promise((resolve, reject) => {
    models.Funds.findAll({
      where: {
        FundID: fundID
      }
    }).then(result => {
      if (result[0] != undefined) resolve(result[0].FundName);
      else resolve(undefined);
    });
  });
};

getUserByUsername = username => {
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: {
        Username: username
      }
    }).then(user => {
      user !== null ? resolve(user) : reject();
    });
  });
};

getUserByEmail = email => {
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: {
        Email: email
      }
    }).then(user => {
      user !== null ? resolve(user) : reject();
    });
  });
};

getUserById = id => {
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: {
        UserID: id
      }
    }).then(user => {
      user !== null ? resolve(user) : reject();
    });
  });
};

module.exports = {
  getAllUsers,
  getAllIndividuals,
  getAllCompanies,
  getAllFunds,
  getAllEmployeeHistory,
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
  deleteFund,
  modifyFund,
  retrieveCompaniesByFunds,
  retrieveCurrentEmployeesOfCompany,
  retrieveFundName,
  insertFund,
  getUserByUsername,
  getUserByEmail,
  insertUser,
  getUserById,
  deleteSharedFunds,
  deleteEmployeeHistory,
  insertSharedFunds,
  getAllSharedFunds
};
