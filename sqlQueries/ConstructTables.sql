CREATE TABLE Individuals (
	IndividualID int NOT NULL AUTO_INCREMENT,
	IndividualName varchar(255),
    OriginalPostion varchar(255),
	LinkedInUrl varchar(500),
	Comments varchar(500),
    PRIMARY KEY (IndividualID)
);

CREATE TABLE Companies (
	CompanyID int NOT NULL AUTO_INCREMENT,
	CompanyName varchar(255),
    PRIMARY KEY (CompanyID)
);
CREATE TABLE EmployeeHistory (
	IndividualID int NOT NULL,
	CompanyID int NOT NULL,
	PositionName varchar(255),
	StartDate date,
	EndDate date,
    FOREIGN KEY (IndividualID) REFERENCES Individuals (IndividualID),
    FOREIGN KEY (CompanyID) REFERENCES Companies (CompanyID)
);

CREATE TABLE Funds (
	FundID int NOT NULL AUTO_INCREMENT,
	FundName varchar(255),
    PRIMARY KEY (FundID)
);

CREATE TABLE FundCompanies (
	FundID int NOT NULL,
	CompanyID int NOT NULL,
    FOREIGN KEY (FundID) REFERENCES Funds(FundID),
    FOREIGN KEY (CompanyID) REFERENCES Companies (CompanyID)
);
