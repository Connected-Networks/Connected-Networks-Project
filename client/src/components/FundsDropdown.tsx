import * as React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { DisplayFund, DisplayPerson } from "./PeopleTable";
import { resolve } from "dns";

interface FundsDropdownProps {
  fundsList: DisplayFund[];
  person: DisplayPerson;
}

export default function FundsDropdown(props: FundsDropdownProps) {
  const findFund = (fundID: number): string => {
    console.log(props.fundsList);
    let found = props.fundsList.find((fund: DisplayFund) => {
      return fund.id == fundID;
    });
    console.log(found);
    return found ? found.name : "test";
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedFundID, setSelectedFundID] = React.useState<number>(
    props.person.fundID
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = () => {
    return new Promise((resolve, reject) => {
      axios
        .put("/people", {
          newData: { ...props.person, fundID: selectedFundID },
        })
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

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {findFund(selectedFundID)}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.fundsList.map((fund) => (
          <MenuItem
            key={fund.id}
            onClick={() => {
              setSelectedFundID(fund.id);
              handleSelect();
              handleClose();
            }}
          >
            {fund.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
