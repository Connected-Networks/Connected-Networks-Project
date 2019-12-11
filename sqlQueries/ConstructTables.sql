CREATE TABLE Individuals (
	IndividualID int,
	IndividualName varchar(255),
	CurrentCompany varchar(255),
	CurrentPosition varchar(255),
	LinkedInUrl varchar(500),
	Comments varchar(500)
);

CREATE TABLE Companies (
	CompanyID int,
	CompanyName varchar(255)
);
CREATE TABLE EmployeeHistory (
	IndividualID int,
	CompanyID int,
	PositionName varchar(255),
	StartDate date,
	EndDate date
);

CREATE TABLE Funds (
	FundID int,
	FundName varchar(255)
);

CREATE TABLE FundCompanies (
	FundID int,
	CompanyID int
);
