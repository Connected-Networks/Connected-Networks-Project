import axios from "axios";
import ATable, { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import React from "react";

export interface DisplayPerson {
  id: number;
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}

export default class PeopleTable extends ATable<DisplayPerson> {
  readonly TABLE_NAME = "People";
  readonly DATA_END_POINT = "/people";

  state: TableState<DisplayPerson> = {
    data: [],
    columns: [
      { title: "Name", field: "name" },
      { title: "Company", field: "company" },
      { title: "Position", field: "position" },
    ],
  };

  get editableObject(): EditableObject<DisplayPerson> {
    return {
      onRowAdd: this.addRow,
      onRowUpdate: this.updateRow,
      onRowDelete: this.deleteRow,
    };
  }

  get name(): string {
    return this.TABLE_NAME;
  }

  get dataEndPoint(): string {
    return this.DATA_END_POINT;
  }

  /**
   * This method takes two rows and updates the old row on the table with the new one
   *
   * @param newData
   * @param oldData
   */
  updateRow = async (newData: DisplayPerson, oldData?: DisplayPerson | undefined): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (oldData) {
          console.log(newData);
          this.updatePersonOnServer(newData).then(() => {
            this.refreshTable();
            resolve();
          });
        }
      }, 600);
    });
  };

  updatePersonOnServer = async (newData: DisplayPerson) => {
    return new Promise((resolve, reject) => {
      axios
        .put("/people", { newData })
        .then((response) => {
          if (response.status === 200) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  addRow = async (newData: DisplayPerson): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (newData) {
          console.log(newData);
          this.addPersonOnServer(newData).then(() => {
            resolve();
          });
        }
      }, 1000);
    });
  };

  addPersonOnServer = async (newData: DisplayPerson) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`/people`, { newData })
        .then((response) => {
          if (response.status === 200) {
            this.refreshTable();
            resolve();
          } else {
            this.refreshTable();
            reject();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  deleteRow = async (oldData: DisplayPerson): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.deletePersonOnServer(oldData)
          .then(() => {
            this.refreshTable();
            resolve();
          })
          .catch(() => {
            this.refreshTable();
            resolve();
          });
      }, 1000);
    });
  };

  deletePersonOnServer = async (oldData: DisplayPerson) => {
    return new Promise((resolve, reject) => {
      const personID = oldData.id; //Temp until we make ids for people
      axios
        .delete(`/people/${personID}`)
        .then((response) => {
          console.log("status: " + response.status);
          resolve();
        })
        .catch(function (error) {
          console.log(error);
          reject();
        });
    });
  };
}
