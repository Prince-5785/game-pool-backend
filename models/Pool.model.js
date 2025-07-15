module.exports = (sequelize, DataTypes) => {
  const Pool = sequelize.define(
    "Pool",
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      start_sale_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "Start date for pool sales",
      },
      start_sale_time: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: "Start time for pool sales",
      },
      first_match_start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Start date for the first match in the pool",
      },
      last_match_start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "Start date for the last match in the pool",
      },
      end_sale_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "End date for pool sales",
      },
      pool_results_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = Pending, 1 = Win, 2 = Loss
        validate: {
          isIn: [[0, 1, 2]],
        },
        comment: "0 = Pending, 1 = Win, 2 = Loss",
      },
      dmquiniela_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the associated Dmquiniela",
      },
      total_doubles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Total number of doubles in the pool",
      },
      total_triples: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Total number of triples in the pool",
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = Pending
        validate: {
          isIn: [[0, 1, 2]],
        },
        comment: "0 = Pending, 1 = Authorized, 2 = Rejected",
      },
      view: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = General, 1 = Conditional
        validate: {
          isIn: [[0, 1]],
        },
        comment: "0 = General, 1 = Conditional",
      },
      ecommerce_expiry: {
        type: DataTypes.INTEGER, // number of hours before the pool end sale the pool closes for ecommerce
        allowNull: false,
        defaultValue: 0,
        comment:
          "Number of hours before the pool end sale the pool closes for ecommerce",
      },
      online: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Indicates if the pool is available online",
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0 = Defined, 1 = Free
        validate: {
          isIn: [[0, 1]], // Example values: 0 = Defined, 1 = Free
        },
        comment: "Type of pool: 0 = Defined, 1 = Free",
      },
      pool_status: {
        type: DataTypes.VIRTUAL,
        get() {
          const now = new Date();
          const firstMatchStartDate = new Date(
            `${this.first_match_start_date}`
          );
          const lastMatchStartDate = new Date(this.last_match_start_date);

          if (now >= firstMatchStartDate && now <= lastMatchStartDate) {
            return "ongoing"; // Ongoing
          } else if (now < firstMatchStartDate) {
            return "upcoming"; // Upcoming
          } else if (now > lastMatchStartDate) {
            return "completed"; // Completed
          }
        },
      },
      pool_sales_status: {
        type: DataTypes.VIRTUAL,
        get() {
          const now = new Date();

          // Parse start_sale_date and start_sale_time
          let startDateTime;
          try {
            // Format the start_sale_date to ISO string if it's not already
            const formattedStartDate =
              this.start_sale_date instanceof Date
                ? this.start_sale_date.toISOString().split("T")[0]
                : new Date(this.start_sale_date).toISOString().split("T")[0];

            // Combine date and time
            startDateTime = new Date(
              `${formattedStartDate}T${this.start_sale_time}`
            );

            // If invalid, try alternative parsing
            if (isNaN(startDateTime.getTime())) {
              startDateTime = new Date(`${this.start_sale_date}`);
              const [hours, minutes, seconds] = this.start_sale_time.split(":");
              startDateTime.setHours(
                parseInt(hours, 10),
                parseInt(minutes, 10),
                parseInt(seconds || 0, 10)
              );
            }
          } catch (error) {
            console.error("Error parsing startDateTime:", error);
            startDateTime = new Date(0); // Use epoch as fallback
          }

          // Parse end_sale_date
          const endDateTime = new Date(this.end_sale_date);

          if (now >= startDateTime && now < endDateTime) {
            return "active"; // Active
          }
          return "inactive"; // Inactive
        },
      },
    },
    {
      tableName: "pools",
      timestamps: true,
      underscored: true,
    }
  );

  Pool.associate = (models) => {
    Pool.belongsToMany(models.Match, {
      through: models.PoolMatch,
      foreignKey: "pool_id",
      otherKey: "match_id",
      as: "matches",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Pool.hasMany(models.DistributerSalePool, {
      foreignKey: "pool_id",
      as: "distributorSalePool",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Pool.hasMany(models.PoolMatch, {
      foreignKey: "pool_id",
      as: "poolMatches",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Pool.belongsTo(models.Dmquiniela, {
      foreignKey: "dmquiniela_id",
      targetKey: "id",
      as: "dmquiniela",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    Pool.belongsToMany(models.DigitalProduct, {
      through: models.DigitalProductPool,
      foreignKey: "pool_id",
      otherKey: "digital_product_id",
      as: "digitalProduct",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Pool.hasMany(models.DigitalProductPool, {
      foreignKey: "pool_id",
      as: "digitalProductPool",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Pool.hasMany(models.ConditionalDistributorPool, {
      foreignKey: "pool_id",
      as: "conditionalDistributorPools",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Pool.hasMany(models.UserPurchasedPool, {
      foreignKey: "pool_id",
      as: "userPurchasedPools",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Pool.hasMany(models.UserPoolMatch, {
      foreignKey: "pool_id",
      as: "userPoolMatches",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Pool.hasMany(models.PoolCancellationRequest, {
      foreignKey: "pool_id",
      as: "poolCancellationRequest",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Pool;
};
