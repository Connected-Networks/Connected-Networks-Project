import BackendProcessing from "./backend-processing";
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
}
