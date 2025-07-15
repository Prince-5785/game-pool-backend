module.exports = (sequelize, DataTypes) => {
    const Region = sequelize.define(
        "Region",
        {
            key:{
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            name:{
                type: DataTypes.STRING,
                allowNull:false,

            }
        },
        {
            tableName: "region",
            timestamps: true,
        }
    );
    Region.associate = (models) => {
        Region.hasMany(models.League, {
            foreignKey: "region_key",
            sourceKey: "key",
            as: "leagues",
        });
    };
    
    return Region;
}