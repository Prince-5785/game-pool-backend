const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DigitalProduct = sequelize.define(
    "DigitalProduct",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      barcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        default: 0.0, // Price per unit of the digital product
      },
      inventory_item: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Indicates if the product is an inventory item
      },
      item_for_sale: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Indicates if the product is available for sale
      },
      purchase_item: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Indicates if the product can be purchased 
      },
      ecommerce_article: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Indicates if the product is available for ecommerce
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1 = Active, 0 = Inactive
        validate: {
          isIn: [[0, 1]], // Example values: 0 = Inactive, 1 = Active
        },
        comment: "Status of the digital product (0 = Inactive, 1 = Active)",
      }
    },
    {
      tableName: "digital_product",
      timestamps: true,
      underscored: true,
    }
  );

  // Define associations if needed
  DigitalProduct.associate = (models) => {
    DigitalProduct.belongsTo(models.ProductCategory, {
      foreignKey: "category_id",
      targetKey: "id",
      as: "category",
    });

    DigitalProduct.belongsToMany(models.Pool, {
      through: models.DigitalProductPool,
      foreignKey: "digital_product_id",
      otherKey: "pool_id",
      as: "pools",
    });

    DigitalProduct.belongsToMany(models.PoolView, {
      through: models.DigitalProductPool,
      foreignKey: "digital_product_id",
      otherKey: "pool_id",
      as: "poolView",
    });

    DigitalProduct.hasMany(models.DigitalProductPool, {
      foreignKey: "digital_product_id",
      as: "digitalProductPool",
    });
  };

  return DigitalProduct;
};

