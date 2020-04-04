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
      const { userID } = req.user;
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

    let displayPerson = {
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
}
