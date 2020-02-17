const Sequelize = require('sequelize');
let result = require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE,process.env.USER,process.env.PASSWORD,{
    logging: false,
    host: process.env.HOST,
    dialect: 'mysql',
    define: {
      freezeTableName: true
    }
  });

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const Individuals = sequelize.define('individuals',{
    IndividualID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey : true,
      autoIncrement: true
    },
    IndividualName: {
      type: Sequelize.STRING
    },
    OriginalPostion: {
      type: Sequelize.STRING
    },
    LinkedInUrl : {
      type: Sequelize.STRING(500)
    },
    Comments : {
      type: Sequelize.STRING(500)
    }
  }, {
    //options:
    timestamps: false
  });
  
  const Companies = sequelize.define('companies',{
    CompanyID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey : true,
      autoIncrement: true
    },
    CompanyName: {
      type: Sequelize.STRING
    }
  }, {
    //Options: (These options relate to some Sequelize features.)
    timestamps: false
  });
  
  const Funds = sequelize.define('funds',{
    FundID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
      },
    FundName: {
      type: Sequelize.STRING
    }
  }, {
    //Options
    timestamps: false
  });

  const EmployeeHistory = sequelize.define('employeehistory',{
    HistoryID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    IndividualID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Individuals,
        key: 'IndividualID'
      }
    },
    CompanyID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: Companies,
          key: 'CompanyID'
      }
    },
    PositionName: {
      type: Sequelize.STRING
    },
    StartDate: {
      type: Sequelize.DATEONLY
    },
    EndDate:{
      type: Sequelize.DATEONLY
    }
  } ,{
    timestamps: false
  });

  const FundCompany = sequelize.define('fundcompanies',{
      FundCompanyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      FundID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Funds,
            key: 'FundID'
        }
      },
      CompanyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Companies,
            key: 'CompanyID'
        }
      }
    },{
        timestamps: false
      }
  );
 
  // (If I used hasMany, then an issue arose where it would use HistoryID instead of CompanyID)
  EmployeeHistory.belongsTo(Companies, {foreignKey: 'CompanyID'});
  FundCompany.belongsTo(Companies, {foreignKey: 'CompanyID'})

  module.exports = { //This determines what can be used from this custom module.
    Individuals,
    Companies,
    Funds,
    EmployeeHistory,
    FundCompany
  }