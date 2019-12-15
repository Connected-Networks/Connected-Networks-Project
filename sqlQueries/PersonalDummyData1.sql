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

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (1,1, "Most Recent Executive",  '2019-12-02', '2019-12-04');

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (1,1, "Google Intern", '2018-12-03', '2019-05-13');

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (2,2, "Most Recent Executive Microsoft", '2019-12-03', '2019-12-05');

INSERT INTO EmployeeHistory  (IndividualID,CompanyID,	PositionName,	StartDate,EndDate) VALUES (2,2, "Microsoft Intern", '2018-12-03', '2019-05-13');

INSERT INTO Funds (FundName) VALUES ("First Fund");

INSERT INTO Funds (FundName) VALUES ("Second Fund");

INSERT INTO FundCompanies (FundID, CompanyID) VALUES (1,1);

INSERT INTO FundCompanies (FundID, CompanyID) VALUES (2,2);

INSERT INTO FundCompanies (FundID, CompanyID) VALUES (2,3);

/* -- This section was meant to be as test to see if duplicate ids were allowed. 
INSERT INTO Individuals (
	IndividualID,
	IndividualName,
    OriginalPostion,
	LinkedInUrl,
	Comments
) VALUES (1, "Brain M", "Developer", "individualsUrl",  "No Comment");
*/

/* 12/15/19 For Branch #20: 
	Data for this is meant to test GROUP BY and ORDER BY in
    EmployeeHistory, so that it can be used for obtaining the 
    most recent employee positions.
*/

INSERT INTO Individuals (
	IndividualName,
    OriginalPostion,
	LinkedInUrl,
	Comments
) VALUES ("Riley M", "Originally a Programmer", "individualsUrl",  "No Comment");

INSERT INTO EmployeeHistory  (
	IndividualID,
    CompanyID,	
    PositionName,	
    StartDate,
    EndDate
) VALUES (3,3, "Oldest Bethesda Position",  '2015-01-30', '2015-12-04');

INSERT INTO EmployeeHistory  (
	IndividualID,
    CompanyID,	
    PositionName,	
    StartDate,
    EndDate
) VALUES (3,3, "Most Recent/Current Bethesda Position",  '2019-01-30', '2019-05-11');

INSERT INTO EmployeeHistory  (
	IndividualID,
    CompanyID,	
    PositionName,	
    StartDate,
    EndDate
) VALUES (3,3, "Middle Years Bethesda Position",  '2016-01-30', '2016-12-03');


