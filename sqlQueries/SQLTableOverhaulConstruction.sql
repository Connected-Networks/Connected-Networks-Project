CREATE TABLE User (
	UserID int NOT NULL AUTO_INCREMENT,
    Username varchar(255) NOT NULL,
    Password varchar(255) NOT NULL,
    Email varchar(255) NOT NULL,
    PRIMARY KEY (UserID)
);

CREATE TABLE Funds (
	FundID int NOT NULL AUTO_INCREMENT,
	FundName varchar(255),
    UserID int NOT NULL,
    PRIMARY KEY (FundID),
	FOREIGN KEY (UserID) REFERENCES User (UserID)
);

CREATE TABLE Individuals (
	IndividualID int NOT NULL AUTO_INCREMENT,
    FundID int NOT NULL,
    Name varchar(500),
	LinkedInUrl varchar(500),
    Comments varchar(500),
    PRIMARY KEY (IndividualID),
    FOREIGN KEY (FundID) REFERENCES Funds (FundID)
);

CREATE TABLE SharedFunds (
	SharingID int NOT NULL AUTO_INCREMENT,
    FundID int NOT NULL,
    UserID int NOT NULL,
    PRIMARY KEY (SharingID),
    FOREIGN KEY (UserID) REFERENCES User (UserID),
    FOREIGN KEY (FundID) REFERENCES Funds (FundID)
);

CREATE TABLE Companies (
	CompanyID int NOT NULL AUTO_INCREMENT,
    FundID int NOT NULL,
	CompanyName varchar(255),
    PRIMARY KEY (CompanyID),
    FOREIGN KEY (FundID) REFERENCES Funds (FundID)
);


CREATE TABLE EmployeeHistory (
	HistoryID int NOT NULL AUTO_INCREMENT,
    UserID int NOT NULL,
	IndividualID int NOT NULL,
	CompanyID int NOT NULL,
	PositionName varchar(255),
	StartDate date,
	EndDate date,
    FOREIGN KEY (IndividualID) REFERENCES Individuals (IndividualID),
    FOREIGN KEY (CompanyID) REFERENCES Companies (CompanyID),
    FOREIGN KEY (UserID) REFERENCES User (UserID),
	PRIMARY KEY (HistoryID)
);

CREATE TABLE OriginalFundPosition (
	OriginalPosID int NOT NULL AUTO_INCREMENT,
    IndividualID int NOT NULL,
    CompanyID int NOT NULL,
    PositionName varchar(255),
    PRIMARY KEY (OriginalPosID),
    FOREIGN KEY (IndividualID) REFERENCES Individuals (IndividualID),
    FOREIGN KEY (CompanyID) REFERENCES Companies (CompanyID)
);

INSERT INTO User(
	Username,
    Password,
    Email)
VALUES ('test username', 'test password', 'test email'); #TODO: Delete this insert once we have user functionality.

