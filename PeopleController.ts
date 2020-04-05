const database = require("./sequelizeDatabase/sequelFunctions");

export interface DisplayPerson {
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
      individuals.map(async (individual) => {
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
      comment: individual.comments,
    };

    if (employment != null) {
      displayPerson.company = employment.company.CompanyName;
      displayPerson.position = employment.PositionName;
    }

    return displayPerson;
  }

  //retrieve all individuals whose most recent employment was in the specified company
  //Sends a 401 result with null information if user cannot see the company
  static async getPeopleByCompany(req, res) {
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
        .then((fundList) => {
          database
            .retrieveCompanyByID(companyID)
            .then((company) => {
              if (company == null) resolve(false);
              let fundID = company.FundID;
              if (fundList.indexOf(fundID.toString()) > -1) resolve(true);
              else resolve(false);
            })
            .catch((error) => {
              console.error("an error occured while retrieving information on company " + companyID);
            });
        })
        .catch((error) => {
          console.error("an error occured while finding funds related to user " + userID);
        });
    });
  }

  static async getPeopleByOriginalCompany(req, res) {
    try {
      let companyID = req.params.id;
      let userID = req.user.UserID;

      if (!(await this.userSeesCompany(userID, companyID))) {
        console.error("User " + userID + " cannot view company " + companyID);
        res.sendStatus(500);
        return;
      }
      const people = await this.getPeopleByOriginalCompanyFromDatabase(companyID);
      if (!people) {
        res.sendStatus(500);
      } else {
        res.json({ data: people });
      }
    } catch (error) {
      res.sendStatus(500);
    }
  }

  //Assumes that OriginalFundPosition table will not have duplicate combinations of IndividualID and CompanyID
  //If this assumption is wrong, this function may return duplicate entries
  static async getPeopleByOriginalCompanyFromDatabase(companyID): Promise<Object> {
    const people = await database.retrieveIndividualsByOriginalCompany(companyID);

    return people.map((entry) => {
      let displayPerson: DisplayPerson = {
        id: entry.Individual.IndividualID,
        fundID: entry.Individual.FundID,
        name: entry.Individual.Name,
        //should not be needed. If it ever is, the db function could easily be edited to include companies table, at the cost of running time.
        company: null,
        position: entry.PositionName,
        comment: entry.Individual.Comments,
        hyperlink: entry.Individual.LinkedInUrl,
      };
      return displayPerson;
    });
  }

  static async updatePerson(req, res) {
    try {
      const person = req.body;
      const userID = req.user.UserID;
      const fundID = person.FundID;

      if (!(await this.userCanChangeFund(userID, fundID))) {
        console.error("user cannot update in the specified fund");
        res.sendStatus(401);
        return;
      }

      await database.modifyIndividual(person.id, person.name, person.hyperlink, person.comment);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static userCanChangeFund(userID, fundID): Promise<boolean> {
    return new Promise((resolve, reject) => {
      database
        .getFundsUserCanChange(userID)
        .then((fundList) => {
          if (fundList.indexOf(fundID.toString()) > -1) resolve(true);
          else resolve(false);
        })
        .catch((error) => {
          console.error("an error occured while finding funds changeable by user " + userID);
          throw error;
        });
    });
  }

  static async addPerson(req, res) {
    let person = req.body.newData;
    let userID = req.user.UserID;
    let fundID = person.FundID;
    try {
      if (!(await this.userCanChangeFund(userID, fundID))) {
        console.error("user cannot add an individual to that fund");
        res.sendStatus(401);
        return;
      }

      await database.insertPerson(person.name, person.fundID, person.position, person.hyperlink, person.comment);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async deletePerson(req, res) {
    try {
      let person = req.params.id;
      let userID = req.user.UserID;
      let fundID = person.FundID;

      if (!(await this.userCanChangeFund(userID, fundID))) {
        console.error("User cannot delete the individual");
        res.sendStatus(500);
        return;
      }
      await database.deleteIndividual(person);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
}
