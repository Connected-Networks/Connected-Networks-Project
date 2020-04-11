import * as React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { DisplayCompany } from "./CompaniesTable";

interface CompaniesDropdownProps {
  fundID: number;
  onSelect: (newCompanyID: number) => void;
}

export default function CompaniesDropdown(props: CompaniesDropdownProps) {
  const getFundCompanies = (fundID: number) => {
    return new Promise<DisplayCompany[]>((resolve) => {
      axios
        .get("/funds/" + props.fundID)
        .then((response) => resolve(response.data.data))
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedCompanyID, setSelectedCompanyID] = React.useState<number>(-1);
  const [companiesList, setCompaniesList] = React.useState<DisplayCompany[]>([]);

  const getFundCompaniesList = () => {
    getFundCompanies(props.fundID)
      .then((data) => {
        setCompaniesList(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getFirstCompany = (): string => {
    getFundCompaniesList();

    return companiesList[0] ? companiesList[0].name : "No company available";
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        {getFirstCompany()}
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {companiesList.map((company) => (
          <MenuItem
            key={company.id}
            onClick={() => {
              setSelectedCompanyID(company.id);
              props.onSelect(company.id);
              handleClose();
            }}
          >
            {company.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
