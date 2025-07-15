module.exports = (sequelize, DataTypes) => {
  const PoolView = sequelize.define(
    "PoolView",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      key: DataTypes.STRING,
      start_sale_date: DataTypes.DATE,
      start_sale_time: DataTypes.TIME,
      first_match_start_date: DataTypes.DATE,
      last_match_start_date: DataTypes.DATE,
      end_sale_date: DataTypes.DATE,
      pool_results_status: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1, 2]],
        },
      },
      dmquiniela_id: DataTypes.INTEGER,
      total_doubles: DataTypes.INTEGER,
      total_triples: DataTypes.INTEGER,
      status: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1, 2]],
        },
      },
      view: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]],
        },
      },
      ecommerce_expiry: DataTypes.INTEGER,
      online: DataTypes.BOOLEAN,
      type: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]], // Example values: 0 = Defined, 1 = Free
        },
      },

      // persisted view columns
      pool_status: DataTypes.STRING,
      pool_sales_status: DataTypes.STRING,
    },
    {
      tableName: "pool_views",
      timestamps: false,
    }
  );

  // // Make the view read-only
  // PoolView.beforeUpdate(() => {
  //   throw new Error("Cannot update a read-only view");
  // });
  // PoolView.beforeCreate(() => {
  //   throw new Error("Cannot insert into a read-only view");
  // });
  // PoolView.beforeDestroy(() => {
  //   throw new Error("Cannot delete from a read-only view");
  // });

  PoolView.associate = (models) => {
    // Define associations here if needed
    PoolView.belongsTo(models.Dmquiniela, {
      foreignKey: "dmquiniela_id",
      targetKey: "id",
      as: "dmquiniela",
    });

    // Add any other associations as needed
    PoolView.belongsToMany(models.DigitalProduct, {
      through: models.DigitalProductPool,
      foreignKey: "pool_id",
      otherKey: "digital_product_id",
      as: "digitalProduct",
    });
    PoolView.hasMany(models.DigitalProductPool, {
      foreignKey: "pool_id",
      as: "digitalProductPool",
    });
  };

  return PoolView;
};
