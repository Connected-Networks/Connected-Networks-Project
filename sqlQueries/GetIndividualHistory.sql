SELECT Companies.CompanyName, EmployeeHistory.PositionName, 
EmployeeHistory.StartDate, EmployeeHistory.EndDate
FROM ((EmployeeHistory INNER JOIN Companies ON EmployeeHistory.CompanyID = Companies.CompanyID)
	INNER JOIN Individuals ON EmployeeHistory.IndividualID = Individuals.IndividualID)
WHERE employeehistory.IndividualID = 2;
