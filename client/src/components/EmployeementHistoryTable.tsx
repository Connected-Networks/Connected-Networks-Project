import axios from "axios";
import DetailsTable from "./DetailsTable";
import EditableObject from "./EditableObject";


export interface DisplayEmploymentHistory {
    id: number; // History ID for when they changed jobs
    company:    string;
    position:   string;
    start:  string; // Start date
    end:    string; // End date 
}

export default class EmploymentHistoryTable extends DetailsTable<DisplayEmploymentHistory> {

    readonly TABLE_NAME = "Employment History";

    state = {
      data: [],
      columns: [
        { title: "Company", field: "company" },
        { title: "Position", field: "position" },
        { title: "Start Date", field: "start" },
        { title: "End Date", field: "end" }
      ]
    };

    get editableObject(): EditableObject<DisplayEmploymentHistory> {
        return {
          onRowUpdate: this.updateRow,
          onRowDelete: this.deleteRow
        };
      }

    get name(): string {
        return this.TABLE_NAME;
    }

    updateRow = async (newData: DisplayEmploymentHistory, oldData?: DisplayEmploymentHistory | undefined): Promise<void> => {
        return new Promise(resolve => {
          setTimeout(() => {
            if (oldData) {
              console.log(newData);
              this.updateHistoryOnServer(newData).then(() => {
                this.refreshTable();
                resolve();
              });
            }
          }, 600);
        });
      };
    
      updateHistoryOnServer = async (history: DisplayEmploymentHistory) => {
        return new Promise((resolve, reject) => {
          axios
            .put("/history", history)
            .then(response => {
              if (response.status === 200) {
                resolve();
              } else {
                reject();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        });
      };
    
      deleteRow = async (oldData: DisplayEmploymentHistory): Promise<void> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.deleteHistoryOnServer(oldData)
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
    
      deleteHistoryOnServer = async (oldData: DisplayEmploymentHistory) => {
        return new Promise((resolve, reject) => {
          const personID = oldData.id;
          axios
            .delete(`/people/${personID}`)
            .then(response => {
              console.log("status: " + response.status);
              resolve();
            })
            .catch(function(error) {
              console.log(error);
              reject();
            });
        });
      };

    
}