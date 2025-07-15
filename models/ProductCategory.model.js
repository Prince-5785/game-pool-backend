const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductCategory = sequelize.define(
        "ProductCategory",
        {
            key: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true, // true = Active, false = Inactive
            },
        },
        {
            tableName: "product_categories",
            timestamps: true,
            underscored: true,
        }
    );

    // Define associations if needed
    ProductCategory.associate = (models) => {
        ProductCategory.hasMany(models.DigitalProduct, {
            foreignKey: "category_id",
            as: "products",
        });
    };

    return ProductCategory;
}