INSERT INTO Individuals (
	IndividualName,
    OriginalPostion,
	LinkedInUrl,
	Comments
) VALUES ("Sean M", "Executive", "URL",  "No Comment");

INSERT INTO Individuals (
	IndividualName,
    OriginalPostion,
	LinkedInUrl,
	Comments
) VALUES ("Brain M", "Developer", "individualsUrl",  "No Comment");

INSERT INTO Companies (CompanyName) VALUES ("Google");

INSERT INTO Companies  (CompanyName) VALUES ("Microsoft");

INSERT INTO Companies  (CompanyName) VALUES ("Bethesda");

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (1,1, "Most Recent Executive",  '2019-12-03', '2019-12-05');

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (1,1, "Google Intern", '2018-12-03', '2019-05-13');

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (2,2, "Most Recent Executive Microsoft", '2019-12-03', '2019-12-05');

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (2,2, "Microsoft Intern", '2018-12-03', '2019-05-13');

INSERT INTO Funds (FundName) VALUES ("First Fund");

INSERT INTO Funds (FundName) VALUES ("Second Fund");

INSERT INTO FundCompanies (FundID, CompanyID) VALUES (1,1);

INSERT INTO FundCompanies (FundID, CompanyID) VALUES (2,2);

INSERT INTO FundCompanies (FundID, CompanyID) VALUES (2,3);