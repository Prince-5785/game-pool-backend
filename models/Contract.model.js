const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Contract = sequelize.define('Contract', {
        contract_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        client: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        referrals: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        annexes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, // 0 = Pending
            validate: {
              isIn: [[0, 1, 2]]
            },
            comment: '0 = Pending, 1 = Authorized, 2 = Rejected'
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'contract',
        timestamps: true,
        underscored: true,
    });

    return Contract;
};
