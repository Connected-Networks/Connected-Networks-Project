const models = require("./modelSetup");
const moment = require("moment");

//---------------FindAll: Get all data from the table --------------//
//--------NOTE: These functions return Promises. Use ".then()" after calling them.

getAllUsers = () => {
  return models.User.findAll()
    .then((users) => {
      return users;
    })
    .catch((err) => console.error(err));
};

getAllIndividuals = () => {
  return models.Individuals.findAll()
    .then((individuals) => {
      return individuals;
    })
    .catch((err) => console.error(err));
};

//This function returns an array of FundIDs representing funds the user can see.
//It is important this returns an array of strings rather than Fund JSON objects.
getFundsUserCanSee = (userID) => {
  return new Promise((resolve, reject) => {
    models.Funds.findAll({
      where: { UserID: userID },
    }).then((originalFundResults) => {
      models.SharedFunds.findAll({
        where: { UserID: userID },
      }).then((sharedFundResults) => {
        let originalFundNumbers = originalFundResults.map((x) => {
          //Converted to string to be more universal
          return x.FundID.toString();
        });
        let sharedFundNumbers = sharedFundResults.map((x) => {
          //Converted to string to be more universal
          return x.FundID.toString();
        });
        let fundNumbers = originalFundNumbers.concat(sharedFundNumbers);
        resolve(fundNumbers);
      });
    });
  });
};

getFundsUserCanChange = (userID) => {
  return new Promise((resolve, reject) => {
    models.Funds.findAll({ where: { UserID: userID } }).then((originalFundResults) => {
      resolve(
        originalFundResults.map((x) => {
          return x.FundID.toString();
        })
      );
    });
  });
};

getAllIndividualsOfUser = (userID) => {
  return new Promise((resolve, reject) => {
    getFundsUserCanSee(userID).then((ids) => {
      models.Individuals.findAll({
        where: { FundID: ids },
      }).then((results) => {
        resolve(results);
      });
    });
  });
};
getAllCompanies = () => {
  return models.Companies.findAll({ where: {} })
    .then((companies) => {
      return companies;
    })
    .catch((err) => console.error(err));
};
getAllCompaniesOfUser = (userID) => {
  return new Promise((resolve, reject) => {
    getFundsUserCanSee(userID).then((fundids) => {
      models.Companies.findAll({
        where: { FundID: fundids },
      }).then((results) => {
        resolve(results);
      });
    });
  });
};
getAllFunds = () => {
  return models.Funds.findAll()
    .then((funds) => {
      return funds;
    })
    .catch((err) => console.error(err));
};
getAllEmployeeHistory = () => {
  return models.EmployeeHistory.findAll()
    .then((employeeHistory) => {
      return employeeHistory;
    })
    .catch((err) => console.error(err));
};

getAllOriginalFundPositions = () => {
  return models.OriginalFundPosition.findAll()
    .then((originalPositions) => {
      return originalPositions;
    })
    .catch((err) => console.error(err));
};

getAllSharedFunds = () => {
  return models.SharedFunds.findAll()
    .then((sharedFunds) => {
      return sharedFunds;
    })
    .catch((err) => console.error(err));
};

//--------------------Insert into Table Functions-----------//

insertUser = (Username, Password, Email) => {
  return models.User.findOrCreate({
    where: { Email: Email },
    defaults: {
      Username: Username,
      Password: Password,
    },
  })
    .spread((user, createdBoolean) => {
      return user;
    })
    .catch((err) => console.error('Error in "insertUser", ', err));
};

insertFund = (FundName, UserID) => {
  return models.Funds.create({
    //TODO: Make this a findOrCreate to prevent duplicate names.
    FundName: FundName,
    UserID: UserID,
  })
    .then((createdFund) => {
      return createdFund;
    })
    .catch((err) => console.error('Error in "insertFund", ', err));
};

insertSharedFunds = (FundID, UserID) => {
  //NOTE: UserID here is the user the fund is being shared with, not the fund owner.
  return models.SharedFunds.create({
    //TODO: May need a "findOrCreate" with both fields in 'where'.
    FundID: FundID,
    UserID: UserID,
  })
    .then((createdSharedFund) => {
      return createdSharedFund;
    })
    .catch((err) => console.error('Error in "insertSharedFunds", ', err));
};

insertPerson = async (FundID, Name, LinkedInUrl, Comments) => {
  const insertedPerson = await models.Individuals.create({
    LinkedInUrl: LinkedInUrl,
    FundID: FundID,
    Name: Name,
    Comments: Comments,
  });
  return insertedPerson;
};

insertCompany = (companyName, fundID) => {
  console.log("finding " + companyName + " " + fundID);
  return models.Companies.findOrCreate({ where: { CompanyName: companyName, FundID: fundID } })
    .spread((company, createdBoolean) => {
      //console.log('Company Created: ', company);
      return company;
    })
    .catch((err) => console.error("Error in insertCompany", err));
};

insertOriginalFundPosition = (IndividualID, CompanyID, PositionName) => {
  //TODO: Verify that the fundIDs in both of these match each other.
  //      Otherwise, just use with Caution.
  return models.OriginalFundPosition.create({
    //TODO: Maybe make this findOrCreate, check if Funds match.
    IndividualID: IndividualID,
    CompanyID: CompanyID,
    PositionName: PositionName,
  })
    .then((originalFundPosition) => {
      return originalFundPosition;
    })
    .catch((err) => console.error('Error in "insertOriginalFundPosition", ', err));
};

insertEmployeeHistory = (UserID, IndividualID, CompanyID, PositionName, StartDate, EndDate) => {
  return models.EmployeeHistory.create({
    //TODO: Add a restriction so you can't have Individuals and companies with Mismatched FundID's.
    UserID: UserID,
    IndividualID: IndividualID,
    CompanyID: CompanyID,
    PositionName: PositionName,
    StartDate: StartDate,
    EndDate: EndDate,
  })
    .then((history) => {
      //console.log('History Added: ', history);
      return history;
    })
    .catch((err) => {
      console.error("Error in insertEmployeeHistory", err);
      throw err;
    });
};

updateEmployeeHistory = (historyID, userID, individualID, companyID, positionName, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    models.EmployeeHistory.findOne({
      where: {
        HistoryID: historyID,
      },
    }).then((result) => {
      if (result == null) reject();
      result
        .update({
          UserID: userID,
          IndividualID: individualID,
          CompanyID: companyID,
          PositionName: positionName,
          StartDate: startDate,
          EndDate: endDate,
        })
        .then((result) => {
          resolve();
        });
    });
  });
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
  //returns IndividualID for use in processing quarter updates
  return new Promise((resolve, reject) => {
    insertPerson(FundID, EmployeeName, LinkedInUrl, Comments)
      .then((newPerson) => {
        insertCompany(PortfolioCompanyName, FundID).then((originalCompany) => {
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
                insertCompany(CurrentEmployer, FundID).then((newCompany) => {
                  insertEmployeeHistory(
                    UserID,
                    newPerson.IndividualID,
                    newCompany.CompanyID,
                    CurrentPostion,
                    moment(new Date()).format("YYYY-MM-DD"),
                    null
                  ).then(() => {
                    resolve(newPerson.IndividualID);
                  });
                });
              });
            })
            .catch((err) => console.error(">>ERROR ini insertFromCSVLine, in insertOriginal Position."));
        });
      })
      .catch((err) => console.error('Error in "insertFromCsvLine", ', err));
  });
};
insertQuarterEmployment = (userID, individualID, fundID, companyName, positionName, startDate) => {
  return new Promise((resolve, reject) => {
    insertCompany(companyName, fundID)
      .then((company) => {
        insertEmployeeHistory(userID, individualID, company.CompanyID, positionName, startDate, null)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error("An error occurred while adding employee history from quarter columns");
            console.error(error);
            reject();
          });
      })
      .catch((error) => {
        console.error("An error occurred while finding the company " + companyName);
        console.error(error);
        reject();
      });
  });
};

getIndividualEmployeeHistory = (IndividualID) => {
  return models.EmployeeHistory.findAll({
    where: { IndividualID: IndividualID },
    order: [["StartDate", "DESC"]],
    include: [
      {
        model: models.Companies,
      },
    ],
  }).then((wholeHistory) => {
    return wholeHistory;
  });
};

getIndividualCurrentEmployement = (IndividualID) => {
  return getIndividualEmployeeHistory(IndividualID).then((IndividualHistory) => {
    return IndividualHistory[0];
  });
};

//---------------Modify Existing Data Functions----------//
//FundID should not be changeable.
modifyIndividual = (IndividualID, newName, newUrl, newComments) => {
  return models.Individuals.findOne({
    where: {
      IndividualID: IndividualID,
    },
  })
    .then((individual) => {
      individual.update({
        Name: newName, //<--DONE: Change "IndividualName" to "Name" to match new SQL Table. 4/14/20
        LinkedInUrl: newUrl,
        Comments: newComments,
      });
      return individual;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

deleteIndividual = (IndividualID) => {
  return new Promise((resolve, reject) => {
    models.Individuals.destroy({
      where: {
        IndividualID: IndividualID,
      },
    })
      .then((deletedIndividual) => {
        console.log("New deletion of an individual.");
        resolve(deletedIndividual);
      })
      .catch((err) => {
        console.error("\n\n-->Error in deleteIndividual: ", err);
        reject(err);
      });
  });
};

//---------------Modify Company---------------//
modifyCompany = (CompanyID, alteredCompanyName) => {
  return models.Companies.findOne({
    where: {
      CompanyID: CompanyID,
    },
  })
    .then((company) => {
      company.update({
        CompanyName: alteredCompanyName,
      });
      return company;
    })
    .catch((err) => console.error(err));
};

//---------------Modify Fund---------------//
modifyFund = async (FundID, alteredFundName) => {
  const fund = await models.Funds.findOne({ where: { FundID: FundID } });
  await fund.update({ FundName: alteredFundName });
};

deleteCompany = (CompanyID) => {
  return new Promise((resolve, reject) => {
    models.Companies.destroy({
      where: {
        CompanyID: CompanyID,
      },
    })
      .then((deletedCompany) => {
        console.log("deletion resolved");
        resolve(deletedCompany);
      })
      .catch((err) => {
        console.error("Error in Delete company: ", err);
        reject(err);
      });
  });
};

deleteFund = (FundID) => {
  return new Promise((resolve, reject) => {
    models.Funds.destroy({
      where: {
        FundID: FundID,
      },
    })
      .then((deletedFund) => {
        console.log("deleted ONLY a fund.");
        resolve(deletedFund);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

deleteSharedFunds = (ShareID) => {
  return new Promise((resolve, reject) => {
    models.SharedFunds.destroy({
      where: {
        SharingID: ShareID,
      },
    })
      .then((unsharedFund) => {
        console.log("Fund is no longer shared.");
        resolve(unsharedFund);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

deleteEmployeeHistory = (HistoryID) => {
  return new Promise((resolve, reject) => {
    models.EmployeeHistory.destroy({
      where: {
        HistoryID: HistoryID,
      },
    })
      .then((deletedHistory) => {
        console.log("Deleted an single employment record.");
        resolve(deletedHistory);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

//returns a list of objects
//TODO: Update
retrieveCompaniesByFunds = (fundID) => {
  return models.Companies.findAll({
    where: {
      FundID: fundID,
    },
  }).catch((err) => console.error(">>>ERROR in retrieveCompaniesByFunds, ", err));
};
retrieveCurrentEmployeesOfCompany = (CompanyID) => {
  return new Promise((resolve, reject) => {
    getAllIndividuals().then((people) => {
      Promise.all(
        people.map((person) => {
          return new Promise((resolve, reject) => {
            getIndividualCurrentEmployement(person.IndividualID).then((result) => {
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
                  position: result.PositionName,
                };
                resolve(info);
              }
            });
          });
        })
      ).then((results) => {
        resolve(results.filter((x) => x != null));
      });
    });
  }).catch((error) => {
    console.err("Error in retrieveCurrentEmployeesOfCompany", error);
    reject();
  });
};

retrieveIndividualsByOriginalCompany = (companyID) => {
  return models.OriginalFundPosition.findAll({
    where: { CompanyID: companyID },
    include: [
      {
        model: models.Individuals,
      },
    ],
  });
};
retrieveIndividualByID = async (individualID) => {
  return await models.Individuals.findOne({
    where: { IndividualID: individualID },
  });
};

retrieveFundName = (fundID) => {
  return new Promise((resolve, reject) => {
    models.Funds.findAll({
      where: {
        FundID: fundID,
      },
    }).then((result) => {
      if (result[0] != undefined) resolve(result[0].FundName);
      else resolve(undefined);
    });
  });
};

sharefund = (fundID, userID) => {
  return new Promise((resolve, reject) => {
    models.SharedFunds.findOrCreate({
      where: {
        FundID: fundID,
        UserID: userID,
      },
    }).then((result) => {
      resolve(result);
    });
  });
};

//Assumes company names are unique in a fund, or companies in the same fund with the same name are substitutable
retrieveCompanyByName = async (companyName, fundID) => {
  return await models.Companies.findOne({
    where: {
      FundID: fundID,
      CompanyName: companyName,
    },
  });
};

retrieveCompanyByID = (companyID) => {
  return new Promise((resolve, reject) => {
    models.Companies.findOne({
      where: {
        CompanyID: companyID,
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//returns the number of accounts with the specified username
checkUsageofUsername = (username) => {
  return new Promise((resolve, reject) => {
    models.User.findAll({
      where: {
        Username: username,
      },
    })
      .then((results) => {
        resolve(results.length);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//returns the number of accounts with the specified email
checkUsageofEmail = (email) => {
  return new Promise((resolve, reject) => {
    models.User.findAll({
      where: {
        Email: email,
      },
    })
      .then((results) => {
        resolve(results.length);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

createAccount = (username, email, password) => {
  return models.User.create({ Username: username, Password: password, Email: email });
};

getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: {
        Username: username,
      },
    }).then((user) => resolve(user));
  });
};

getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: {
        Email: email,
      },
    }).then((user) => resolve(user));
  });
};

getUserById = (id) => {
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: {
        UserID: id,
      },
    }).then((user) => {
      user !== null ? resolve(user) : reject();
    });
  });
};

getIndividualsForUpdates = async (UserID, LinkedInUrl, FundName) => {
  const userFunds = await models.Funds.findAll({ where: FundName ? { UserID, FundName } : { UserID } });
  const userFundIDs = userFunds.map((fund) => fund.FundID);

  return await models.Individuals.findAll({ where: { LinkedInUrl, FundID: userFundIDs } });
};

getCompanyById = async (CompanyID) => {
  return await models.Companies.findOne({ where: { CompanyID } });
};

getAllUsersRelatedToFund = async (FundID) => {
  const ownerId = (await models.Funds.findOne({ where: { FundID } })).UserID;
  const sharedWithIds = (await models.SharedFunds.findAll({ where: { FundID } })).map((sharedFund) => sharedFund.UserID);

  const allFundUsersIds = [ownerId, ...sharedWithIds];
  return await models.User.findAll({ where: { UserID: allFundUsersIds } });
};

getSharedWithUsers = async (FundID) => {
  const sharedWithIds = (await models.SharedFunds.findAll({ where: { FundID } })).map((sharedFund) => sharedFund.UserID);
  return await models.User.findAll({ where: { UserID: sharedWithIds } });
};

getFundsOwnedByUser = async (UserID) => {
  return models.Funds.findAll({ where: { UserID } });
};

getFundsSharedWithUser = async (UserID) => {
  const sharedFundsIDs = await models.SharedFunds.findAll({ where: { UserID } }).map((sharedFund) => sharedFund.FundID);

  return models.Funds.findAll({ where: { FundID: sharedFundsIDs } });
};

getFundById = async (FundID) => {
  return await models.Funds.findOne({ where: { FundID } });
};

module.exports = {
  getAllUsers,
  getAllIndividuals,
  getAllCompanies,
  getAllCompaniesOfUser,
  getAllFunds,
  getAllEmployeeHistory,
  insertPerson,
  insertCompany,
  insertEmployeeHistory,
  insertFromCsvLine,
  getIndividualEmployeeHistory,
  getIndividualCurrentEmployement,
  retrieveIndividualsByOriginalCompany,
  retrieveIndividualByID,
  modifyIndividual,
  deleteIndividual,
  modifyCompany,
  deleteCompany,
  deleteFund,
  modifyFund,
  retrieveCompaniesByFunds,
  retrieveCompanyByName,
  retrieveCompanyByID,
  retrieveCurrentEmployeesOfCompany,
  retrieveFundName,
  insertFund,
  checkUsageofUsername,
  checkUsageofEmail,
  createAccount,
  retrieveFundName,
  getUserByUsername,
  getUserByEmail,
  insertUser,
  getUserById,
  getIndividualsForUpdates,
  getCompanyById,
  getAllUsersRelatedToFund,
  updateEmployeeHistory,
  sharefund,
  getFundsUserCanSee,
  getFundsUserCanChange,
  getAllIndividualsOfUser,
  deleteSharedFunds,
  deleteEmployeeHistory,
  insertSharedFunds,
  getAllSharedFunds,
  insertQuarterEmployment,
  insertOriginalFundPosition,
  getSharedWithUsers,
  getFundsOwnedByUser,
  getFundsSharedWithUser,
  getFundById,
};
