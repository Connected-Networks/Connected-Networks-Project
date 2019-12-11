INSERT INTO Individuals (
	IndividualID,
	IndividualName,
	CurrentCompany,
	CurrentPosition,
	LinkedInUrl,
	Comments
) VALUES (1, "Sean M", "Google Incorporated", "Executive", "URL",  "No Comment");

INSERT INTO Individuals (
	IndividualID,
	IndividualName,
	CurrentCompany,
	CurrentPosition,
	LinkedInUrl,
	Comments
) VALUES (2, "Brain M", "Microsoft Studio", "Developer", "individualsUrl",  "No Comment");

INSERT INTO Companies (CompanyID, CompanyName) VALUES (1, "Google");

INSERT INTO Companies  (CompanyID, CompanyName) VALUES (2, "Microsoft");

INSERT INTO Companies  (CompanyID, CompanyName) VALUES (3, "Bethesda");

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (1,1, "Most Recent Executive",  '2019-12-03', '2019-12-05');

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (1,1, "Google Intern", '2018-12-03', '2019-05-13');

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (2,2, "Most Recent Executive Microsoft", '2019-12-03', '2019-12-05');

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (2,2, "Microsoft Intern", '2018-12-03', '2019-05-13');

INSERT INTO Funds (FundID, FundName) VALUES (1, "First Fund");

INSERT INTO Funds (FundID, FundName) VALUES (2, "Second Fund");

INSERT INTO FundCompanies (FundID, CompanyID) VALUES (1,1);

INSERT INTO FundCompanies (FundID, CompanyID) VALUES (2,2);

INSERT INTO FundCompanies (FundID, CompanyID) VALUES (2,3);