DELIMITER // 
CREATE PROCEDURE DisplayAllEmployeeCurrents()
BEGIN

-- The Following Line is needed to ensure that the most recent position is being used.
-- While used whenever this procedure is called, it is best used after all CSV inserts
-- are completed.
Alter Table  EmployeeHistory ORDER BY IndividualID, EndDate DESC; 

SELECT IndividualName, CompanyName, PositionName, Comments, LinkedInUrl
FROM (Individuals
		INNER JOIN (SELECT * FROM employeehistory GROUP BY IndividualID) 
			AS tempSortedEmployeeTable
		ON
		Individuals.IndividualID = tempSortedEmployeeTable.IndividualID)
	INNER JOIN Companies ON tempSortedEmployeeTable.CompanyID = Companies.CompanyID;
END //
DELIMITER ;
