module.exports = (sequelize, DataTypes) => {
    const Country = sequelize.define('Country', {
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'countries',
        timestamps: true,
    });

    Country.associate = models => {
        Country.hasMany(models.Team, {
            foreignKey: 'country_key',
            sourceKey: 'key',
            as: 'teams',
        });
        Country.hasMany(models.League, {
            foreignKey: 'country_key',
            sourceKey: 'key',
            as: 'leagues',
        });
    };
    return Country;
};
 