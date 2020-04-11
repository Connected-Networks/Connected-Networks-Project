import * as React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { DisplayCompany } from "./CompaniesTable";
import { ReactComponent } from "*.svg";

interface CompaniesDropdownProps {
  fundID: number;
  companyID: number;
  onSelect: (newCompany: DisplayCompany) => void;
}

interface CompaniesDropdownState {
  anchorEl: null | HTMLElement;
  selectedCompanyID: number;
  companiesList: DisplayCompany[];
  fundID: number;
}

export default class CompaniesDropdown extends React.Component<CompaniesDropdownProps, CompaniesDropdownState> {
  state: CompaniesDropdownState = {
    anchorEl: null,
    selectedCompanyID: this.props.companyID,
    companiesList: [],
    fundID: this.props.fundID,
  };

  getFundCompanies = (fundID: number) => {
    return new Promise<DisplayCompany[]>((resolve) => {
      axios
        .get("/funds/" + fundID)
        .then((response) => resolve(response.data.data))
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  componentDidMount() {
    this.getFundCompaniesList();
  }

  getFundCompaniesList = () => {
    this.getFundCompanies(this.state.fundID)
      .then((data) => {
        this.setState({ companiesList: data });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  getCompany = (): string => {
    if (this.state.selectedCompanyID) {
      let found = this.state.companiesList.find((company) => {
        return company.id == this.state.selectedCompanyID;
      });

      if (found) {
        return found.name;
      }

      console.error("Company fund mismatch. This company ID does not exist in the selected fund.");
      return " Company fund mismatch ";
    }

    if (this.state.companiesList[0]) {
      this.setState({ selectedCompanyID: this.state.companiesList[0].id });
      return this.state.companiesList[0].name;
    }

    return "No company available";
  };

  render() {
    return (
      <>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
          {this.getCompany()}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          {this.state.companiesList.map((company) => (
            <MenuItem
              key={company.id}
              onClick={() => {
                this.setState({ selectedCompanyID: company.id });
                this.props.onSelect(company);
                this.handleClose();
              }}
            >
              {company.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }
}
