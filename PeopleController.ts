const database = require("./sequelizeDatabase/sequelFunctions");

interface DisplayPerson {
  id: number;
  fundID: number;
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}

export default class PeopleController {
  static async getPeople(req, res) {
    try {
      const userID = req.user.UserID;
      const people = await this.retrievePeopleFromDatabase(userID);
      res.json({ data: people });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async retrievePeopleFromDatabase(userID) {
    const individuals = await database.getAllIndividualsOfUser(userID);

    return Promise.all(
      individuals.map(async individual => {
        return await this.processIndividualForDisplay(individual);
      })
    );
  }

  static async processIndividualForDisplay(individual) {
    const employment = await database.getIndividualCurrentEmployement(individual.IndividualID);

    let displayPerson: DisplayPerson = {
      id: individual.IndividualID,
      fundID: individual.FundID,
      name: individual.Name,
      company: "",
      position: "",
      hyperlink: individual.LinkedInUrl,
      comment: individual.comments
    };

    if (employment != null) {
      displayPerson.company = employment.company.CompanyName;
      displayPerson.position = employment.PositionName;
    }

    return displayPerson;
  }

  //retrieve all individuals whose most recent employment was in the specified company
  //Sends a 401 result with null information if user cannot see the company
  static async getPeopleOfCompany(req, res) {
    try {
      let userID = req.user.UserID;
      let companyID = req.params.companyID;
      if (!(await this.userSeesCompany(userID, companyID))) {
        res.sendStatus(401);
        return;
      } else {
        const people = await database.retrieveCurrentEmployeesOfCompany(companyID);
        if (!people) {
          res.sendStatus(500);
        } else {
          res.json({ data: people });
        }
      }
    } catch (error) {
      res.sendStatus(500);
    }
  }

  //Returns false if user cannot see the company, or the company doesn't exist
  static async userSeesCompany(userID, companyID): Promise<boolean> {
    return new Promise((resolve, reject) => {
      database
        .getFundsUserCanSee(userID)
        .then(fundList => {
          database
            .retrieveCompanyByID(companyID)
            .then(company => {
              if (company == null) resolve(false);
              let fundID = company.FundID;
              if (fundList.indexOf(fundID.toString()) > -1) resolve(true);
              else resolve(false);
            })
            .catch(error => {
              console.error("an error occured while retrieving information on company " + companyID);
            });
        })
        .catch(error => {
          console.error("an error occured while finding funds related to user " + userID);
        });
    });
  }

  static async updatePerson(req, res) {
    let person = req.body;
    let userID = req.user.UserID;
    let fundID = person.FundID;
    this.userCanChangeFund(userID, fundID).then(authorized => {
      if (!authorized) {
        console.error("user cannot update in the specified fund");
        res.sendStatus(401);
        return;
      }
      let update = this.updatePersonInDatabase(person);
      update.then(boolean => {
        if (boolean) res.sendStatus(200);
        else res.sendStatus(500);
      });
      update.catch(() => {
        res.sendStatus(500);
      });
    });
  }

  static userCanChangeFund(userID, fundID): Promise<boolean> {
    return new Promise((resolve, reject) => {
      database
        .getFundsUserCanChange(userID)
        .then(fundList => {
          if (fundList.indexOf(fundID.toString()) > -1) resolve(true);
          else resolve(false);
        })
        .catch(error => {
          console.error("an error occured while finding funds changeable by user " + userID);
        });
    });
  }

  //returns a promise boolean representing if the operation was successful
  //NOTE: FundID is specifically excluded as changeable
  static updatePersonInDatabase(person) {
    return new Promise<boolean>((resolve, reject) => {
      let update = database.modifyIndividual(person.id, person.name, person.hyperlink, person.comment);
      update.then(person => {
        resolve(true);
      });
      update.catch(error => {
        console.error(error);
        resolve(false);
      });
    });
  }

  static async addPerson(req, res) {
    let person = req.body.newData;
    let userID = req.user.UserID;
    let fundID = person.FundID;
    this.userCanChangeFund(userID, fundID)
      .then(authorized => {
        if (!authorized) {
          console.error("user cannot add an individual to that fund");
          res.sendStatus(500);
          return;
        }
        let i = this.insetPersonToDatabase(person);
        i.then(boolean => {
          if (boolean) res.sendStatus(200);
          else res.sendStatus(500);
        });
        i.catch(res.sendStatus(500));
      })
      .catch(() => {
        res.sendStatus(500);
      });
  }

  //returns a promise boolean representing if the operation was successful
  static insetPersonToDatabase(person) {
    return new Promise<boolean>((resolve, reject) => {
      let insert = database.insertPerson(person.name, person.fundID, person.position, person.hyperlink, person.comment);
      insert.then(person => {
        resolve(true);
      });
      insert.catch(error => {
        console.error(error);
        resolve(false);
      });
    });
  }

  static async deletePerson(req, res) {
    let person = req.params.id;
    let userID = req.user.UserID;
    let fundID = person.FundID;
    PeopleController.userCanChangeFund(userID, fundID).then(authorized => {
      if (!authorized) {
        console.error("User cannot delete the individual");
        res.sendStatus(500);
        return;
      }
      let d = this.deletePersonFromDatabase(person);
      d.then(boolean => {
        if (boolean) res.sendStatus(200);
        else res.sendStatus(500);
      });
      d.catch(res.sendStatus(500));
    });
  }

  //returns a promise boolean representing if the operation was successful
  static deletePersonFromDatabase(person) {
    return new Promise<boolean>((resolve, reject) => {
      console.log("starting deletion");
      let del = database.deleteIndividual(person);
      del.then(person => {
        resolve(true);
      });
      del.catch(error => {
        reject(false);
      });
    });
  }
}
