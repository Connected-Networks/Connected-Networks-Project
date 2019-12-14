/*
CREATE PROCEDURE ImportFromCvsLine
	@EmployeeName varchar(255),
    @OriginalPosition varchar(255),
    @OriginalStartDate date,
    @OriginalEndDate date,
    @CurrentEmployer varchar(255),
    @CurrentPosition varchar(255),
    @LinkedInUrl varchar(500),
    @Comments varchar(500)
AS
	DECLARE new_IndividualID int;
    DECLARE new_CompanyID int;
	INSERT INTO Individuals (
		IndividualName,
		OriginalPostion,
		LinkedInUrl,
		Comments
	) VALUES (@EmployeeName, @OriginalPosition, @LinkedInUrl,  @Comments);
    -- An already existing function: "last_insert_id()" installs the last id created, which I believe to be the last primary key generated.
    SET new_IndividualID = last_insert_id();
    
    INSERT INTO Companies (CompanyName) VALUES (@CurrentEmployer);
    SET new_CompanyID = last_insert_id();
    INSERT INTO EmployeeHistory(
		IndividualID,
        CompanyID,	
        PositionName,	
        StartDate,
        EndDate)
	VALUES (new_IndividualID, new_CompanyID, @CurrentPosition, @OriginalStartDate, @OriginalEndDate);

    
*/
/* Deterimine if a name is already in use, returns a table with the number of rows, which should be either 1 or zero.
SELECT EXISTS (SELECT * 
FROM Individuals 
WHERE IndividualName = "Sean ")
*/

INSERT INTO Individuals (
		IndividualName,
		OriginalPostion,
		LinkedInUrl,
		Comments
	) VALUES ("TestDummy", "TestPosition", "TestURL",  "This is me experimenting with last_insert_id()");
SELECT last_insert_id();
SELECT * FROM individuals;

