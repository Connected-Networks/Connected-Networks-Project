SELECT *
FROM (
	SELECT * 
	FROM employeehistory
	ORDER BY IndividualID, EndDate DESC)
    AS TempOrderedTable
GROUP BY IndividualId;
