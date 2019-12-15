SELECT *
FROM (
	SELECT * 
	FROM employeehistory
	ORDER BY IndividualID, EndDate DESC)
AS TempOrderedTable
GROUP BY IndividualId;

SELECT * 
FROM employeehistory
ORDER BY IndividualID, EndDate DESC
GROUP BY IndividualID;

