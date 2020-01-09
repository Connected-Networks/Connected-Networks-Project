SELECT *
FROM (
	SELECT * 
	FROM employeehistory
	ORDER BY IndividualID, EndDate DESC)
AS TempOrderedTable
GROUP BY IndividualId;
/*
CREATE VIEW AllEmployeesOrdered AS
	SELECT * 
	FROM employeehistory
	ORDER BY IndividualID, EndDate DESC;
 */
 
 -- A combination of GROUP BY and ORDER BY does not seem to work. As such, we will need to run
 -- This line every group of inserts in order to get the most recent employee history
Alter Table  EmployeeHistory 
ORDER BY IndividualID, EndDate DESC;

SELECT * FROM employeehistory
GROUP BY IndividualID;

SELECT * FROM companies;
SELECT * FROM Individuals;
/* BELOW IS ATTEMPT AT MAKING ONE STATMENT FOR:
	-Name
    -Current Company
    -Current Position
    -Comments
    -LinkedInURL
*/
Alter Table  EmployeeHistory 
ORDER BY IndividualID, EndDate DESC;

SELECT IndividualName, CompanyName, PositionName, Comments, LinkedInUrl
FROM (Individuals
		INNER JOIN (SELECT * FROM employeehistory GROUP BY IndividualID) 
			AS tempSortedEmployeeTable
		ON
		Individuals.IndividualID = tempSortedEmployeeTable.IndividualID)
	INNER JOIN Companies ON tempSortedEmployeeTable.CompanyID = Companies.CompanyID;
	