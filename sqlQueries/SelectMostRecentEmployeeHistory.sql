SELECT *
FROM (
	SELECT * 
	FROM employeehistory
	ORDER BY IndividualID, EndDate DESC)
AS TempOrderedTable
GROUP BY TempOrderedTable.IndividualId;

SELECT * 
FROM employeehistory
ORDER BY IndividualID, EndDate DESC;
    
SELECT * FROM employeeHistory;