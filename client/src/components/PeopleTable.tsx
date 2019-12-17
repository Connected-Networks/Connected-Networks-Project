import React from 'react';
import MaterialTable, { Column } from 'material-table';
import axios from "axios";

interface Row {
    name: string;
    companyAndPosition: string
}

interface TableState {
    columns: Array<Column<Row>>;
    data: Row[];
}

interface DisplayPerson {
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}

interface TableState {
  people: DisplayPerson[];
  columns: Array<Column<Row>>;
  data: Row[];
}

  
export default class PeopleTable extends React.Component<any, TableState> {

    state: TableState = {
      people: [],
      columns: [
          { title: 'Name', field: 'name' },
          { title: 'Company', field: 'companyAndPosition' }
        ],
        data: []
    };


    /**
     * This method sends an AJAX get request to get people
     */
    async getPeople() {
        axios
          .get("/people")
          .then( (response) => {
            let people: DisplayPerson[] = response.data;

            this.setState( {people: people});

            console.log(response);

            return people;
          })
          .catch(function(error) {
            console.log(error);
          });
      };

    /**
     * This takes in the local data state on poeple and refreshes the table based on that.
     */
    refreshTable() {
      // Clear data
      this.setState( { data: [] } );

      this.state.people.forEach( person => {
        let r: Row = {
          name: person.name,
          companyAndPosition: person.company.concat(" | " + person.position)
      }
        this.addRow(r);
      });

    }
      /**
       * This method takes two rows and updates the old row on the table with the new one
       * 
       * @param newData 
       * @param oldData 
       */
      async updateRow(newData: Row, oldData?: Row | undefined): Promise<void> {
        return new Promise( resolve => {
          setTimeout(() => {
            resolve();
            if (oldData) {
              this.setState( (prevState) => {
                const data = [...prevState.data];
                data[data.indexOf(oldData)] = newData;
                return { ...prevState, data };
              });
            }
          }, 600);
        })
      }

      
      async addRow(newData: Row): Promise<void> {
        
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            if (newData) {
              const data = this.state.data;
              data.push(newData);
              this.setState({ data }, () => resolve());
            }
            resolve()
          }, 1000)
        })
      }

      async deleteRow(oldData: Row): Promise<void> {
              return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      let data = this.state.data;
                      const index = data.indexOf(oldData);
                      data.splice(index, 1);
                      this.setState({ data }, () => resolve());
                    }
                    resolve()
                  }, 1000)
                })
      }

      /**
       * Once this loaded, this code will run.
       */
      componentDidMount() {
        this.getPeople();
        this.refreshTable();
      }

    render() {
      return (
        <MaterialTable
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: this.addRow,
            onRowUpdate: this.updateRow,
            onRowDelete: this.deleteRow
          }}
          // editable={{
          //   onRowAdd: newData =>
          //     new Promise(resolve => {
          //       setTimeout(() => {
          //         resolve();
          //         this.setState(prevState => {
          //           const data = [...prevState.data];
          //           data.push(newData);
          //           return { ...prevState, data };
          //         });
          //       }, 600);
          //     }),
          //   onRowUpdate: this.updateRow,
          //   onRowDelete: oldData =>
          //     new Promise(resolve => {
          //       setTimeout(() => {
          //         resolve();
          //         this.setState(prevState => {
          //           const data = [...prevState.data];
          //           data.splice(data.indexOf(oldData), 1);
          //           return { ...prevState, data };
          //         });
          //       }, 600);
          //     }),
          // }}
        />
      );
        }
};